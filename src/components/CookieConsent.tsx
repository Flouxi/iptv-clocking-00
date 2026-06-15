import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "ipnord4k:cookie-consent:v1";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const set = (value: "accepted" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:pb-5">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-card p-5 shadow-2xl sm:flex-row sm:items-center">
        <div className="flex shrink-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
        </div>
        <div className="flex-1 text-sm text-foreground">
          <p className="font-semibold">Vi använder cookies</p>
          <p className="mt-1 text-muted-foreground">
            Vi använder nödvändiga cookies för att webbplatsen ska fungera och valfria
            cookies för analys. Läs mer i vår{" "}
            <Link to="/legal/cookies" className="text-primary underline">
              cookiepolicy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => set("essential")}
            className="rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold hover:bg-accent"
          >
            Endast nödvändiga
          </button>
          <button
            onClick={() => set("accepted")}
            className="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
          >
            Acceptera alla
          </button>
          <button
            onClick={() => set("essential")}
            aria-label="Stäng"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
