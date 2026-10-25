import catalog from './pdf-catalog.json' with { type: 'json' };
const slugs = new Set(catalog.map(file => file.slug));
export interface PdfCheckoutItem { slug: string; qty: number }
export function validatePdfCart(data: { items?: unknown; orbitraClickId?: unknown }) {
  if (!Array.isArray(data?.items) || !data.items.length || data.items.length > slugs.size) throw new Error('Selecciona entre 1 y 13 productos PDF.');
  const seen = new Set<string>();
  const items = data.items.map((item): PdfCheckoutItem => {
    if (!item || typeof item.slug !== 'string' || !slugs.has(item.slug) || seen.has(item.slug) || !Number.isInteger(item.qty) || item.qty < 1 || item.qty > 99) throw new Error('El carrito contiene un producto o una cantidad no válida.');
    seen.add(item.slug); return { slug: item.slug, qty: item.qty };
  });
  const orbitraClickId = typeof data.orbitraClickId === 'string' && /^[0-9a-f]{48}$/.test(data.orbitraClickId) ? data.orbitraClickId : undefined;
  return { items, orbitraClickId };
}
export function stripeCheckoutUrl(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Stripe no devolvió una dirección de pago.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'checkout.stripe.com' || url.username || url.password) throw new Error('La dirección de pago no es válida.');
  return url.toString();
}
