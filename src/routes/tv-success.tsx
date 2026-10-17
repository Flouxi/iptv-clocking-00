import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { verifyTvCheckout } from '@/lib/tv-checkout.functions';
import { tvPrice } from '@/lib/tv-plans';

export const Route = createFileRoute('/tv-success')({
  validateSearch: (s: Record<string, unknown>) => ({ session_id: typeof s.session_id === 'string' ? s.session_id : '' }),
  head: () => ({ meta: [{ title: 'Estado del pago — IPTVNORD4K' }, { name: 'robots', content: 'noindex,nofollow' }] }),
  component: TvSuccess,
});

function TvSuccess() {
  const { session_id } = Route.useSearch();
  const [result, setResult] = useState<Awaited<ReturnType<typeof verifyTvCheckout>> | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    verifyTvCheckout({ data: { sessionId: session_id } }).then(value => { if (active) setResult(value); }).catch(() => { if (active) setError('No se pudo verificar el pago. Consulta el recibo de Stripe o contacta con soporte.'); });
    return () => { active = false; };
  }, [session_id]);
  return <div className="container-page max-w-2xl py-16"><div className="rounded-2xl border border-border bg-card p-6 sm:p-10">
    <h1 className="text-3xl font-bold">{result?.paid ? 'Pago confirmado' : 'Estado del pago'}</h1>
    <p className="mt-4" role="status">{error || (result ? result.paid ? 'Stripe ha confirmado el pago de tu paquete de televisión.' : 'El pago todavía no está confirmado. No se ha activado el paquete.' : 'Verificando el pago con Stripe…')}</p>
    {result && <p className="mt-5 font-semibold">{result.name} · {tvPrice(result.amount)}</p>}
    <p className="mt-5 text-sm text-muted-foreground">Para recibir ayuda con tu acceso, contacta con el equipo de IPTVNORD4K desde la web de ventas.</p>
    <a href="https://www.iptvnord4k.com/" className="mt-6 inline-block text-primary underline">Volver a IPTVNORD4K</a>
  </div></div>;
}
