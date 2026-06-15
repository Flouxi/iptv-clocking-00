import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Köpvillkor — IPNORD4K" },
      { name: "description", content: "Villkor för köp av digitala PDF-produkter från IPNORD4K." },
    ],
  }),
  component: () => (
    <LegalLayout title="Köpvillkor" updated="2026-06-13">
      <h2>1. Allmänt</h2>
      <p>
        Dessa villkor gäller vid köp från IPNORD4K.COM. Genom att slutföra ett
        köp accepterar du villkoren. Vi säljer endast digitala produkter — ingen
        fysisk leverans förekommer.
      </p>

      <h2>2. Produkter</h2>
      <p>
        Samtliga produkter är digitala PDF-filer för nedladdning. Beskrivningar
        och sidantal anges på respektive produktsida.
      </p>

      <h2>3. Pris och betalning</h2>
      <p>
        Alla priser anges i svenska kronor (SEK) inklusive moms. Betalning sker
        i kassan via Stripe med kort eller Klarna. Inga kortuppgifter lagras hos
        oss.
      </p>

      <h2>4. Leverans</h2>
      <p>
        Leverans sker direkt efter genomförd betalning. Du omdirigeras till en
        tacksida med nedladdningslänk, och länken skickas även till din
        e-postadress inom 2 minuter. Se vår{" "}
        <a href="/legal/delivery">leveranspolicy</a>.
      </p>

      <h2>5. Ångerrätt och återbetalning</h2>
      <p>
        Enligt distansavtalslagen (2005:59) 2 kap. 11 § punkt 11 gäller{" "}
        <strong>ingen ångerrätt</strong> för digitala produkter som levererats
        omedelbart efter ditt uttryckliga samtycke. Genom att slutföra köpet
        samtycker du till omedelbar leverans och avstår från ångerrätten när
        filen har laddats ner.
      </p>
      <p>
        Undantag: om filen är skadad eller inte kan levereras får du en
        ersättningsfil eller full återbetalning. Se vår{" "}
        <a href="/legal/refund">återbetalningspolicy</a>.
      </p>

      <h2>6. Licens och användning</h2>
      <ul>
        <li>
          Du får en personlig, icke-överlåtbar licens att använda och skriva ut
          filerna obegränsat antal gånger för eget eller internt företagsbruk.
        </li>
        <li>
          Det är <strong>inte</strong> tillåtet att vidareförsälja, dela,
          publicera eller distribuera filerna helt eller delvis.
        </li>
        <li>
          Det är inte tillåtet att modifiera filerna och sälja dem vidare som
          egna produkter.
        </li>
      </ul>

      <h2>7. Immateriella rättigheter</h2>
      <p>
        Allt innehåll på webbplatsen och i produkterna ägs av IPNORD4K.COM och
        skyddas av upphovsrätt.
      </p>

      <h2>8. Ansvarsbegränsning</h2>
      <p>
        Våra produkter tillhandahålls i befintligt skick. Vi ansvarar inte för
        ekonomiska beslut som baseras på materialet — använd alltid egen
        bedömning eller rådgivare.
      </p>

      <h2>9. Tvist och tillämplig lag</h2>
      <p>
        Svensk lag är tillämplig. Tvist avgörs i första hand genom dialog och i
        andra hand av Allmänna Reklamationsnämnden (ARN) eller svensk allmän
        domstol.
      </p>

      <h2>10. Kontakt</h2>
      <p>
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>
      </p>
    </LegalLayout>
  ),
});
