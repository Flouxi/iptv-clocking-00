import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { PaymentLogos } from "@/components/PaymentLogos";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Pago — IPNORD4K" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailed, subtotal, clear, count } = useCart();
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  if (count === 0 && !done) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">No hay productos para pagar</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">← Ir a la tienda</Link>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    setTimeout(() => clear(), 500);
  };

  if (done) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
          <h1 className="mt-4 text-3xl font-bold">¡Gracias por tu compra!</h1>
          <p className="mt-2 text-muted-foreground">
            Los enlaces de descarga se han enviado a tu correo electrónico y también están disponibles a continuación.
          </p>
          <div className="mt-6 space-y-2 text-left">
            {detailed.length === 0 && <p className="text-sm text-muted-foreground text-center">Confirmación de pedido de demostración.</p>}
            {detailed.map(({ product }) => (
              <div key={product.slug} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm font-medium">{product.name}</span>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  <Download className="h-4 w-4" /> Descargar PDF
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-bold">Pago</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Datos de contacto</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Nombre" name="firstName" required />
              <Field label="Apellidos" name="lastName" required />
              <Field label="Correo electrónico" name="email" type="email" required className="sm:col-span-2" />
              <Field label="Teléfono" name="phone" type="tel" className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Dirección de facturación</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Dirección" name="address" required className="sm:col-span-2" />
              <Field label="Código postal" name="zip" required />
              <Field label="Ciudad" name="city" required />
              <Field label="País" name="country" defaultValue="Suecia" required className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Lock className="h-4 w-4 text-primary" /> Pago
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Número de tarjeta" name="card" placeholder="1234 5678 9012 3456" required className="sm:col-span-2" />
              <Field label="MM/AA" name="exp" placeholder="12/27" required />
              <Field label="CVC" name="cvc" placeholder="123" required />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Pago de demostración. No se procesan datos de tarjetas reales.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-20">
          <h2 className="text-lg font-bold">Tu pedido</h2>
          <div className="mt-4 space-y-3 border-b border-border pb-4">
            {detailed.map(({ product, qty, line }) => (
              <div key={product.slug} className="flex justify-between gap-3 text-sm">
                <span className="line-clamp-1">{product.name} × {qty}</span>
                <span className="font-medium shrink-0">{formatPrice(line)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Total</span><span>{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Pagar {formatPrice(subtotal)}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Pago seguro • Cifrado SSL
          </p>
          <PaymentLogos className="mt-3 justify-center" />

        </aside>
      </form>
    </div>
  );
}

function Field({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; className?: string }) {
  return (
    <label className={`block text-sm ${className}`}>
      <span className="mb-1.5 block font-medium">{label}</span>
      <input
        {...rest}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
