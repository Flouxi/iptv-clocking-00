import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
import catalog from './pdf-catalog.json';
const SESSION = /^cs_(?:live|test)_[A-Za-z0-9]{20,200}$/;
export const DOWNLOAD_SECONDS = 30 * 24 * 60 * 60;
const files = new Map(catalog.map(p => [p.slug, p]));
export class DownloadDenied extends Error {}

/** Never infer the purchased product from its price. Stripe supplies the actual line item. */
export function validatePdfPayment(s: any, now = Date.now() / 1000) {
  if (!s || !SESSION.test(s.id || '') || s.status !== 'complete' || s.mode !== 'payment' || s.payment_status !== 'paid') throw new DownloadDenied('El pago todavía no está confirmado.');
  if (s.metadata?.order_kind && s.metadata.order_kind !== 'pdf_download') throw new DownloadDenied('Producto no válido.');
  const items = s.line_items?.data;
  if (!Array.isArray(items) || !items.length || items.length > files.size || s.line_items.has_more || s.currency !== 'eur' || !(s.amount_total > 0)) throw new DownloadDenied('El pago no corresponde a estos archivos PDF.');
  const seen = new Set<string>();
  const purchased = items.map((line: any) => {
    const slug = line?.price?.product?.metadata?.slug, file = files.get(slug);
    if (!file || seen.has(slug) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99 || line.currency !== 'eur' || !Number.isInteger(line.amount_total) || line.amount_total <= 0) throw new DownloadDenied('El pago no corresponde a estos archivos PDF.');
    seen.add(slug); return file;
  });
  if (items.reduce((total: number, line: any) => total + line.amount_total, 0) !== s.amount_total ||
      (s.metadata?.product_slug && (purchased.length !== 1 || s.metadata.product_slug !== purchased[0].slug))) throw new DownloadDenied('El importe o los productos no coinciden.');
  const intent = s.payment_intent, charge = intent?.latest_charge;
  if (intent?.status !== 'succeeded' || !charge || charge.paid !== true || charge.disputed || charge.refunded || charge.amount_refunded > 0) throw new DownloadDenied('Este pago no permite una descarga.');
  const expires = Number(s.created) + DOWNLOAD_SECONDS;
  if (!Number.isFinite(expires) || expires <= now || Number(s.created) > now + 300) throw new DownloadDenied('El plazo de descarga ha terminado.');
  return { file: purchased[0], files: purchased, expires, session: s };
}
function key(secret: string) {
  if (!secret || secret.length < 24) throw new Error('Download protection is not configured');
  return createHash('sha256').update('IPNORD4K:pdf-download:v1\0').update(secret).digest();
}
export function issueDownload(session: string, expires: number, secret: string) {
  if (!SESSION.test(session)) throw new DownloadDenied();
  const iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', key(secret), iv);
  cipher.setAAD(Buffer.from('pdf-download-v1'));
  const encrypted = Buffer.concat([cipher.update(JSON.stringify({ s: session, e: Math.floor(expires) })), cipher.final()]);
  return 'v1.' + Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString('base64url');
}
export function readDownload(token: string, secret: string, now = Date.now() / 1000) {
  try {
    if (!/^v1\.[A-Za-z0-9_-]{70,600}$/.test(token)) throw new Error();
    const data = Buffer.from(token.slice(3), 'base64url'), decipher = createDecipheriv('aes-256-gcm', key(secret), data.subarray(0,12));
    decipher.setAAD(Buffer.from('pdf-download-v1')); decipher.setAuthTag(data.subarray(12,28));
    const payload = JSON.parse(Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString());
    if (!SESSION.test(payload.s) || !Number.isFinite(payload.e) || payload.e <= now || payload.e > now + DOWNLOAD_SECONDS + 300) throw new Error();
    return payload.s as string;
  } catch { throw new DownloadDenied('El enlace no es válido o ha caducado.'); }
}
export async function verifiedPdfOrder(sessionId: string) {
  if (!SESSION.test(sessionId)) throw new DownloadDenied();
  const { stripe } = await import('./stripe.server');
  if (!stripe) throw new Error('Payment verification is unavailable');
  const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items.data.price.product', 'payment_intent.latest_charge'] });
  if (session.line_items?.has_more) {
    session.line_items = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 100, expand: ['data.price.product'] });
  }
  return validatePdfPayment(session);
}
export function downloadSecret() { return process.env.PDF_DOWNLOAD_SECRET || process.env.STRIPE_SECRET_KEY || ''; }
