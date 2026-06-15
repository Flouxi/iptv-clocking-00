import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Clock, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Kontakt — IPNORD4K" },
      { name: "description", content: "Kontakta IPNORD4K — vi svarar normalt inom 24 timmar." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="container-page py-16">
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold sm:text-5xl">Kontakta oss</h1>
        <p className="mt-3 text-muted-foreground">
          Frågor om en produkt eller behöver hjälp med en beställning? Vi hör av oss inom 24 timmar.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl gap-10 md:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-border bg-card p-8">
          {sent ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-success" />
              <h2 className="mt-4 text-2xl font-bold">Tack för ditt meddelande!</h2>
              <p className="mt-2 text-muted-foreground">Vi återkommer så snart som möjligt.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="space-y-4"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Namn" name="name" required />
                <Input label="E-post" type="email" name="email" required />
              </div>
              <Input label="Ämne" name="subject" required />
              <label className="block text-sm">
                <span className="mb-1.5 block font-medium">Meddelande</span>
                <textarea
                  name="message"
                  required
                  rows={6}
                  className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </label>
              <button className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Skicka meddelande
              </button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {[
            { icon: Mail, t: "E-post", d: "hello@ipnord4k.com" },
            { icon: MessageSquare, t: "Support", d: "support@ipnord4k.com" },
            { icon: Clock, t: "Svarstid", d: "Inom 24 timmar, vardagar" },
          ].map((c) => (
            <div key={c.t} className="rounded-xl border border-border bg-card p-5">
              <c.icon className="h-5 w-5 text-primary" />
              <div className="mt-3 text-sm font-semibold">{c.t}</div>
              <div className="text-sm text-muted-foreground">{c.d}</div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}

function Input({ label, ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-medium">{label}</span>
      <input
        {...rest}
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </label>
  );
}
