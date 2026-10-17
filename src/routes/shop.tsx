import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { PRODUCTS, CATEGORIES, type Category } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";

const searchSchema = z.object({
  category: z.enum(["business", "finance", "marketing", "hr", "realestate", "freelancer", "iptv"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Tienda — IPNORD4K" },
      { name: "description", content: "Explora todas las herramientas PDF profesionales y plantillas empresariales." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { category } = Route.useSearch();
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");

  let items = category ? PRODUCTS.filter((p) => p.category === category) : PRODUCTS;
  if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);

  return (
    <div className="container-page py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold">Tienda</h1>
        <p className="mt-2 text-muted-foreground">
          {items.length} productos • Descarga inmediata tras la compra
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Categorías
            </h2>
            <ul className="mt-3 space-y-1">
              <li>
                <Link
                  to="/shop"
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${!category ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                >
                  Todos los productos
                </Link>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link
                    to="/shop"
                    search={{ category: c.id as Category }}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${category === c.id ? "bg-primary/10 text-primary" : "hover:bg-accent"}`}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{items.length} resultados</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="featured">Más populares</option>
              <option value="price-asc">Precio: de menor a mayor</option>
              <option value="price-desc">Precio: de mayor a menor</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
