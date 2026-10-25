import { createServerFn } from '@tanstack/react-start';
import { getRequestHost } from '@tanstack/react-start/server';
import { randomBytes } from 'node:crypto';
import { getProduct } from './products';
import { validatePdfCart, stripeCheckoutUrl, type PdfCheckoutItem } from './pdf-checkout-input';

async function checkout(data: { items: PdfCheckoutItem[]; orbitraClickId?: string }) {
  const { stripe, syncProductToStripe } = await import('./stripe.server');
  if (!stripe) throw new Error('El pago no está disponible. Inténtalo de nuevo más tarde.');
  const host = getRequestHost();
  const origin = `${host.startsWith('localhost') ? 'http' : 'https'}://${host}`;
  const lineItems = [];
  const names: string[] = [];
  let amountCents = 0;
  for (const item of data.items) {
    const product = getProduct(item.slug);
    if (!product) throw new Error('Producto no disponible.');
    const synced = await syncProductToStripe(product);
    lineItems.push({ price: synced.priceId, quantity: item.qty });
    names.push(product.name);
    amountCents += Math.round(product.price * 100) * item.qty;
  }
  const single = data.items.length === 1 ? data.items[0].slug : undefined;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment', line_items: lineItems,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: single ? `${origin}/product/${single}` : `${origin}/cart`,
    locale: 'es', billing_address_collection: 'auto',
    metadata: { order_kind: 'pdf_download', source_site: origin,
      ...(single ? { product_slug: single } : {}),
      ...(data.orbitraClickId ? { orbitra_click_id: data.orbitraClickId } : {}),
    },
    integration_identifier: `ipnord4k_pdf_${Array.from(randomBytes(8), n => String.fromCharCode(97 + n % 26)).join('')}`,
  });
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
      const { error } = await supabaseAdmin.from('orders').insert({
        stripe_session_id: session.id, product_slug: single || 'pdf-cart',
        product_name: names.join(', '), amount_total: amountCents,
        currency: 'eur', status: 'pending',
      });
      if (error) console.warn('Could not save the pending order. Stripe remains authoritative.');
    } catch { console.warn('Order ledger unavailable. Stripe remains authoritative.'); }
  }
  return { url: stripeCheckoutUrl(session.url) };
}
export const createCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator((data: { slug: string; orbitraClickId?: string }) => validatePdfCart({ items: [{ slug: data?.slug, qty: 1 }], orbitraClickId: data?.orbitraClickId }))
  .handler(({ data }) => checkout(data));
export const createCartCheckoutSession = createServerFn({ method: 'POST' })
  .inputValidator(validatePdfCart)
  .handler(({ data }) => checkout(data));
