import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Download, RotateCcw, ShieldCheck, Star, ShoppingBag, Zap, Loader2, FileText } from "lucide-react";
import { useState } from "react";
import { formatPrice, getCategoryLabel, getProduct, PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { ProductCard } from "@/components/ProductCard";
import { createCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — IPNORD4K` },
          { name: "description", content: loaderData.product.short },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.short },
          { property: "og:image", content: loaderData.product.image },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-bold">Produkten hittades inte</h1>
      <Link to="/shop" className="mt-4 inline-block text-primary hover:underline">← Tillbaka till butiken</Link>
    </div>
  ),
  errorComponent: () => (
    <div className="container-page py-20 text-center">
      <h1 className="text-2xl font-bold">Något gick fel</h1>
    </div>
  ),
  component: ProductPage,
});

const REVIEWS = [
  { name: "Anna L.", rating: 5, text: "Helt fantastiska mallar! Sparade mig veckor av arbete." },
  { name: "Mikael S.", rating: 5, text: "Professionell design, lätt att anpassa. Rekommenderas starkt." },
  { name: "Sara K.", rating: 4, text: "Mycket bra innehåll, väl värt pengarna." },
];

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    add(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuy = async () => {
    setError(null);
    setBuying(true);
    try {
      const { url } = await createCheckoutSession({ data: { slug: product.slug } });
      window.location.href = url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunde inte starta betalningen");
      setBuying(false);
    }
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const related = PRODUCTS.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const fileSize = product.fileSizeMb ?? Math.max(2, Math.round(product.pages * 0.15));

  return (
    <div className="container-page py-10 pb-32 md:pb-10">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-primary">Hem</Link>
        <span className="mx-2">/</span>
        <Link to="/shop" className="hover:text-primary">Butik</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[product.image, product.image, product.image].map((src, i) => (
              <figure key={i} className="overflow-hidden rounded-lg border border-border bg-card">
                <img src={src} alt={`Förhandsvisning ${i + 1}`} className="aspect-square w-full object-cover opacity-80 hover:opacity-100" />
                <figcaption className="px-2 py-1 text-center text-[10px] text-muted-foreground">
                  Sida {i + 1}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">Förhandsvisning av provsidor</p>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              {getCategoryLabel(product.category)}
            </span>
            {product.popular && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                ★ Mest populär
              </span>
            )}
          </div>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"}`} />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.rating.toFixed(1)} • {product.reviews} recensioner
            </span>
          </div>

          <p className="mt-5 text-muted-foreground">{product.description}</p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <Zap className="h-3.5 w-3.5" /> Direkt nedladdning efter betalning
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-4xl font-bold">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-md bg-gold px-2 py-0.5 text-sm font-bold text-gold-foreground">
                  −{discount}%
                </span>
              </>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inkl. moms • Engångsbetalning • SEK</p>

          <button
            onClick={handleBuy}
            disabled={buying}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {buying ? <><Loader2 className="h-5 w-5 animate-spin" /> Öppnar säker kassa…</> : <><Download className="h-5 w-5" /> Köp nu & Ladda ner</>}
          </button>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          <button
            onClick={handleAdd}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-accent"
          >
            {added ? <><Check className="h-4 w-4" /> Tillagd i kundvagn</> : <><ShoppingBag className="h-4 w-4" /> Lägg i kundvagn</>}
          </button>

          {/* What's included */}
          <div className="mt-8 rounded-xl border border-border bg-card p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Det här ingår</h3>
            <ul className="mt-3 space-y-2">
              {product.features.map((f: string) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
              <li className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Livstidsåtkomst & obegränsad utskrift
              </li>
            </ul>
          </div>

          {/* File details */}
          <dl className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4 text-center text-xs">
            <div>
              <dt className="text-muted-foreground">Format</dt>
              <dd className="mt-1 flex items-center justify-center gap-1 font-bold"><FileText className="h-3.5 w-3.5" /> PDF</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Sidor</dt>
              <dd className="mt-1 font-bold">{product.pages}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Filstorlek</dt>
              <dd className="mt-1 font-bold">~{fileSize} MB</dd>
            </div>
          </dl>

          <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4">
            {[
              { icon: Download, label: "Direkt leverans" },
              { icon: ShieldCheck, label: "Säker betalning" },
              { icon: RotateCcw, label: "30 dagars garanti" },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5 text-center text-xs">
                <b.icon className="h-5 w-5 text-primary" />
                <span className="font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold">Kundrecensioner</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="rounded-xl border border-border bg-card p-5">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground">"{r.text}"</p>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-2xl font-bold">Du kanske också gillar</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </section>
      )}

      {/* Sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 p-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-base font-bold leading-none">{formatPrice(product.price)}</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">Direkt nedladdning</div>
          </div>
          <button
            onClick={handleBuy}
            disabled={buying}
            className="flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {buying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            Köp nu
          </button>
        </div>
      </div>
    </div>
  );
}
