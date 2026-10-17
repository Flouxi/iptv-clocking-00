import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/refund")({
  head: () => ({
    meta: [
      { title: "Política de reembolsos — IPNORD4K" },
      { name: "description", content: "Cómo funcionan los reembolsos de productos PDF digitales." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de reembolsos" updated="2026-06-13">
      <h2>1. Productos digitales</h2>
      <p>
        Como vendemos archivos digitales que se entregan inmediatamente después de la compra,{" "}
        <strong>no existe un derecho general de desistimiento</strong> según el capítulo 2, artículo 11, punto 11 de la ley sueca de contratos a distancia. Aceptas esta condición al completar el pago.
      </p>

      <h2>2. Cuándo puedes solicitar un reembolso</h2>
      <p>Reembolsaremos la compra o enviaremos un archivo de sustitución si:</p>
      <ul>
        <li>El archivo está dañado o no se puede abrir.</li>
        <li>No has recibido el enlace de descarga en un plazo de 24 horas.</li>
        <li>El producto difiere sustancialmente de su descripción.</li>
        <li>Se ha producido un cargo duplicado por un error técnico.</li>
      </ul>

      <h2>3. Garantía de satisfacción de 30 días</h2>
      <p>
        Si el producto no cumple tus expectativas en los 30 días siguientes a la compra, contacta con nosotros. Intentaremos resolverlo con un producto de sustitución o, en casos concretos, un reembolso completo.
      </p>

      <h2>4. Cómo solicitar un reembolso</h2>
      <ol>
        <li>
          Escribe a{" "}
          <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>{" "}
          en los 30 días siguientes a la compra.
        </li>
        <li>
          Indica el número de pedido (en la página de confirmación o en el correo electrónico) y describe brevemente el problema.
        </li>
        <li>
          Respondemos en un plazo de 2 días laborables y tramitamos la solicitud en un máximo de 7 días laborables.
        </li>
      </ol>

      <h2>5. Método de reembolso</h2>
      <p>
        El reembolso se realiza al mismo método de pago utilizado en la compra. El importe puede tardar entre 5 y 10 días bancarios en aparecer en tu cuenta.
      </p>

      <h2>6. Contacto</h2>
      <p>
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>
      </p>
    </LegalLayout>
  ),
});
