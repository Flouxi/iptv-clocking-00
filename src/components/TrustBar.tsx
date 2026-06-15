import { Download, ShieldCheck, RotateCcw, Users } from "lucide-react";

const ITEMS = [
  { icon: Download, label: "Leverans inom 2 minuter" },
  { icon: ShieldCheck, label: "Säker betalning" },
  { icon: RotateCcw, label: "30 dagars nöjdhetsgaranti" },
  { icon: Users, label: "1 000+ nöjda kunder" },
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
