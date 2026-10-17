import { createServerFn } from '@tanstack/react-start';
import { TV_PLANS, isTvPlan } from './tv-plans';

export const createTvCheckout = createServerFn({ method: 'POST' })
  .validator((data: { plan: unknown }) => {
    if (!isTvPlan(data?.plan)) throw new Error('Paquete no válido.');
    return { plan: data.plan };
  })
  .handler(async ({ data }) => {
    const { stripe } = await import('./stripe.server');
    if (!stripe) throw new Error('El pago no está disponible. Inténtalo de nuevo más tarde.');
    const plan = TV_PLANS[data.plan];
    // Reuse the actual TV products; PDF products are a separate catalog.
    const priceIds = {
      '3m': 'price_1URT6uCM4HGQAVRJC0Wvk326',
      '1y': 'price_1URT6tCM4HGQAVRJ2l269TpX',
      '3y': 'price_1URT6dCM4HGQAVRJQ11VrZTv',
    };
    const productIds = {
      '3m': 'prod_VSMddIvf3aSe1s', '1y': 'prod_VSMdNnSJ8joQ0Z', '3y': 'prod_VSMd7Ijur7g4dc',
    };
    const price = await stripe.prices.retrieve(priceIds[data.plan], { expand: ['product'] });
    const product = price.product;
    if (!price.active || price.currency !== 'eur' || price.unit_amount !== plan.amount || price.recurring
      || typeof product === 'string' || product.deleted || !product.active || product.id !== productIds[data.plan]
      || product.name !== plan.name) throw new Error('El paquete se ha actualizado. Vuelve a la página de precios.');
    const metadata = { site: 'iptvnord4k.com', product_type: 'tv_prepaid', plan: data.plan, months: String(plan.months), screens: String(plan.screens) };
    const integrationSuffix = Array.from(crypto.getRandomValues(new Uint8Array(8)), x => String.fromCharCode(97 + x % 26)).join('');
    const sessionParams = {
      mode: 'payment' as const, locale: 'es' as const, line_items: [{ price: price.id, quantity: 1 }],
      integration_identifier: 'iptvnord4k_tv_' + integrationSuffix,
      success_url: 'https://pay.iptvnord4k.com/tv-success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://pay.iptvnord4k.com/tv?plan=' + data.plan + '&cancelled=1',
      metadata, payment_intent_data: { metadata, description: plan.name },
    };
    const session = await stripe.checkout.sessions.create(sessionParams);
    if (!session.url || new URL(session.url).hostname !== 'checkout.stripe.com') throw new Error('No se pudo abrir el pago seguro.');
    return { url: session.url };
  });

export const verifyTvCheckout = createServerFn({ method: 'POST' })
  .validator((data: { sessionId: unknown }) => {
    if (typeof data?.sessionId !== 'string' || !/^cs_(?:live|test)_[A-Za-z0-9]{10,180}$/.test(data.sessionId)) throw new Error('Sesión no válida.');
    return { sessionId: data.sessionId };
  })
  .handler(async ({ data }) => {
    const { stripe } = await import('./stripe.server');
    if (!stripe) throw new Error('No se pudo verificar el pago.');
    const session = await stripe.checkout.sessions.retrieve(data.sessionId);
    const key = session.metadata?.plan;
    if (session.metadata?.product_type !== 'tv_prepaid' || !isTvPlan(key)) throw new Error('Esta sesión no corresponde a un paquete de televisión.');
    const plan = TV_PLANS[key];
    if (session.currency !== 'eur' || session.amount_total !== plan.amount) throw new Error('El importe del pedido no coincide con el paquete.');
    // Payment verification is not an analytics conversion. No browser Purchase is emitted.
    return { paid: session.payment_status === 'paid', name: plan.name, amount: plan.amount, plan: key };
  });
