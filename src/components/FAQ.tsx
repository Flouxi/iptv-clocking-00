import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Hur får jag min fil?",
    a: "Direkt efter genomförd betalning omdirigeras du till en tacksida med en nedladdningslänk. Vi skickar också länken till din e-postadress inom 2 minuter.",
  },
  {
    q: "Vilket format har filen?",
    a: "Alla produkter levereras som högupplösta PDF-filer i A4-format. De är optimerade för utskrift och kan öppnas på dator, mobil eller surfplatta.",
  },
  {
    q: "Kan jag skriva ut filen obegränsat antal gånger?",
    a: "Ja. När du har köpt en PDF får du livstidsåtkomst och kan skriva ut den hur många gånger du vill för personligt och internt bruk i ditt företag.",
  },
  {
    q: "Är min betalning säker?",
    a: "Ja. All betalning hanteras av Stripe — en av världens mest betrodda betalningsleverantörer. Vi sparar aldrig några kortuppgifter på våra servrar och all trafik är SSL-krypterad.",
  },
  {
    q: "Vad gör jag om jag inte får min fil?",
    a: "Kolla först i din skräppost. Om filen fortfarande saknas, kontakta oss på support@ipnord4k.com med ditt ordernummer så löser vi det inom 24 timmar — eller får du pengarna tillbaka.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="container-page py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">Vanliga frågor</h2>
          <p className="mt-2 text-muted-foreground">
            Det vi får oftast — om inte ditt svar finns här, hör av dig.
          </p>
        </div>
        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
