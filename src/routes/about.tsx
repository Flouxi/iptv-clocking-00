import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Leaf, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Sobre nosotros — IPNORD4K" },
      { name: "description", content: "Conoce al equipo de IPNORD4K: minimalismo escandinavo y eficiencia empresarial." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-navy py-20 text-navy-foreground">
        <div className="container-page max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Minimalismo escandinavo y eficiencia empresarial</h1>
          <p className="mt-5 text-lg text-white/75">
            IPNORD4K crea herramientas PDF profesionales que ayudan a los empresarios suecos a ahorrar tiempo y presentar una imagen profesional desde el primer día.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Nuestra historia</h2>
          <p className="mt-4 text-muted-foreground">
            IPNORD4K nació en 2022 con una idea sencilla: todos los emprendedores merecen acceder a materiales de la misma calidad que utilizan las grandes empresas. Diseñamos cada plantilla, la probamos en negocios reales y solo publicamos lo que utilizaríamos nosotros mismos.
          </p>
          <p className="mt-4 text-muted-foreground">
            Hoy, más de 1.000 empresarios suecos utilizan nuestras herramientas PDF, desde profesionales independientes hasta equipos en crecimiento.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Award, n: "1 000+", l: "Clientes satisfechos" },
            { icon: Sparkles, n: "13", l: "Paquetes de productos" },
            { icon: Heart, n: "4.9", l: "Valoración media" },
            { icon: Leaf, n: "100%", l: "Entregas digitales" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl border border-border bg-card p-5 text-center">
              <s.icon className="mx-auto h-6 w-6 text-primary" />
              <div className="mt-3 text-2xl font-bold">{s.n}</div>
              <div className="text-xs text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="rounded-2xl bg-card p-10 text-center">
          <h2 className="text-2xl font-bold">Nuestros valores</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Calidad antes que cantidad", d: "Revisamos cada plantilla tres veces antes de publicarla." },
              { t: "Sencillez escandinava", d: "Un diseño limpio que funciona tanto en papel como en pantalla." },
              { t: "Valor inmediato", d: "Accede a tus archivos en menos de 2 minutos." },
            ].map((v) => (
              <div key={v.t}>
                <h3 className="text-lg font-semibold">{v.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/shop" className="inline-block rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Explora nuestros productos
          </Link>
        </div>
      </section>
    </div>
  );
}
