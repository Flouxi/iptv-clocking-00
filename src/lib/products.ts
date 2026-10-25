import pdfCatalog from "./pdf-catalog.json";
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
  | "freelancer"
  | "iptv";

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: "business", label: "Empresa" },
  { id: "finance", label: "Finanzas" },
  { id: "marketing", label: "Marketing" },
  { id: "hr", label: "RR. HH." },
  { id: "realestate", label: "Inmobiliaria" },
  { id: "freelancer", label: "Autónomos" },
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
  previews?: { src: string; page: number }[];
}

// Spanish World Cup 2026 Plans
export const SPANISH_WORLD_CUP_PLANS: Product[] = [
  {
    slug: "mundial-3-meses",
    name: "3 Meses Mundial 2026",
    price: 24.99,
    originalPrice: 39.99,
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
    price: 44.99,
    originalPrice: 69.99,
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
    price: 64.99,
    originalPrice: 99.99,
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

const CATALOG_PRODUCTS: Product[] = [
  {
    slug: "starter-business-planner",
    name: "Planificador para iniciar tu negocio",
    price: 29,
    originalPrice: 44.77,
    category: "business",
    image: planner,
    rating: 4.8,
    reviews: 128,
    pages: 30,
    short: "30 páginas PDF imprimibles para empezar tu negocio con buen pie.",
    description:
      "Un planificador completo para nuevos emprendedores. Incluye 30 páginas PDF cuidadosamente diseñadas para organizar ideas, objetivos, presupuestos y rutinas diarias.",
    features: ["30 páginas imprimibles", "Formato A4", "Descarga inmediata", "Uso ilimitado"],
  },
  {
    slug: "social-media-content-calendar",
    name: "Calendario completo de contenidos para redes sociales",
    price: 65,
    originalPrice: 80.66,
    category: "marketing",
    image: marketing,
    rating: 4.9,
    reviews: 214,
    pages: 45,
    short: "Calendario completo de contenidos para redes sociales en PDF.",
    description:
      "Planifica un año de contenidos para Instagram, LinkedIn, Facebook y TikTok. Incluye un banco de ideas, plantillas de hashtags y un calendario de publicaciones.",
    features: ["Calendario de 12 meses", "Banco con más de 300 ideas", "Plantillas de hashtags", "Plantilla de análisis"],
  },
  {
    slug: "small-business-starter-kit",
    name: "Kit de inicio para pequeñas empresas",
    price: 94.12,
    originalPrice: 125.53,
    category: "business",
    image: finance,
    rating: 4.7,
    reviews: 96,
    pages: 55,
    short: "Facturación, presupuesto y gestión de inventario en un solo paquete.",
    description:
      "Todos los documentos administrativos que necesita tu pequeña empresa: plantillas de facturas, seguimiento del presupuesto y control de inventario en un único archivo PDF.",
    features: ["Plantillas de facturas", "Hoja de presupuesto", "Control de inventario", "Plantilla de justificantes"],
  },
  {
    slug: "freelancer-finance-pack",
    name: "Paquete financiero para autónomos",
    price: 119,
    originalPrice: 152.45,
    category: "freelancer",
    image: finance,
    rating: 4.8,
    reviews: 142,
    pages: 60,
    short: "Contratos, facturas y hojas de gastos para profesionales autónomos.",
    description:
      "Un paquete financiero completo para tu actividad: esquemas contractuales y de facturación para adaptar, hojas de gastos y estimaciones manuales.",
    features: ["Contratos con clientes", "Plantillas de facturas", "Seguimiento de gastos", "Hojas manuales de estimación fiscal"],
  },
  {
    slug: "annual-goal-project-planner",
    name: "Planificador anual de objetivos y proyectos",
    price: 125.53,
    originalPrice: 170.39,
    category: "business",
    image: planner,
    rating: 4.9,
    reviews: 187,
    pages: 60,
    short: "60 páginas PDF imprimibles para organizar objetivos y proyectos.",
    description:
      "Define tus objetivos anuales y distribúyelos por trimestres, meses y semanas con este planificador de 60 páginas.",
    features: ["Resumen anual", "Objetivos trimestrales", "Planes semanales", "Plantillas de proyectos"],
  },
  {
    slug: "restaurant-business-forms",
    name: "Paquete de formularios para restaurantes",
    price: 147.96,
    originalPrice: 188.34,
    category: "business",
    image: restaurant,
    rating: 4.6,
    reviews: 73,
    pages: 70,
    short: "Un paquete completo de documentos para gestionar tu restaurante.",
    description:
      "Pedidos, turnos, inventario y contratos con proveedores: todos los formularios que necesita un restaurante.",
    features: ["Plantillas de turnos", "Formularios de inventario", "Contratos con proveedores", "Manual del personal"],
  },
  {
    slug: "real-estate-client-forms",
    name: "Paquete de formularios para clientes inmobiliarios",
    price: 156.93,
    originalPrice: 197.31,
    category: "realestate",
    image: realestate,
    rating: 4.7,
    reviews: 89,
    pages: 65,
    short: "Documentación completa para agentes inmobiliarios.",
    description:
      "Contratos con clientes, informes de visitas, formularios de ofertas y plantillas de seguimiento, en español para adaptar a tu mercado. Incluye esquemas contractuales sujetos a revisión jurídica local.",
    features: ["Contratos de servicios", "Informes de visitas", "Formularios de ofertas", "Seguimiento de clientes"],
  },
  {
    slug: "complete-hr-starter-kit",
    name: "Kit completo de recursos humanos",
    price: 179.36,
    originalPrice: 233.20,
    category: "hr",
    image: hr,
    rating: 4.8,
    reviews: 156,
    pages: 90,
    short: "Formularios de contratación, contratos y acogida de empleados.",
    description:
      "Organiza los recursos humanos de tu empresa con esquemas de condiciones laborales para revisión, listas de incorporación y plantillas de evaluación.",
    features: ["Esquemas de condiciones laborales para revisión", "Paquete de incorporación", "Evaluaciones de desempeño", "Documentos de políticas"],
  },
  {
    slug: "ecommerce-business-toolkit",
    name: "Kit de herramientas para comercio electrónico",
    price: 188.34,
    originalPrice: 242.17,
    category: "business",
    image: marketing,
    rating: 4.8,
    reviews: 134,
    pages: 80,
    short: "80 páginas PDF para organizar tu tienda online.",
    description:
      "Todo lo que necesitas para gestionar una tienda online rentable: inventario, devoluciones, plantillas de marketing y mucho más.",
    features: ["80 páginas PDF rellenables", "Gestión de devoluciones", "Control de inventario", "Plantillas de campañas"],
  },
  {
    slug: "marketing-agency-client-pack",
    name: "Paquete de clientes para agencias de marketing",
    price: 210.77,
    originalPrice: 269.09,
    category: "marketing",
    image: marketing,
    rating: 4.9,
    reviews: 102,
    pages: 85,
    short: "Propuestas, informes y documentos de trabajo para agencias.",
    description:
      "Plantillas profesionales para agencias de marketing: propuestas para clientes, informes mensuales, documentos creativos y contratos.",
    features: ["Plantillas de propuestas", "Informes mensuales", "Documentos creativos", "Contratos para agencias"],
  },
  {
    slug: "ultimate-entrepreneur-bundle",
    name: "Paquete completo para emprendedores",
    price: 219.74,
    originalPrice: 296.01,
    category: "business",
    image: planner,
    rating: 5.0,
    reviews: 312,
    pages: 120,
    popular: true,
    fileSizeMb: 18,
    short: "Más de 100 herramientas PDF imprimibles para emprendedores.",
    description:
      "Nuestra colección más completa: más de 100 herramientas PDF para la estrategia de tu empresa y sus tareas diarias.",
    features: ["Más de 100 herramientas PDF", "Plantillas de estrategia", "Rutinas diarias", "PDF reutilizable y rellenable"],
  },
  {
    slug: "premium-brand-identity-workbook",
    name: "Cuaderno premium de identidad de marca",
    price: 242.17,
    originalPrice: 313.95,
    category: "marketing",
    image: brand,
    rating: 4.9,
    reviews: 178,
    pages: 95,
    short: "Estrategia, instrucciones para el logotipo y guía de marca.",
    description:
      "Un cuaderno premium para definir tu marca desde cero: estrategia, posicionamiento, identidad visual y tono de comunicación.",
    features: ["Estrategia de marca", "Instrucciones para el logotipo", "Guía visual", "Manual de tono de comunicación"],
  },
  {
    slug: "full-business-launch-kit",
    name: "Kit completo para lanzar tu empresa",
    price: 273.58,
    originalPrice: 358.82,
    category: "business",
    image: planner,
    rating: 5.0,
    reviews: 264,
    pages: 150,
    short: "Todo lo que necesita una nueva empresa, en PDF.",
    description:
      "El kit completo para lanzar un negocio: plan de empresa, modelos legales, plan de marketing y gestión financiera.",
    features: ["Plan de empresa", "Borradores para revisión profesional", "Plan de marketing", "Gestión financiera"],
  },
  {
    slug: "iptv-mundial-24",
    name: "IPTV Mundial 24.99€",
    price: 24.99,
    category: "iptv",
    image: planner,
    rating: 4.9,
    reviews: 1240,
    pages: 0,
    short: "3 meses de IPTV con 30,000+ canales en directo.",
    description:
      "Acceso a 30,000+ canales de televisión en directo, películas, series y todo el fútbol del Mundial 2026. Entrega en 15 minutos.",
    features: ["30,000+ canales", "Cobertura mundial", "4K UHD", "Garantía 30 días"],
  },
  {
    slug: "iptv-mundial-44",
    name: "IPTV Mundial 44.99€",
    price: 44.99,
    category: "iptv",
    image: planner,
    rating: 4.9,
    reviews: 1240,
    pages: 0,
    short: "1 año de IPTV con acceso completo a todos los eventos.",
    description:
      "Un año completo de acceso a 30,000+ canales, todo el fútbol del Mundial 2026, películas, series y deportes en vivo. Entrega inmediata.",
    features: ["30,000+ canales", "1 año completo", "4K UHD", "Garantía 30 días"],
    popular: true,
  },
  {
    slug: "iptv-mundial-64",
    name: "IPTV Mundial 64.99€",
    price: 64.99,
    category: "iptv",
    image: planner,
    rating: 4.9,
    reviews: 1240,
    pages: 0,
    short: "3 años + 6 meses gratis. La mejor oferta del Mundial.",
    description:
      "3 años y medio de IPTV sin interrupciones. Acceso total a 30,000+ canales, todo el fútbol, películas, series y deportes. Entrega en 15 minutos.",
    features: ["30,000+ canales", "3.5 años", "4K UHD", "Garantía 30 días"],
  },
];

export const PRODUCTS: Product[] = CATALOG_PRODUCTS.filter(product => pdfCatalog.some(file => file.slug === product.slug)).map(product => {
  const file = pdfCatalog.find(file => file.slug === product.slug);
  return file ? { ...product, image: file.image, previews: file.previews, pages: file.pages, fileSizeMb: Number((file.bytes / 1048576).toFixed(2)) } : product;
});

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export const formatPriceEUR = (n: number) =>
  formatPrice(n);

export const getProduct = (slug: string) => {
  return PRODUCTS.find((p) => p.slug === slug);
};

export const getCategoryLabel = (id: Category) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export const getAllProducts = () => PRODUCTS;
