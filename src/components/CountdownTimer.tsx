import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function getRemaining(): { h: number; m: number; s: number } {
  const next = new Date();
  next.setHours(24, 0, 0, 0);
  const ms = Math.max(0, next.getTime() - Date.now());
  return {
    h: Math.floor(ms / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
  };
}

export function CountdownTimer() {
  // Render zeros on SSR + first client paint to avoid hydration mismatch.
  const [time, setTime] = useState<{ h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    setTime(getRemaining());
    const t = setInterval(() => setTime(getRemaining()), 1000);
    return () => clearInterval(t);
  }, []);

  const { h, m, s } = time ?? { h: 0, m: 0, s: 0 };

  const Block = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <span className="grid h-12 w-12 place-items-center rounded-md bg-white/10 font-mono text-xl font-bold tabular-nums text-white sm:h-14 sm:w-14 sm:text-2xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-white/60">{label}</span>
    </div>
  );

  return (
    <div className="inline-flex items-center gap-4 rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2 text-gold">
        <Clock className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">Erbjudande slutar om</span>
      </div>
      <div className="flex items-end gap-2">
        <Block value={h} label="tim" />
        <Block value={m} label="min" />
        <Block value={s} label="sek" />
      </div>
    </div>
  );
}
