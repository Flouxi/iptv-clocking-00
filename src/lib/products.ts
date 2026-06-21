import planner from "@/assets/product-planner.jpg";
import finance from "@/assets/product-finance.jpg";
import marketing from "@/assets/product-marketing.jpg";
import hr from "@/assets/product-hr.jpg";
import realestate from "@/assets/product-realestate.jpg";
import restaurant from "@/assets/product-restaurant.jpg";
import brand from "@/assets/product-brand.jpg";

export type Category =
  | "business"
  | "finance"
  | "marketing"
  | "hr"
  | "realestate"
  | "freelancer";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "business", label: "Företag" },
  { id: "finance", label: "Ekonomi" },
  { id: "marketing", label: "Marknadsföring" },
  { id: "hr", label: "HR" },
  { id: "realestate", label: "Fastigheter" },
  { id: "freelancer", label: "Frilansare" },
];

export interface Product {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  pages: number;
  short: string;
  description: string;
  features: string[];
  popular?: boolean;
  fileSizeMb?: number;
}

// Spanish World Cup 2026 Plans
export const SPANISH_WORLD_CUP_PLANS: Product[] = [
  {
    slug: "mundial-3-meses",
    name: "3 Meses Mundial 2026",
    price: 2499,
    originalPrice: 3999,
    category: "business" as Category,
    image: planner,
    rating: 4.9,
    reviews: 450,
    pages: 30,
    short: "Acceso 3 meses a +47.000 canales en 4K.",
    description:
      "Disfruta del Mundial 2026 en calidad 4K UHD con más de 47.000 canales en vivo, +190.000 películas y series, y soporte 24/7 en español.",
    features: [
      "Calidad SD/HD/FHD/4K",
      "+47.000 canales con EPG",
      "+190.000 VOD y series",
      "Canales PPV",
      "Tecnología anti-congelamiento",
      "Soporte dedicado 24/7",
      "Garantía de devolución 1 día",
      "Xtreme/M3U/MAG",
      "App propia Android",
      "Soporte VPN",
    ],
  },
  {
    slug: "mundial-6-meses-premium",
    name: "6 Meses + Premium Player",
    price: 4499,
    originalPrice: 6999,
    category: "business" as Category,
    image: planner,
    rating: 4.95,
    reviews: 520,
    pages: 30,
    short: "6 meses con Premium Player incluido.",
    description:
      "Acceso 6 meses + Premium Player. Disfruta del fútbol mundial sin interrupciones con la mejor tecnología de streaming.",
    features: [
      "Calidad SD/HD/FHD/4K",
      "+47.000 canales con EPG",
      "+190.000 VOD y series",
      "Canales PPV",
      "Tecnología anti-congelamiento",
      "Soporte dedicado 24/7",
      "Garantía de devolución 1 día",
      "Xtreme/M3U/MAG",
      "App propia Android",
      "Soporte VPN",
      "Premium Player incluido",
    ],
    popular: true,
  },
  {
    slug: "mundial-12-meses-premium",
    name: "12 Meses + Premium Player",
    price: 6499,
    originalPrice: 9999,
    category: "business" as Category,
    image: planner,
    rating: 5.0,
    reviews: 680,
    pages: 30,
    short: "Un año completo + Premium Player. Mejor valor.",
    description:
      "Acceso 12 meses + Premium Player. La mejor opción para disfrutar todo el año de deportes, películas y series en 4K.",
    features: [
      "Calidad SD/HD/FHD/4K",
      "+47.000 canales con EPG",
      "+190.000 VOD y series",
      "Canales PPV",
      "Tecnología anti-congelamiento",
      "Soporte dedicado 24/7",
      "Garantía de devolución 1 día",
      "Xtreme/M3U/MAG",
      "App propia Android",
      "Soporte VPN",
      "Premium Player incluido",
    ],
    popular: true,
  },
];

