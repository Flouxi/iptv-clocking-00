import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Cookiepolicy — IPNORD4K" },
      { name: "description", content: "Information om cookies på IPNORD4K.COM." },
    ],
  }),
  component: () => (
    <LegalLayout title="Cookiepolicy" updated="2026-06-13">
      <h2>1. Vad är cookies?</h2>
      <p>
        Cookies är små textfiler som sparas i din webbläsare när du besöker en
        webbplats. De används för att webbplatsen ska fungera, för att komma
        ihåg dina val och för att analysera trafik.
      </p>

      <h2>2. Cookies vi använder</h2>

      <h3>Nödvändiga cookies (kan inte stängas av)</h3>
      <ul>
        <li>
          <strong>Session/inloggning:</strong> håller din kundvagn aktiv mellan
          sidvisningar.
        </li>
        <li>
          <strong>Cookie-samtycke:</strong> kommer ihåg dina cookie-val.
        </li>
        <li>
          <strong>Stripe-betalning:</strong> Stripe sätter cookies för att
          säkra betalningar och förhindra bedrägeri. Se{" "}
          <a
            href="https://stripe.com/cookies-policy/legal"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripes cookiepolicy
          </a>
          .
        </li>
      </ul>

      <h3>Analyscookies (frivilliga)</h3>
      <ul>
        <li>
          <strong>Google Analytics</strong> — hjälper oss att förstå hur
          besökare använder sajten så att vi kan förbättra den. Aktiveras
          endast om du klickar "Acceptera alla".
        </li>
      </ul>

      <h2>3. Hantera dina cookies</h2>
      <p>
        Du kan när som helst återkalla ditt samtycke genom att rensa cookies för
        denna webbplats i din webbläsare — då visas samtyckesrutan igen.
      </p>
      <p>Så hanterar du cookies i de vanligaste webbläsarna:</p>
      <ul>
        <li>
          <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Chrome</a>
        </li>
        <li>
          <a href="https://support.mozilla.org/sv/kb/blockera-cookies" target="_blank" rel="noopener noreferrer">Firefox</a>
        </li>
        <li>
          <a href="https://support.apple.com/sv-se/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Safari</a>
        </li>
        <li>
          <a href="https://support.microsoft.com/sv-se/microsoft-edge/" target="_blank" rel="noopener noreferrer">Edge</a>
        </li>
      </ul>

      <h2>4. GDPR-samtycke</h2>
      <p>
        Första gången du besöker vår sajt visas en banner där du kan välja vilka
        cookies du accepterar. Inga icke-nödvändiga cookies sätts innan du gett
        ditt samtycke.
      </p>

      <h2>5. Kontakt</h2>
      <p>
        Frågor om cookies? Mejla{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>.
      </p>
    </LegalLayout>
  ),
});
