import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Heart, Leaf, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Om oss — IPNORD4K" },
      { name: "description", content: "Möt teamet bakom IPNORD4K — skandinavisk minimalism möter affärseffektivitet." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="bg-navy py-20 text-navy-foreground">
        <div className="container-page max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl">Skandinavisk minimalism möter affärseffektivitet</h1>
          <p className="mt-5 text-lg text-white/75">
            IPNORD4K skapar professionella PDF-verktyg som hjälper svenska företagare
            att spara tid och se proffsiga ut — från första dagen.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-10 py-16 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-3xl font-bold">Vår historia</h2>
          <p className="mt-4 text-muted-foreground">
            IPNORD4K grundades 2022 med en enkel idé: alla företagare förtjänar
            tillgång till samma kvalitetsmaterial som de stora företagen använder.
            Vi designar varje mall själva, testar dem i verkliga företag och
            släpper bara det vi själva skulle använda.
          </p>
          <p className="mt-4 text-muted-foreground">
            Idag används våra PDF-verktyg av över 1 000 svenska företagare — från
            soloentreprenörer till växande team.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: Award, n: "1 000+", l: "Nöjda kunder" },
            { icon: Sparkles, n: "13", l: "Produktpaket" },
            { icon: Heart, n: "4.9", l: "Genomsnittligt betyg" },
            { icon: Leaf, n: "100%", l: "Digitala leveranser" },
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
          <h2 className="text-2xl font-bold">Våra värderingar</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { t: "Kvalitet före kvantitet", d: "Varje mall granskas tre gånger innan release." },
              { t: "Skandinavisk enkelhet", d: "Ren design som fungerar lika bra i tryck som digitalt." },
              { t: "Direkt värde", d: "Du får tillgång till dina filer på under 2 minuter." },
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
            Utforska våra produkter
          </Link>
        </div>
      </section>
    </div>
  );
}