export const PRODUCTS: Product[] = [
  {
    slug: "starter-business-planner",
    name: "Starter Business Planner",
    price: 349,
    originalPrice: 499,
    category: "business",
    image: planner,
    rating: 4.8,
    reviews: 128,
    pages: 30,
    short: "30 utskrivbara PDF-sidor för att starta ditt företag rätt.",
    description:
      "En komplett startplanerare för nya företagare. 30 noggrant designade PDF-sidor som hjälper dig att strukturera idéer, mål, budget och dagliga rutiner.",
    features: ["30 utskrivbara sidor", "A4-format", "Direktnedladdning", "Använd hur många gånger du vill"],
  },
  {
    slug: "social-media-content-calendar",
    name: "Complete Social Media Content Calendar",
    price: 699,
    originalPrice: 899,
    category: "marketing",
    image: marketing,
    rating: 4.9,
    reviews: 214,
    pages: 45,
    short: "Komplett innehållskalender för sociala medier i PDF.",
    description:
      "Planera ett helt års innehåll för Instagram, LinkedIn, Facebook och TikTok. Inkluderar idébank, hashtag-mallar och postningsschema.",
    features: ["12 månaders kalender", "Idébank med 300+ poster", "Hashtag-mallar", "Analysmall"],
  },
  {
    slug: "small-business-starter-kit",
    name: "Small Business Starter Kit",
    price: 1049,
    originalPrice: 1399,
    category: "business",
    image: finance,
    rating: 4.7,
    reviews: 96,
    pages: 55,
    short: "Faktura + budget + lagerhantering i ett paket.",
    description:
      "Allt det administrativa du behöver för ditt småföretag — fakturamallar, budgetuppföljning och enkel lagerkontroll i en samlad PDF-pärm.",
    features: ["Fakturamallar", "Budgetkalkyl", "Lagerkontroll", "Kvittohanteringsmall"],
  },
  {
    slug: "freelancer-finance-pack",
    name: "Freelancer Finance Pack",
    price: 1299,
    originalPrice: 1699,
    category: "freelancer",
    image: finance,
    rating: 4.8,
    reviews: 142,
    pages: 60,
    short: "Kontrakt, fakturor och utläggsblad för frilansare.",
    description:
      "Det kompletta ekonomipaketet för dig som driver eget. Färdiga kontraktsmallar, professionella fakturor och tydliga utläggsblad.",
    features: ["Kundkontrakt", "Fakturamallar", "Utläggsspårning", "Skattekalkyl"],
  },
  {
    slug: "annual-goal-project-planner",
    name: "Annual Goal & Project Planner",
    price: 1399,
    originalPrice: 1899,
    category: "business",
    image: planner,
    rating: 4.9,
    reviews: 187,
    pages: 60,
    short: "60-sidig utskrivbar PDF för mål och projekt.",
    description:
      "Skapa kraftfulla årsmål och bryt ner dem i kvartal, månader och veckor med denna 60-sidiga planerare.",
    features: ["Årsöversikt", "Kvartalsmål", "Veckoplaner", "Projektmallar"],
  },
  {
    slug: "restaurant-business-forms",
    name: "Restaurant Business Forms Bundle",
    price: 1649,
    originalPrice: 2099,
    category: "business",
    image: restaurant,
    rating: 4.6,
    reviews: 73,
    pages: 70,
    short: "Allt-i-ett-paket för restaurangverksamhet.",
    description:
      "Beställningar, schemaläggning, lagerinventering, leverantörsavtal — alla blanketter en restaurang behöver.",
    features: ["Schemamallar", "Lagerblanketter", "Leverantörsavtal", "Personalhandbok"],
  },
  {
    slug: "real-estate-client-forms",
    name: "Real Estate Client Forms Pack",
    price: 1749,
    originalPrice: 2199,
    category: "realestate",
    image: realestate,
    rating: 4.7,
    reviews: 89,
    pages: 65,
    short: "Komplett blankettpaket för mäklare.",
    description:
      "Kundavtal, visningsprotokoll, budgivningsblanketter och uppföljningsmallar — färdigt för svensk mäklarpraxis.",
    features: ["Uppdragsavtal", "Visningsprotokoll", "Budgivningsblanketter", "CRM-mallar"],
  },
  {
    slug: "complete-hr-starter-kit",
    name: "Complete HR Starter Kit",
    price: 1999,
    originalPrice: 2599,
    category: "hr",
    image: hr,
    rating: 4.8,
    reviews: 156,
    pages: 90,
    short: "Anställningsblanketter, kontrakt och onboarding.",
    description:
      "Bygg upp ditt HR-arbete från grunden med färdiga anställningsavtal, onboarding-checklistor och utvecklingssamtalsmallar.",
    features: ["Anställningsavtal", "Onboarding-paket", "Utvecklingssamtal", "Policydokument"],
  },
  {
    slug: "ecommerce-business-toolkit",
    name: "E-commerce Business Toolkit",
    price: 2099,
    originalPrice: 2699,
    category: "business",
    image: marketing,
    rating: 4.8,
    reviews: 134,
    pages: 80,
    short: "80 utskrivbara PDF-blanketter för e-handel.",
    description:
      "Allt du behöver för att driva en lönsam e-butik — lagerhantering, returblanketter, marknadsföringsmallar och mer.",
    features: ["80 PDF-blanketter", "Returhantering", "Lagerkontroll", "Kampanjmallar"],
  },
  {
    slug: "marketing-agency-client-pack",
    name: "Marketing Agency Client Pack",
    price: 2349,
    originalPrice: 2999,
    category: "marketing",
    image: marketing,
    rating: 4.9,
    reviews: 102,
    pages: 85,
    short: "Förslag, rapporter och briefs för byråer.",
    description:
      "Professionella mallar för marknadsföringsbyråer — kundförslag, månadsrapporter, kreativa briefs och kontrakt.",
    features: ["Förslagsmallar", "Månadsrapporter", "Kreativa briefs", "Byråkontrakt"],
  },
  {
    slug: "ultimate-entrepreneur-bundle",
    name: "Ultimate Entrepreneur Bundle",
    price: 2449,
    originalPrice: 3299,
    category: "business",
    image: planner,
    rating: 5.0,
    reviews: 312,
    pages: 120,
    popular: true,
    fileSizeMb: 18,
    short: "100+ utskrivbara PDF-verktyg för företagare.",
    description:
      "Vår mest omfattande samling. Över 100 PDF-verktyg som täcker allt från strategi till dagliga rutiner.",
    features: ["100+ PDF-verktyg", "Strategimallar", "Dagliga rutiner", "Livstidsuppdateringar"],
  },
  {
    slug: "premium-brand-identity-workbook",
    name: "Premium Brand Identity Workbook",
    price: 2699,
    originalPrice: 3499,
    category: "marketing",
    image: brand,
    rating: 4.9,
    reviews: 178,
    pages: 95,
    short: "Strategi, logotypbrief och varumärkesguide.",
    description:
      "En premium-arbetsbok för att definiera ditt varumärke från grunden — strategi, position, visuell identitet och tonalitet.",
    features: ["Varumärkesstrategi", "Logotypbrief", "Visuell guide", "Tonalitetsmanual"],
  },
  {
    slug: "full-business-launch-kit",
    name: "Full Business Launch Kit",
    price: 3049,
    originalPrice: 3999,
    category: "business",
    image: planner,
    rating: 5.0,
    reviews: 264,
    pages: 150,
    short: "Allt en startup behöver — i PDF.",
    description:
      "Det ultimata lanseringskittet för nya företag. Affärsplan, juridiska mallar, marknadsföringsplan och ekonomistyrning.",
    features: ["Affärsplan", "Juridiska mallar", "Marknadsplan", "Ekonomistyrning"],
  },
];

export const formatPrice = (n: number) =>
  `${n.toLocaleString("sv-SE")} kr`;

export const formatPriceEUR = (n: number) =>
  `${(n / 100).toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€`;

export const getProduct = (slug: string) => {
  // Check Spanish World Cup plans first
  const wcPlan = SPANISH_WORLD_CUP_PLANS.find((p) => p.slug === slug);
  if (wcPlan) return wcPlan;
  // Then check regular products
  return PRODUCTS.find((p) => p.slug === slug);
};

export const getCategoryLabel = (id: Category) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const getAllProducts = () => [...SPANISH_WORLD_CUP_PLANS, ...PRODUCTS];
