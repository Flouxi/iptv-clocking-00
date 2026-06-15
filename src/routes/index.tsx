import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Wallet, Megaphone, UsersRound, Home, UserCog } from "lucide-react";
import heroPattern from "@/assets/hero-pattern.jpg";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { TrustBar } from "@/components/TrustBar";
import { CountdownTimer } from "@/components/CountdownTimer";
import { FAQ } from "@/components/FAQ";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "IPNORD4K — Ladda ner. Skriv ut. Lyckas." },
      { name: "description", content: "Professionella PDF-verktyg för svenska företagare — redo att använda direkt. Direktnedladdning, 30 dagars garanti." },
    ],
  }),
  component: HomePage,
});

const CATEGORY_ICONS = {
  business: Briefcase,
  finance: Wallet,
  marketing: Megaphone,
  hr: UsersRound,
  realestate: Home,
  freelancer: UserCog,
} as const;

function HomePage() {
  const featured = PRODUCTS.slice(0, 8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <img
          src={heroPattern}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/95 via-navy/85 to-navy/95" />
        <div className="container-page relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Skandinavisk kvalitet
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              Ladda ner.<br />Skriv ut.<br />
              <span className="text-gold">Lyckas.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/75 sm:text-lg">
              Professionella PDF-verktyg för svenska företagare — redo att använda direkt.
              Planerare, mallar och affärspaket i skandinavisk design.
            </p>
            <div className="mt-6"><CountdownTimer /></div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                Se alla produkter <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center rounded-md border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Läs mer om oss
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-white/60">
              <div><div className="text-2xl font-bold text-white">1 000+</div>Nöjda kunder</div>
              <div className="h-10 w-px bg-white/15" />
              <div><div className="text-2xl font-bold text-white">13</div>PDF-paket</div>
              <div className="h-10 w-px bg-white/15" />
              <div><div className="text-2xl font-bold text-white">2 min</div>Leverans</div>
            </div>
          </div>

          {/* Featured peek */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {featured.slice(0, 4).map((p, i) => (
                <div
                  key={p.slug}
                  className={`overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur ${i % 2 ? "translate-y-6" : ""}`}
                >
                  <img src={p.image} alt="" className="aspect-[4/3] w-full object-cover" />
                  <div className="p-3">
                    <div className="line-clamp-1 text-sm font-semibold text-white">{p.name}</div>
                    <div className="text-xs text-gold">{p.price.toLocaleString("sv-SE")} kr</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* CATEGORIES */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Bläddra efter kategori</h2>
            <p className="mt-2 text-muted-foreground">Hitta rätt PDF-verktyg för din verksamhet.</p>
          </div>
          <Link to="/shop" className="hidden text-sm font-semibold text-primary hover:underline sm:inline">
            Alla kategorier →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c.id];
            return (
              <Link
                key={c.id}
                to="/shop"
                search={{ category: c.id }}
                className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition hover:border-primary hover:shadow-md"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-semibold">{c.label}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="container-page pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Populära produkter</h2>
            <p className="mt-2 text-muted-foreground">Mest nedladdade PDF-paket den här månaden.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-primary hover:underline">
            Se alla →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-20">
        <div className="overflow-hidden rounded-2xl bg-navy p-10 text-navy-foreground md:p-14">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-display text-3xl font-bold">Inte säker på var du ska börja?</h3>
              <p className="mt-3 max-w-xl text-white/70">
                Vår <span className="text-gold font-semibold">Ultimate Entrepreneur Bundle</span> samlar
                100+ verktyg i ett paket — perfekt för dig som startar nytt företag.
              </p>
            </div>
            <Link
              to="/product/$slug"
              params={{ slug: "ultimate-entrepreneur-bundle" }}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-6 py-3 text-sm font-semibold text-gold-foreground hover:opacity-90"
            >
              Visa paketet <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <FAQ />
    </>
  );
}
