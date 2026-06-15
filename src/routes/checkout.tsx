import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, Lock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { PaymentLogos } from "@/components/PaymentLogos";


export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Kassa — IPNORD4K" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { detailed, subtotal, clear, count } = useCart();
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  if (count === 0 && !done) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Inga produkter i kassan</h1>
        <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">← Till butiken</Link>
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
          <h1 className="mt-4 text-3xl font-bold">Tack för ditt köp!</h1>
          <p className="mt-2 text-muted-foreground">
            Dina nedladdningslänkar har skickats till din e-postadress och är även tillgängliga nedan.
          </p>
          <div className="mt-6 space-y-2 text-left">
            {detailed.length === 0 && <p className="text-sm text-muted-foreground text-center">Demo-orderbekräftelse.</p>}
            {detailed.map(({ product }) => (
              <div key={product.slug} className="flex items-center justify-between rounded-md border border-border p-3">
                <span className="text-sm font-medium">{product.name}</span>
                <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  <Download className="h-4 w-4" /> Ladda ner PDF
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="mt-8 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Till startsidan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-bold">Kassa</h1>
      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Kontaktuppgifter</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Förnamn" name="firstName" required />
              <Field label="Efternamn" name="lastName" required />
              <Field label="E-post" name="email" type="email" required className="sm:col-span-2" />
              <Field label="Telefon" name="phone" type="tel" className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-lg font-bold">Faktureringsadress</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Adress" name="address" required className="sm:col-span-2" />
              <Field label="Postnummer" name="zip" required />
              <Field label="Stad" name="city" required />
              <Field label="Land" name="country" defaultValue="Sverige" required className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold">
              <Lock className="h-4 w-4 text-primary" /> Betalning
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Kortnummer" name="card" placeholder="1234 5678 9012 3456" required className="sm:col-span-2" />
              <Field label="MM/ÅÅ" name="exp" placeholder="12/27" required />
              <Field label="CVC" name="cvc" placeholder="123" required />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Demo-betalning. Inga riktiga kortuppgifter behandlas.
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-20">
          <h2 className="text-lg font-bold">Din beställning</h2>
          <div className="mt-4 space-y-3 border-b border-border pb-4">
            {detailed.map(({ product, qty, line }) => (
              <div key={product.slug} className="flex justify-between gap-3 text-sm">
                <span className="line-clamp-1">{product.name} × {qty}</span>
                <span className="font-medium shrink-0">{formatPrice(line)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-bold">
            <span>Totalt</span><span>{formatPrice(subtotal)}</span>
          </div>
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Betala {formatPrice(subtotal)}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" /> Säker betalning • SSL-krypterad
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
