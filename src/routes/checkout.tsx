import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { formatPrice } from '@/lib/products';
import { createCartCheckoutSession } from '@/lib/checkout.functions';
import { pdfAttributionId } from '@/lib/orbitra-attribution';
import { PaymentLogos } from '@/components/PaymentLogos';

export const Route = createFileRoute('/checkout')({
  head: () => ({ meta: [{ title: 'Pago — IPNORD4K' }] }), component: CheckoutPage,
});
function CheckoutPage() {
  const { detailed, subtotal } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function pay() {
    if (busy) return;
    setBusy(true); setError('');
    try {
      const { url } = await createCartCheckoutSession({ data: {
        items: detailed.map(({ product, qty }) => ({ slug: product.slug, qty })), orbitraClickId: pdfAttributionId(),
      } });
      window.location.assign(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar el pago. Inténtalo de nuevo.'); setBusy(false);
    }
  }
  if (!detailed.length) return <div className="container-page py-20 text-center">
    <h1 className="text-2xl font-bold">No hay productos para pagar</h1>
    <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">← Ir a la tienda</Link>
  </div>;
  return <div className="container-page max-w-2xl py-12">
    <h1 className="text-4xl font-bold">Pago</h1>
    <section className="mt-8 rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-bold">Tu pedido de productos PDF</h2>
      <div className="mt-4 space-y-3 border-b border-border pb-4">
        {detailed.map(({ product, qty, line }) => <div key={product.slug} className="flex justify-between gap-3 text-sm">
          <span>{product.name} × {qty}</span><span className="shrink-0 font-medium">{formatPrice(line)}</span>
        </div>)}
      </div>
      <div className="mt-4 flex justify-between text-lg font-bold"><span>Total · EUR</span><span>{formatPrice(subtotal)}</span></div>
      <p className="mt-4 text-sm text-muted-foreground">Completarás el pago en Stripe. Tras confirmar el pago, podrás descargar tus archivos PDF en la página de confirmación.</p>
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <button type="button" onClick={pay} disabled={busy} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        {busy ? 'Abriendo Stripe…' : `Pagar ${formatPrice(subtotal)} con Stripe`}
      </button>
      <PaymentLogos className="mt-4 justify-center" />
      <Link to="/cart" className="mt-5 block text-center text-sm text-primary hover:underline">Volver al carrito</Link>
    </section>
  </div>;
}
