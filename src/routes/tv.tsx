import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { ArrowLeft, Check, LockKeyhole, Loader2, Tv } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TV_PLANS, isTvPlan, tvPrice, type TvPlanKey } from '@/lib/tv-plans';
import { createTvCheckout } from '@/lib/tv-checkout.functions';

export const Route = createFileRoute('/tv')({
  validateSearch: (s: Record<string, unknown>) => ({ plan: isTvPlan(s.plan) ? s.plan : '1y' as TvPlanKey, cancelled: s.cancelled === '1' }),
  head: () => ({ meta: [
    { title: 'Tu paquete de televisión — IPTVNORD4K' },
    { name: 'description', content: 'Confirma tu paquete de televisión IPTVNORD4K, su duración, pantallas y precio antes de pagar con Stripe.' },
    { property: 'og:title', content: 'Tu paquete de televisión — IPTVNORD4K' },
    { property: 'og:description', content: 'Paquetes de televisión de prepago. Pago único en euros, sin renovación automática.' },
    { name: 'robots', content: 'noindex,follow' },
  ] }),
  component: TvCheckoutPage,
});

function TvCheckoutPage() {
  const search = Route.useSearch();
  const [selected, setSelected] = useState<TvPlanKey>(search.plan);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const plan = TV_PLANS[selected];
  async function buy() {
    setBusy(true); setError('');
    try { const result = await createTvCheckout({ data: { plan: selected } }); window.location.assign(result.url); }
    catch (e) { setError(e instanceof Error ? e.message : 'No se pudo abrir el pago. Inténtalo de nuevo.'); setBusy(false); }
  }
  return <div className="container-page max-w-5xl py-8 sm:py-14">
    <a href="https://www.iptvnord4k.com/#bestall" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Volver a los paquetes</a>
    <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
      <section>
        <div className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-primary"><Tv size={18} /> Televisión de prepago</div>
        <h1 className="text-3xl font-bold sm:text-4xl">Confirma tu paquete.</h1>
        <p className="mt-3 max-w-lg text-muted-foreground">Estás comprando acceso al servicio de televisión de IPTVNORD4K. Elige la duración y comprueba las pantallas incluidas antes de pagar.</p>
        <p className="mt-5 rounded-lg border border-border bg-card p-4" role="status">Los pagos de televisión están desactivados. No se aceptan nuevos pedidos.</p>
        <fieldset disabled className="mt-7 space-y-3">
          <legend className="mb-3 font-semibold">Tu paquete de televisión</legend>
          {(Object.keys(TV_PLANS) as TvPlanKey[]).map(key => { const p = TV_PLANS[key]; return <label key={key} className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 sm:p-5 ${key === selected ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card'}`}>
            <input type="radio" name="tv-plan" value={key} checked={selected === key} onChange={() => setSelected(key)} className="h-4 w-4 accent-primary" />
            <span className="flex-1"><span className="block font-semibold">{p.label}</span><span className="mt-1 block text-sm text-muted-foreground">{p.screens} {p.screens === 1 ? 'pantalla' : 'pantallas'} · {p.months} meses de acceso</span></span>
            <span className="text-lg font-bold sm:text-xl">{tvPrice(p.amount)}</span>
          </label>; })}
        </fieldset>
        <div className="mt-6 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><Check size={16} /> Un solo pago. Sin renovación automática.</p>
          <p className="flex items-center gap-2"><Check size={16} /> Los datos de la tarjeta se introducen en Stripe.</p>
        </div>
      </section>
      <aside className="h-fit rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-8" aria-label="Resumen del pedido">
        <h2 className="text-xl font-bold">Tu pedido</h2>
        <p className="mt-5 font-semibold">{plan.name}</p>
        <p className="mt-2 text-sm text-muted-foreground">{plan.months} meses de acceso · {plan.screens} {plan.screens === 1 ? 'pantalla' : 'pantallas'}</p>
        <div className="my-6 flex items-center justify-between border-t border-border pt-5"><span className="font-medium">Total · EUR</span><strong className="text-3xl">{tvPrice(plan.amount)}</strong></div>
        <p className="mb-5 text-sm text-muted-foreground">Pago único por el período seleccionado.</p>
        {search.cancelled && <p className="mb-4 text-sm" role="status">El pago se canceló. Puedes volver a intentarlo.</p>}
        {error && <p role="alert" className="mb-4 text-sm text-destructive">{error}</p>}
        <Button onClick={buy} disabled size="lg" className="h-auto w-full whitespace-normal py-3">
          <LockKeyhole /> Pago no disponible
        </Button>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">El producto y el importe aparecerán también en el pago y en el recibo de Stripe.</p>
        <a href="https://www.iptvnord4k.com/villkor" className="mt-5 inline-block text-sm underline underline-offset-4">Condiciones y reembolsos</a>
      </aside>
    </div>
  </div>;
}
