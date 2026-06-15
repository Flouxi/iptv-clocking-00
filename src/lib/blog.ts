export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string; // ISO
  readMinutes: number;
  author: string;
  category: string;
  image: string;
  content: string; // markdown-ish HTML
}

import b1 from "@/assets/product-brand.jpg";
import b2 from "@/assets/product-finance.jpg";
import b3 from "@/assets/product-marketing.jpg";
import b4 from "@/assets/product-planner.jpg";
import b5 from "@/assets/product-hr.jpg";
import b6 from "@/assets/product-realestate.jpg";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "starta-eget-foretag-checklista-2026",
    title: "Starta eget företag i Sverige 2026 — komplett checklista",
    excerpt:
      "Från affärsidé till första fakturan: 12 steg som hjälper dig att registrera, strukturera och växa ditt företag på rätt sätt.",
    date: "2026-05-12",
    readMinutes: 9,
    author: "IPNORD4K Redaktion",
    category: "Företagande",
    image: b1,
    content: `
<p>Att starta eget i Sverige är enklare än många tror — men det finns en handfull steg som verkligen avgör om resan blir smidig eller stressig. I den här guiden går vi igenom hela processen, från första idé till första fakturan.</p>

<h2>1. Validera din affärsidé</h2>
<p>Innan du registrerar ett bolag, prata med minst 10 potentiella kunder. Notera vad de faktiskt är villiga att betala för — inte bara vad de "tycker är intressant".</p>

<h2>2. Välj bolagsform</h2>
<p>De vanligaste formerna är <strong>enskild firma</strong> och <strong>aktiebolag</strong>. För omsättningar under ~300 000 kr/år räcker oftast enskild firma. Över det blir AB skattemässigt fördelaktigt.</p>

<h2>3. Registrera hos Bolagsverket och Skatteverket</h2>
<p>Båda kan göras digitalt via <em>verksamt.se</em>. Räkna med 2–4 veckors handläggning.</p>

<h2>4. Sätt upp bokföring från dag ett</h2>
<p>Använd ett enkelt molnprogram (Fortnox, Bokio, Visma). Spara <strong>alla</strong> kvitton — Skatteverket kräver det i 7 år.</p>

<h2>5. Skaffa F-skattsedel</h2>
<p>Utan F-skatt måste dina kunder dra preliminärskatt. Ansökan sker samtidigt som företagsregistreringen.</p>

<h2>6. Öppna företagskonto</h2>
<p>Håll privat och företag helt separat — det sparar dig timmar vid bokslut.</p>

<h2>7. Försäkringar</h2>
<p>Ansvarsförsäkring och inkomstförsäkring är ett minimum för de flesta soloföretagare.</p>

<h2>8. Prissättning</h2>
<p>Räkna med minst 30 % overhead, semester, sjukdagar och pension när du sätter ditt timpris.</p>

<h2>9. Avtal och villkor</h2>
<p>Använd alltid skriftliga uppdragsavtal. Det skyddar både dig och kunden.</p>

<h2>10. Marknadsföring</h2>
<p>Bygg en enkel hemsida, en LinkedIn-profil och be om referenser från dina första kunder.</p>

<h2>11. Första fakturan</h2>
<p>Inkludera ditt organisationsnummer, momsregistreringsnummer och tydliga betalvillkor (oftast 30 dagar netto).</p>

<h2>12. Skala upp</h2>
<p>När du har 3 betalande kunder — börja systematisera. Mallar, automationer och tydliga processer är skillnaden mellan ett jobb och ett företag.</p>

<p><em>Ladda ner vår <a href="/product/ultimate-entrepreneur-bundle">Ultimate Entrepreneur Bundle</a> för färdiga mallar till varje steg ovan.</em></p>
`,
  },
  {
    slug: "budgetmall-smaforetag",
    title: "Så bygger du en budget som faktiskt fungerar för ditt småföretag",
    excerpt:
      "En realistisk budget är skillnaden mellan att överleva tuffa månader och att gå i konkurs. Här är ramverket vi själva använder.",
    date: "2026-04-28",
    readMinutes: 7,
    author: "Erik Lindberg",
    category: "Ekonomi",
    image: b2,
    content: `
<p>De flesta småföretagare gör samma misstag: de bygger en optimistisk budget i januari och tittar aldrig på den igen. Den här guiden visar hur du gör en levande budget som faktiskt styr ditt företag.</p>

<h2>Steg 1: Lista alla fasta kostnader</h2>
<p>Hyra, licenser, försäkringar, bokföring, telefon. Allt som dras varje månad oavsett om du säljer eller inte.</p>

<h2>Steg 2: Identifiera rörliga kostnader</h2>
<p>Material, frakt, provisioner — kostnader som följer omsättningen.</p>

<h2>Steg 3: Sätt en realistisk omsättningsprognos</h2>
<p>Använd förra årets siffror minus 10 % som baseline. Bättre att överraskas positivt än tvärtom.</p>

<h2>Steg 4: Bygg in en buffert</h2>
<p>Sätt undan minst 3 månaders fasta kostnader på ett separat sparkonto.</p>

<h2>Steg 5: Följ upp varje månad</h2>
<p>Avsätt 30 minuter den första vardagen varje månad för att jämföra budget mot utfall. Det är där värdet skapas.</p>

<p>Vill du slippa börja från noll? Vår <a href="/product/foretagsbudget">Företagsbudget-mall</a> ger dig hela ramverket i en redigerbar PDF.</p>
`,
  },
  {
    slug: "marknadsforing-instagram-svenska-foretag",
    title: "Marknadsföring på Instagram för svenska företag — 2026-guiden",
    excerpt:
      "Algoritmen har förändrats igen. Så här bygger du räckvidd och försäljning utan att lägga en krona på annonser.",
    date: "2026-04-10",
    readMinutes: 8,
    author: "Sara Nilsson",
    category: "Marknadsföring",
    image: b3,
    content: `
<p>Instagram är fortfarande en av de mest kostnadseffektiva kanalerna för svenska småföretag — om du gör det rätt.</p>

<h2>Vad fungerar 2026</h2>
<ul>
<li><strong>Reels</strong> får fortfarande mest organisk räckvidd</li>
<li><strong>Karuseller</strong> är bäst för sparningar och delningar</li>
<li><strong>Stories</strong> bygger relation med befintliga följare</li>
</ul>

<h2>Innehållsplan på 4 veckor</h2>
<p>Publicera 3 inlägg per vecka enligt: 1 utbildande, 1 inspirerande, 1 säljande. Variera format mellan reels och karuseller.</p>

<h2>Skapa en visuell identitet</h2>
<p>Tre färger, två typsnitt, en mallserie. Det är allt du behöver för att se professionell ut.</p>

<p>Vår <a href="/product/social-media-toolkit">Social Media Toolkit</a> innehåller 30 färdiga mallar i Canva-format för exakt detta.</p>
`,
  },
  {
    slug: "produktivitet-veckoplanering",
    title: "Veckoplanering: metoden som ger dig 10 extra timmar i veckan",
    excerpt:
      "Veckoplanering är inte att skriva en lång att-göra-lista. Det är att medvetet välja vad du INTE ska göra.",
    date: "2026-03-22",
    readMinutes: 6,
    author: "Mikael Sjöberg",
    category: "Produktivitet",
    image: b4,
    content: `
<p>Den största produktivitetsvinsten kommer sällan från ett nytt verktyg — utan från en bättre process. Här är vår enkla veckoplaneringsrutin.</p>

<h2>Söndag kväll: 25 minuter</h2>
<ol>
<li>Granska föregående vecka — vad blev klart, vad blev inte?</li>
<li>Välj <strong>tre</strong> viktigaste resultat för kommande vecka</li>
<li>Boka in tid i kalendern för dessa tre — inte bara på listan</li>
<li>Identifiera vad du <em>inte</em> ska göra</li>
</ol>

<h2>Varje morgon: 5 minuter</h2>
<p>Definiera dagens "en sak" — den viktigaste uppgiften. Allt annat är bonus.</p>

<h2>Fredag eftermiddag: 15 minuter</h2>
<p>Stäng veckan med en kort retrospektiv. Vad funkade? Vad ska bort?</p>

<p>Använd vår <a href="/product/veckoplanerare">utskrivbara veckoplanerare</a> för att komma igång direkt.</p>
`,
  },
  {
    slug: "anstall-forsta-medarbetaren",
    title: "Anställ din första medarbetare — undvik de 7 vanligaste misstagen",
    excerpt:
      "Första anställningen är ett av de viktigaste besluten i ett företags liv. Här är vad ingen berättar för dig i förväg.",
    date: "2026-03-05",
    readMinutes: 8,
    author: "Anna Lundgren",
    category: "HR",
    image: b5,
    content: `
<p>Att gå från solo-företagare till arbetsgivare är ett kvantsprång. Med rätt förberedelser blir det en av dina bästa investeringar — utan dem en mardröm.</p>

<h2>Misstag 1: Anställa för tidigt</h2>
<p>Tumregel: du ska ha minst 6 månaders lön på banken plus arbetsgivaravgifter innan du rekryterar.</p>

<h2>Misstag 2: Otydliga arbetsuppgifter</h2>
<p>Skriv en detaljerad rollbeskrivning med tydliga mål. Annars vet ingen om det funkar.</p>

<h2>Misstag 3: Hoppa över introduktion</h2>
<p>De första 90 dagarna avgör om personen stannar i 3 år eller 6 månader.</p>

<h2>Misstag 4: Glömma kollektivavtal</h2>
<p>Även utan kollektivavtal måste du följa LAS, semesterlagen och arbetsmiljölagen.</p>

<h2>Misstag 5: Ingen anställningsavtal</h2>
<p>Skriftligt avtal är obligatoriskt enligt lag inom en månad från anställning.</p>

<h2>Misstag 6: Underskatta administrationen</h2>
<p>Lönebesked, AGI, arbetsgivardeklaration, pension. Ta hjälp av en lönetjänst.</p>

<h2>Misstag 7: Inte fira</h2>
<p>Första anställningen är en milstolpe. Markera den.</p>

<p>Vår <a href="/product/hr-kit">HR-startkit</a> innehåller färdiga mallar för anställningsavtal, introduktionsplan och medarbetarsamtal.</p>
`,
  },
  {
    slug: "saker-betalning-online-svenska-kunder",
    title: "Säker betalning online — vad svenska kunder förväntar sig 2026",
    excerpt:
      "Förtroende är den nya konverteringsoptimeringen. Så här bygger du en kassaupplevelse svenska kunder litar på.",
    date: "2026-02-18",
    readMinutes: 6,
    author: "IPNORD4K Redaktion",
    category: "E-handel",
    image: b6,
    content: `
<p>Svenska konsumenter är bland världens mest betalningsvana — och bland de mest kräsna när det kommer till säkerhet.</p>

<h2>Måsten i kassan</h2>
<ul>
<li>Stöd för <strong>kort</strong> (Visa, Mastercard, Amex)</li>
<li>Stöd för <strong>Klarna</strong> — minst hälften av svenska köpare väljer det</li>
<li>Tydlig SSL-säkerhet (HTTPS hela vägen)</li>
<li>Synliga betallogotyper i footern</li>
<li>Transparent leveranspolicy och returrätt</li>
</ul>

<h2>Förtroendesignaler som ökar konvertering</h2>
<p>Kundrecensioner, organisationsnummer i footern, tydlig kontaktinformation och GDPR-anpassad cookiepolicy.</p>

<h2>Vår betalningsinfrastruktur</h2>
<p>IPNORD4K använder Stripe för all kortbetalning och Klarna för faktura/delbetalning. Vi lagrar aldrig kortuppgifter på vår server — all hantering sker hos PCI-DSS-certifierade leverantörer.</p>

<p>Läs mer i vår <a href="/legal/privacy">integritetspolicy</a> och <a href="/legal/refund">återbetalningspolicy</a>.</p>
`,
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("sv-SE", { year: "numeric", month: "long", day: "numeric" });
}
