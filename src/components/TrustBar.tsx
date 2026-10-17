import { Download, ShieldCheck, RotateCcw, Users } from "lucide-react";

const ITEMS = [
  { icon: Download, label: "Entrega en 2 minutos" },
  { icon: ShieldCheck, label: "Pago seguro" },
  { icon: RotateCcw, label: "Garantía de satisfacción de 30 días" },
  { icon: Users, label: "Más de 1.000 clientes satisfechos" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-card">
      <div className="container-page grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
        {ITEMS.map((it) => (
          <div key={it.label} className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <it.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-foreground">{it.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
