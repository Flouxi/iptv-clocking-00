import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Kundvagn — IPNORD4K" }, { name: "description", content: "Din kundvagn." }],
  }),
  component: CartPage,
});

function CartPage() {
  const { detailed, setQty, remove, subtotal, count } = useCart();

  if (count === 0) {
    return (
      <div className="container-page py-20 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-3xl font-bold">Din kundvagn är tom</h1>
        <p className="mt-2 text-muted-foreground">Upptäck våra professionella PDF-verktyg.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Till butiken
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-bold">Kundvagn</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {detailed.map(({ product, qty, line }) => (
            <div key={product.slug} className="flex gap-4 rounded-xl border border-border bg-card p-4">
              <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                <img src={product.image} alt={product.name} className="h-24 w-24 rounded-lg object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <Link to="/product/$slug" params={{ slug: product.slug }} className="font-semibold hover:text-primary">
                  {product.name}
                </Link>
                <p className="text-xs text-muted-foreground">PDF • {product.pages} sidor</p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="inline-flex items-center rounded-md border border-border">
                    <button onClick={() => setQty(product.slug, qty - 1)} className="p-2 hover:bg-accent" aria-label="Minska">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button onClick={() => setQty(product.slug, qty + 1)} className="p-2 hover:bg-accent" aria-label="Öka">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{formatPrice(line)}</span>
                    <button onClick={() => remove(product.slug)} className="p-2 text-muted-foreground hover:text-destructive" aria-label="Ta bort">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-20">
          <h2 className="text-lg font-bold">Sammanfattning</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Delsumma</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between text-muted-foreground"><dt>Leverans</dt><dd>Direktnedladdning</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Totalt</span><span>{formatPrice(subtotal)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block rounded-md bg-primary px-6 py-3 text-center text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Till kassan
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm text-muted-foreground hover:text-primary">
            Fortsätt handla
          </Link>
        </aside>
      </div>
    </div>
  );
}
