import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/delivery")({
  head: () => ({
    meta: [
      { title: "Política de entrega — IPNORD4K" },
      { name: "description", content: "Todos los productos son archivos PDF digitales que se entregan en un plazo de 2 minutos." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de entrega" updated="2026-06-13">
      <h2>1. Entrega digital</h2>
      <p>
        Todos los productos de IPNORD4K.COM son archivos PDF digitales. No se realiza ningún envío físico ni postal.
      </p>

      <h2>2. Plazo de entrega</h2>
      <p>
        La entrega se realiza inmediatamente después de completar el pago, normalmente en{" "}
        <strong>2 minutos</strong>.
      </p>

      <h2>3. Método de entrega</h2>
      <ul>
        <li>
          Tras el pago, accederás directamente a una página con el enlace de descarga.
        </li>
        <li>
          También enviaremos una copia del enlace al correo electrónico indicado al pagar.
        </li>
        <li>
          El enlace de descarga es válido durante 30 días y puede utilizarse varias veces.
        </li>
      </ul>

      <h2>4. Si no has recibido tu archivo</h2>
      <ol>
        <li>Revisa la carpeta de spam o correo no deseado.</li>
        <li>
          Busca el remitente <em>noreply@ipnord4k.com</em> en tu bandeja de entrada.
        </li>
        <li>
          Contacta con{" "}
          <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a> con tu número de pedido y lo resolveremos en un plazo de 24 horas.
        </li>
      </ol>

      <h2>5. Formato y requisitos técnicos</h2>
      <p>
        Todos los archivos se entregan en PDF A4, optimizados para imprimir y compatibles con ordenadores, móviles y tabletas actuales.
      </p>

      <h2>6. Sin envíos físicos</h2>
      <p>
        No enviamos productos físicos. No se aplican gastos de envío ni de entrega.
      </p>
    </LegalLayout>
  ),
});
