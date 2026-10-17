import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    meta: [
      { title: "Condiciones de compra — IPNORD4K" },
      { name: "description", content: "Condiciones para comprar productos PDF digitales de IPNORD4K." },
    ],
  }),
  component: () => (
    <LegalLayout title="Condiciones de compra" updated="2026-06-13">
      <h2>1. General</h2>
      <p>
        Estas condiciones se aplican a las compras en IPNORD4K.COM. Al completar una compra, las aceptas. Solo vendemos productos digitales y no realizamos envíos físicos.
      </p>

      <h2>2. Productos</h2>
      <p>
        Todos los productos son archivos PDF descargables. La descripción y el número de páginas se indican en cada ficha de producto.
      </p>

      <h2>3. Precios y pago</h2>
      <p>
        Todos los precios se indican en euros (EUR), IVA incluido. El pago se gestiona mediante Stripe con los métodos disponibles en su página de pago. No almacenamos los datos de tu tarjeta.
      </p>

      <h2>4. Entrega</h2>
      <p>
        La entrega se realiza al completar el pago. Accederás a una página con el enlace de descarga y también te lo enviaremos por correo electrónico en un plazo de 2 minutos. Consulta nuestra{" "}
        <a href="/legal/delivery">política de entrega</a>.
      </p>

      <h2>5. Desistimiento y reembolsos</h2>
      <p>
        Según el capítulo 2, artículo 11, punto 11 de la ley sueca de contratos a distancia (2005:59),{" "}
        <strong>no existe derecho de desistimiento</strong> para productos digitales entregados inmediatamente con tu consentimiento expreso. Al completar la compra, aceptas la entrega inmediata y renuncias al derecho de desistimiento cuando se haya descargado el archivo.
      </p>
      <p>
        Excepción: si el archivo está dañado o no puede entregarse, recibirás un archivo de sustitución o un reembolso completo. Consulta nuestra{" "}
        <a href="/legal/refund">política de reembolsos</a>.
      </p>

      <h2>6. Licencia y uso</h2>
      <ul>
        <li>
          Recibes una licencia personal e intransferible para utilizar e imprimir los archivos sin límite para uso propio o interno de tu empresa.
        </li>
        <li>
          Está <strong>prohibido</strong> revender, compartir, publicar o distribuir los archivos, total o parcialmente.
        </li>
        <li>
          No está permitido modificar los archivos y venderlos como productos propios.
        </li>
      </ul>

      <h2>7. Propiedad intelectual</h2>
      <p>
        Todo el contenido del sitio y de los productos pertenece a IPNORD4K.COM y está protegido por derechos de autor.
      </p>

      <h2>8. Limitación de responsabilidad</h2>
      <p>
        Los productos se ofrecen en su estado actual. No asumimos responsabilidad por decisiones económicas basadas en estos materiales; utiliza tu propio criterio o consulta a un asesor.
      </p>

      <h2>9. Conflictos y legislación aplicable</h2>
      <p>
        Se aplica la legislación sueca. Las controversias se resolverán primero mediante diálogo y, en su caso, ante la Junta Nacional de Reclamaciones de Consumidores (ARN) o un tribunal ordinario sueco.
      </p>

      <h2>10. Contacto</h2>
      <p>
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>
      </p>
    </LegalLayout>
  ),
});
