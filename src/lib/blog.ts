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
    title: "Crear una empresa en Suecia en 2026: lista de pasos completa",
    excerpt:
      "De la idea a la primera factura: 12 pasos para registrar, organizar y hacer crecer tu empresa.",
    date: "2026-05-12",
    readMinutes: 9,
    author: "Equipo editorial de IPNORD4K",
    category: "Emprendimiento",
    image: b1,
    content: "\n<p>Crear una empresa en Suecia resulta más sencillo de lo que parece, pero algunos pasos son decisivos para que el proceso sea ordenado. Esta guía recorre el camino desde la primera idea hasta la primera factura.</p>\n<h2>1. Valida tu idea de negocio</h2><p>Antes de registrar la empresa, habla con al menos 10 clientes potenciales. Anota por qué estarían dispuestos a pagar, además de lo que les parece interesante.</p>\n<h2>2. Elige la forma jurídica</h2><p>Las opciones más habituales en Suecia son <strong>enskild firma</strong> y <strong>aktiebolag</strong>. La guía original toma como referencia una facturación aproximada de 300.000 SEK al año para comparar ambas opciones; la elección depende de la situación del negocio.</p>\n<h2>3. Regístrate en Bolagsverket y Skatteverket</h2><p>Ambos trámites pueden realizarse por internet mediante <em>verksamt.se</em>. El plazo indicado es de 2 a 4 semanas.</p>\n<h2>4. Organiza la contabilidad desde el primer día</h2><p>Utiliza una herramienta en la nube como Fortnox, Bokio o Visma. Conserva <strong>todos</strong> los justificantes durante el plazo de conservación contable de 7 años indicado en esta guía.</p>\n<h2>5. Solicita el registro F-skatt</h2><p>Sin este registro, tus clientes pueden tener que practicar retenciones fiscales. La solicitud se presenta junto con el registro de la empresa.</p>\n<h2>6. Abre una cuenta empresarial</h2><p>Separa las finanzas personales de las del negocio para facilitar el cierre contable.</p>\n<h2>7. Seguros</h2><p>Valora un seguro de responsabilidad civil y otro de protección de ingresos para tu actividad.</p>\n<h2>8. Fija tus precios</h2><p>Al calcular tu tarifa por hora, incluye los gastos generales, vacaciones, bajas y aportaciones para la jubilación.</p>\n<h2>9. Contratos y condiciones</h2><p>Utiliza acuerdos escritos para proteger tanto a tu empresa como al cliente.</p>\n<h2>10. Marketing</h2><p>Crea una web sencilla, un perfil de LinkedIn y solicita referencias a tus primeros clientes.</p>\n<h2>11. La primera factura</h2><p>Incluye los números de registro e IVA y unas condiciones de pago claras, normalmente de 30 días.</p>\n<h2>12. Haz crecer tu negocio</h2><p>Cuando tengas tres clientes de pago, empieza a sistematizar tu trabajo con plantillas, automatizaciones y procesos claros.</p>\n<p><em>Descarga nuestro <a href=\"/product/ultimate-entrepreneur-bundle\">paquete completo para emprendedores</a> para acceder a plantillas relacionadas con estos pasos.</em></p>\n",
  },
  {
    slug: "budgetmall-smaforetag",
    title: "Cómo preparar un presupuesto útil para tu pequeña empresa",
    excerpt:
      "Un presupuesto realista ayuda a superar los meses difíciles. Este es el método que utilizamos.",
    date: "2026-04-28",
    readMinutes: 7,
    author: "Erik Lindberg",
    category: "Finanzas",
    image: b2,
    content: "\n<p>Muchas pequeñas empresas preparan un presupuesto optimista en enero y no vuelven a consultarlo. Esta guía explica cómo convertirlo en una herramienta de gestión diaria.</p>\n<h2>Paso 1: Anota los gastos fijos</h2><p>Alquiler, licencias, seguros, contabilidad y teléfono: todos los gastos mensuales que existen aunque no vendas.</p>\n<h2>Paso 2: Identifica los gastos variables</h2><p>Materiales, transporte y comisiones: los costes que cambian con la facturación.</p>\n<h2>Paso 3: Prepara una previsión realista</h2><p>Utiliza las cifras del año anterior menos un 10 % como punto de partida. Es preferible una sorpresa positiva.</p>\n<h2>Paso 4: Crea un fondo de reserva</h2><p>Reserva al menos tres meses de gastos fijos en una cuenta de ahorro separada.</p>\n<h2>Paso 5: Revisa las cifras cada mes</h2><p>Dedica 30 minutos el primer día laborable de cada mes a comparar el presupuesto con los resultados reales.</p>\n<p>¿Prefieres no empezar desde cero? Nuestro <a href=\"/product/small-business-starter-kit\">kit de inicio para pequeñas empresas</a> incluye plantillas para organizar tus finanzas.</p>\n",
  },
  {
    slug: "marknadsforing-instagram-svenska-foretag",
    title: "Marketing en Instagram para empresas suecas: guía de 2026",
    excerpt:
      "El algoritmo ha vuelto a cambiar. Aprende a aumentar tu alcance y tus ventas sin invertir en anuncios.",
    date: "2026-04-10",
    readMinutes: 8,
    author: "Sara Nilsson",
    category: "Marketing",
    image: b3,
    content: "\n<p>Instagram sigue siendo un canal de marketing rentable para las pequeñas empresas suecas cuando se utiliza con una estrategia clara.</p>\n<h2>Qué funciona en 2026</h2><ul><li>Los <strong>reels</strong> destacan por su alcance orgánico.</li><li>Los <strong>carruseles</strong> favorecen que se guarde y comparta el contenido.</li><li>Las <strong>stories</strong> ayudan a mantener la relación con tus seguidores.</li></ul>\n<h2>Plan de contenidos de cuatro semanas</h2><p>Publica tres veces por semana: una publicación educativa, otra inspiradora y otra comercial. Alterna reels y carruseles.</p>\n<h2>Crea una identidad visual</h2><p>Tres colores, dos tipografías y una serie de plantillas ayudan a presentar una imagen profesional.</p>\n<p>Nuestro <a href=\"/product/social-media-content-calendar\">calendario de contenidos para redes sociales</a> te ayuda a organizar las publicaciones.</p>\n",
  },
  {
    slug: "produktivitet-veckoplanering",
    title: "Planificación semanal: un método para ganar 10 horas cada semana",
    excerpt:
      "Planificar la semana no consiste en hacer una lista interminable, sino en decidir conscientemente qué tareas no vas a hacer.",
    date: "2026-03-22",
    readMinutes: 6,
    author: "Mikael Sjöberg",
    category: "Productividad",
    image: b4,
    content: "\n<p>La mayor mejora de productividad suele venir de un proceso más claro, no de una herramienta nueva. Esta es nuestra rutina semanal.</p>\n<h2>Domingo por la tarde: 25 minutos</h2><ol><li>Revisa la semana anterior: qué terminaste y qué quedó pendiente.</li><li>Elige los <strong>tres</strong> resultados más importantes de la próxima semana.</li><li>Reserva tiempo en tu calendario para conseguirlos.</li><li>Decide qué tareas <em>no</em> vas a hacer.</li></ol>\n<h2>Cada mañana: 5 minutos</h2><p>Define la tarea más importante del día. Todo lo demás será un avance adicional.</p>\n<h2>Viernes por la tarde: 15 minutos</h2><p>Cierra la semana con una revisión breve: qué funcionó y qué debes dejar de hacer.</p>\n<p>Empieza con nuestro <a href=\"/product/annual-goal-project-planner\">planificador de objetivos y proyectos</a>.</p>\n",
  },
  {
    slug: "anstall-forsta-medarbetaren",
    title: "Contratar a tu primer empleado: evita los 7 errores más habituales",
    excerpt:
      "La primera contratación es una decisión clave para cualquier empresa. Esto es lo que debes saber antes de dar el paso.",
    date: "2026-03-05",
    readMinutes: 8,
    author: "Anna Lundgren",
    category: "HR",
    image: b5,
    content: "\n<p>Pasar de trabajar por tu cuenta a contratar personal supone un gran cambio. Prepararlo bien puede convertirlo en una buena inversión.</p>\n<h2>Error 1: Contratar demasiado pronto</h2><p>Como referencia, reserva al menos seis meses de salario y las cotizaciones empresariales antes de contratar.</p>\n<h2>Error 2: No definir las tareas</h2><p>Redacta una descripción detallada del puesto con objetivos claros para poder evaluar los resultados.</p>\n<h2>Error 3: Omitir la incorporación</h2><p>Los primeros 90 días son decisivos para la integración y la permanencia en la empresa.</p>\n<h2>Error 4: Olvidar los convenios colectivos</h2><p>En Suecia, también debes tener en cuenta la normativa laboral, de vacaciones y de prevención de riesgos aplicable aunque no exista convenio colectivo.</p>\n<h2>Error 5: No preparar un contrato</h2><p>Formaliza las condiciones de trabajo por escrito dentro de los plazos legales aplicables.</p>\n<h2>Error 6: Subestimar la administración</h2><p>Nóminas, declaraciones de empleador, cotizaciones y pensiones requieren tiempo. Valora recurrir a un servicio de nóminas.</p>\n<h2>Error 7: No celebrarlo</h2><p>La primera contratación es un hito para tu empresa. Dedica un momento a reconocerlo.</p>\n<p>Nuestro <a href=\"/product/complete-hr-starter-kit\">kit de recursos humanos</a> contiene plantillas de contratos, planes de incorporación y evaluaciones de personal.</p>\n",
  },
  {
    slug: "saker-betalning-online-svenska-kunder",
    title: "Pagos seguros por internet: qué esperan los clientes suecos en 2026",
    excerpt:
      "La confianza es esencial para vender. Así puedes ofrecer una experiencia de pago que inspire seguridad.",
    date: "2026-02-18",
    readMinutes: 6,
    author: "Equipo editorial de IPNORD4K",
    category: "Comercio electrónico",
    image: b6,
    content: "\n<p>Los consumidores suecos utilizan habitualmente los pagos digitales y prestan atención a la seguridad de sus compras.</p>\n<h2>Elementos esenciales al pagar</h2><ul><li>Pago con <strong>tarjeta</strong>, como Visa, Mastercard y American Express.</li><li>Métodos de pago adecuados para el cliente, como <strong>Klarna</strong> cuando esté disponible.</li><li>Conexión segura mediante HTTPS.</li><li>Logotipos de pago visibles.</li><li>Políticas de entrega y devolución transparentes.</li></ul>\n<h2>Señales que generan confianza</h2><p>Opiniones de clientes, número de registro empresarial, datos de contacto claros y una política de cookies adaptada al RGPD.</p>\n<h2>Nuestra infraestructura de pago</h2><p>IPNORD4K utiliza Stripe para gestionar los pagos. Los métodos disponibles se muestran en su página de pago. No guardamos datos de tarjetas en nuestro servidor: su tratamiento se realiza mediante proveedores certificados según PCI-DSS.</p>\n<p>Consulta nuestra <a href=\"/legal/privacy\">política de privacidad</a> y nuestra <a href=\"/legal/refund\">política de reembolsos</a>.</p>\n",
  },
];

export function getPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}
