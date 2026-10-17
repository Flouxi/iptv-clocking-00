import { createServerFn } from '@tanstack/react-start';
import { TV_PLANS, isTvPlan } from './tv-plans';

export const createTvCheckout = createServerFn({ method: 'POST' })
  .validator((data: { plan: unknown }) => {
    if (!isTvPlan(data?.plan)) throw new Error('Paquete no válido.');
    return { plan: data.plan };
  })
  .handler(async (): Promise<{ url: string }> => {
    throw new Error('Los pagos de televisión están desactivados. No se aceptan nuevos pedidos.');
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
