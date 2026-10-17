import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, Clock } from "lucide-react";
import { BLOG_POSTS, formatDate } from "@/lib/blog";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — IPNORD4K | Guías para empresarios suecos" },
      {
        name: "description",
        content:
          "Guías prácticas sobre emprendimiento, finanzas, marketing y productividad para empresarios suecos.",
      },
      { property: "og:title", content: "Blog de IPNORD4K — Guías para empresarios suecos" },
      { property: "og:description", content: "Guías prácticas sobre emprendimiento, finanzas y productividad." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const [featured, ...rest] = BLOG_POSTS;
  return (
    <div>
      <section className="bg-navy py-16 text-navy-foreground">
        <div className="container-page">
          <span className="text-xs font-semibold uppercase tracking-wider text-gold">Blog</span>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Conocimientos para empresarios suecos
          </h1>
          <p className="mt-4 max-w-2xl text-white/75">
            Guías, plantillas e ideas prácticas de quienes también gestionamos empresas en los países nórdicos.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        {/* Featured */}
        <Link
          to="/blog/$slug"
          params={{ slug: featured.slug }}
          className="group grid overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-2"
        >
          <img src={featured.image} alt={featured.title} className="aspect-[4/3] h-full w-full object-cover md:aspect-auto" />
          <div className="p-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{featured.category}</span>
            <h2 className="mt-3 text-2xl font-bold group-hover:text-primary sm:text-3xl">{featured.title}</h2>
            <p className="mt-3 text-muted-foreground">{featured.excerpt}</p>
            <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {formatDate(featured.date)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.readMinutes} min de lectura</span>
            </div>
          </div>
        </Link>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group overflow-hidden rounded-xl border border-border bg-card transition hover:border-primary hover:shadow-md"
            >
              <img src={p.image} alt={p.title} className="aspect-[4/3] w-full object-cover" />
              <div className="p-5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">{p.category}</span>
                <h3 className="mt-2 line-clamp-2 text-lg font-bold group-hover:text-primary">{p.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{formatDate(p.date)}</span>
                  <span>•</span>
                  <span>{p.readMinutes} min</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
