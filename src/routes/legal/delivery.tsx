import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/delivery")({
  head: () => ({
    meta: [
      { title: "Leveranspolicy — IPNORD4K" },
      { name: "description", content: "Alla produkter är digitala PDF-filer som levereras inom 2 minuter." },
    ],
  }),
  component: () => (
    <LegalLayout title="Leveranspolicy" updated="2026-06-13">
      <h2>1. Digital leverans</h2>
      <p>
        Samtliga produkter från IPNORD4K.COM är digitala PDF-filer. Ingen
        fysisk leverans förekommer — du får aldrig något skickat med post.
      </p>

      <h2>2. Leveranstid</h2>
      <p>
        Leverans sker omedelbart efter genomförd betalning, normalt inom{" "}
        <strong>2 minuter</strong>.
      </p>

      <h2>3. Leveranssätt</h2>
      <ul>
        <li>
          Du omdirigeras direkt till en tacksida med nedladdningslänk efter
          betalning.
        </li>
        <li>
          En kopia av länken skickas till den e-postadress du uppgav i kassan.
        </li>
        <li>
          Nedladdningslänken är giltig i 30 dagar och kan användas flera gånger.
        </li>
      </ul>

      <h2>4. Om du inte fått din fil</h2>
      <ol>
        <li>Kontrollera din skräppost/spam-folder.</li>
        <li>
          Sök efter avsändaren <em>noreply@ipnord4k.com</em> i din inkorg.
        </li>
        <li>
          Kontakta{" "}
          <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a> med
          ditt ordernummer så löser vi det inom 24 timmar.
        </li>
      </ol>

      <h2>5. Filformat och teknik</h2>
      <p>
        Alla filer levereras som PDF i A4-format, optimerade för utskrift och
        läsbara på alla moderna enheter (dator, mobil, surfplatta).
      </p>

      <h2>6. Ingen fysisk leverans — någonsin</h2>
      <p>
        Vi skickar aldrig fysiska varor. Inga fraktkostnader eller leveransavgifter
        tillkommer.
      </p>
    </LegalLayout>
  ),
});
