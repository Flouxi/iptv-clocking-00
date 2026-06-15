import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { formatPrice, getCategoryLabel, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-md bg-gold px-2 py-1 text-xs font-bold text-gold-foreground">
            −{discount}%
          </span>
        )}
        {product.popular && (
          <span className="absolute left-3 bottom-3 rounded-md bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-md">
            ★ Mest populär
          </span>
        )}
        <span className="absolute right-3 top-3 rounded-md bg-navy/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          PDF • {product.pages} sid
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
          {getCategoryLabel(product.category)}
        </span>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground group-hover:text-primary">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.short}</p>

        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.round(product.rating) ? "fill-gold text-gold" : "text-border"}`}
              />
            ))}
          </div>
          <span>{product.rating.toFixed(1)} ({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
