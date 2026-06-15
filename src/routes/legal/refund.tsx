import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Återbetalningspolicy — IPNORD4K" },
      { name: "description", content: "Så fungerar återbetalning för digitala PDF-produkter." },
    ],
  }),
  component: () => (
    <LegalLayout title="Återbetalningspolicy" updated="2026-06-13">
      <h2>1. Digitala produkter</h2>
      <p>
        Eftersom vi säljer digitala filer som levereras direkt efter köp gäller{" "}
        <strong>ingen generell ångerrätt</strong> enligt distansavtalslagen
        2 kap. 11 § punkt 11. Du godkänner detta när du slutför köpet i kassan.
      </p>

      <h2>2. När du har rätt till återbetalning</h2>
      <p>Vi återbetalar köpet eller skickar en ersättningsfil om:</p>
      <ul>
        <li>Filen är skadad eller inte kan öppnas.</li>
        <li>Du inte mottog någon nedladdningslänk inom 24 timmar.</li>
        <li>Produkten väsentligt avviker från beskrivningen.</li>
        <li>Dubbeldebitering har skett av tekniska skäl.</li>
      </ul>

      <h2>3. 30 dagars nöjdhetsgaranti</h2>
      <p>
        Om du inom 30 dagar från köpet anser att produkten inte motsvarar dina
        förväntningar — kontakta oss. Vi gör vårt yttersta för att lösa det,
        antingen med en ersättningsprodukt eller, i särskilda fall, full
        återbetalning.
      </p>

      <h2>4. Så begär du återbetalning</h2>
      <ol>
        <li>
          Mejla{" "}
          <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>{" "}
          inom 30 dagar från köpet.
        </li>
        <li>
          Ange ordernummer (du hittar det på tacksidan eller i bekräftelsemejlet)
          och en kort beskrivning av problemet.
        </li>
        <li>
          Vi svarar inom 2 arbetsdagar och hanterar ärendet inom 7 arbetsdagar.
        </li>
      </ol>

      <h2>5. Återbetalningsmetod</h2>
      <p>
        Återbetalning sker till samma betalningsmetod som användes vid köpet
        (kort eller Klarna). Det kan ta 5–10 bankdagar innan beloppet syns på
        ditt konto.
      </p>

      <h2>6. Kontakt</h2>
      <p>
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>
      </p>
    </LegalLayout>
  ),
});
