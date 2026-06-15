import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Integritetspolicy — IPNORD4K" },
      { name: "description", content: "Så hanterar vi dina personuppgifter enligt GDPR." },
    ],
  }),
  component: () => (
    <LegalLayout title="Integritetspolicy" updated="2026-06-13">
      <p>
        IPNORD4K.COM ("vi", "oss") värnar om din integritet. Denna policy
        beskriver vilken information vi samlar in när du besöker vår webbplats
        eller köper våra digitala produkter, hur vi använder den och vilka
        rättigheter du har enligt EU:s dataskyddsförordning (GDPR).
      </p>

      <h2>1. Personuppgiftsansvarig</h2>
      <p>
        IPNORD4K.COM är personuppgiftsansvarig för behandlingen av dina
        personuppgifter. Kontakta oss på{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a> vid
        frågor.
      </p>

      <h2>2. Vilka uppgifter vi samlar in</h2>
      <ul>
        <li>
          <strong>Köpinformation:</strong> namn, e-postadress, faktureringsadress
          och betalningsuppgifter (kortuppgifter hanteras av Stripe — vi lagrar
          dem aldrig).
        </li>
        <li>
          <strong>Kommunikation:</strong> meddelanden du skickar till oss via
          kontaktformulär eller e-post.
        </li>
        <li>
          <strong>Teknisk information:</strong> IP-adress, webbläsartyp och
          cookies (se vår cookiepolicy).
        </li>
      </ul>

      <h2>3. Hur vi använder dina uppgifter</h2>
      <ul>
        <li>För att behandla din beställning och leverera dina PDF-filer.</li>
        <li>För att skicka orderbekräftelse och nedladdningslänk via e-post.</li>
        <li>För att besvara dina frågor och tillhandahålla kundsupport.</li>
        <li>För att uppfylla lagkrav, t.ex. bokföringslagen.</li>
      </ul>

      <h2>4. Rättslig grund</h2>
      <p>
        Vi behandlar dina uppgifter med stöd av avtal (för att leverera ditt
        köp), rättslig förpliktelse (bokföring) och berättigat intresse
        (kundsupport och säkerhet).
      </p>

      <h2>5. Tredjepartstjänster</h2>
      <p>
        Vi delar endast nödvändiga uppgifter med betrodda leverantörer:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> — för betalning. Stripe agerar
          personuppgiftsbiträde och är PCI-DSS-certifierat.
        </li>
        <li>
          <strong>Vår e-postleverantör</strong> — för att skicka transaktionella
          e-postmeddelanden.
        </li>
      </ul>
      <p>
        <strong>Vi säljer aldrig dina personuppgifter till tredje part.</strong>
      </p>

      <h2>6. Lagringstid</h2>
      <p>
        Orderinformation lagras i 7 år enligt bokföringslagen. Kommunikation
        med kundsupport raderas efter 24 månader.
      </p>

      <h2>7. Dina rättigheter (GDPR)</h2>
      <ul>
        <li>Rätt till tillgång till dina personuppgifter.</li>
        <li>Rätt till rättelse av felaktiga uppgifter.</li>
        <li>Rätt till radering ("rätten att bli glömd").</li>
        <li>Rätt att invända mot behandling.</li>
        <li>Rätt till dataportabilitet.</li>
        <li>Rätt att lämna in klagomål till Integritetsskyddsmyndigheten.</li>
      </ul>
      <p>
        För att utöva dina rättigheter, mejla{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Se vår separata <a href="/legal/cookies">cookiepolicy</a> för detaljer
        om vilka cookies vi använder och hur du hanterar dem.
      </p>

      <h2>9. Ändringar</h2>
      <p>
        Vi kan komma att uppdatera denna policy. Den senaste versionen finns
        alltid på denna sida.
      </p>
    </LegalLayout>
  ),
});
