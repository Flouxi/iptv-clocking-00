import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    meta: [
      { title: "Política de privacidad — IPNORD4K" },
      { name: "description", content: "Cómo tratamos tus datos personales de acuerdo con el RGPD." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de privacidad" updated="2026-06-13">
      <p>
        IPNORD4K.COM («nosotros») respeta tu privacidad. Esta política explica qué información recopilamos cuando visitas el sitio o compras nuestros productos digitales, cómo la utilizamos y cuáles son tus derechos según el Reglamento General de Protección de Datos de la UE (RGPD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <p>
        IPNORD4K.COM es responsable del tratamiento de tus datos personales. Contacta con nosotros en{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a> si tienes dudas.
      </p>

      <h2>2. Datos que recopilamos</h2>
      <ul>
        <li>
          <strong>Información de compra:</strong> nombre, correo electrónico, dirección de facturación y datos de pago. Stripe gestiona los datos de la tarjeta; nosotros nunca los almacenamos.
        </li>
        <li>
          <strong>Comunicaciones:</strong> mensajes que nos envías mediante el formulario de contacto o por correo electrónico.
        </li>
        <li>
          <strong>Información técnica:</strong> dirección IP, tipo de navegador y cookies (consulta nuestra política de cookies).
        </li>
      </ul>

      <h2>3. Cómo utilizamos tus datos</h2>
      <ul>
        <li>Para tramitar tu pedido y entregar tus archivos PDF.</li>
        <li>Para enviar la confirmación del pedido y el enlace de descarga por correo electrónico.</li>
        <li>Para responder a tus preguntas y prestar asistencia al cliente.</li>
        <li>Para cumplir nuestras obligaciones legales, por ejemplo, las contables.</li>
      </ul>

      <h2>4. Base jurídica</h2>
      <p>
        Tratamos tus datos para ejecutar el contrato de compra, cumplir obligaciones legales de contabilidad y atender intereses legítimos de asistencia al cliente y seguridad.
      </p>

      <h2>5. Servicios de terceros</h2>
      <p>
        Solo compartimos los datos necesarios con proveedores de confianza:
      </p>
      <ul>
        <li>
          <strong>Stripe</strong> — para gestionar pagos. Stripe actúa como encargado del tratamiento y cuenta con certificación PCI-DSS.
        </li>
        <li>
          <strong>Nuestro proveedor de correo electrónico</strong> — para enviar mensajes relacionados con tus compras.
        </li>
      </ul>
      <p>
        <strong>Nunca vendemos tus datos personales a terceros.</strong>
      </p>

      <h2>6. Plazo de conservación</h2>
      <p>
        Los datos de los pedidos se conservan durante 7 años según la legislación contable sueca. Las comunicaciones de asistencia se eliminan después de 24 meses.
      </p>

      <h2>7. Tus derechos (RGPD)</h2>
      <ul>
        <li>Derecho de acceso a tus datos personales.</li>
        <li>Derecho a corregir datos incorrectos.</li>
        <li>Derecho a solicitar la supresión de tus datos («derecho al olvido»).</li>
        <li>Derecho a oponerte al tratamiento.</li>
        <li>Derecho a la portabilidad de los datos.</li>
        <li>Derecho a presentar una reclamación ante la autoridad sueca de protección de datos (IMY).</li>
      </ul>
      <p>
        Para ejercer tus derechos, escribe a{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>.
      </p>

      <h2>8. Cookies</h2>
      <p>
        Consulta nuestra <a href="/legal/cookies">política de cookies</a> para conocer las cookies que utilizamos y cómo gestionarlas.
      </p>

      <h2>9. Cambios</h2>
      <p>
        Podemos actualizar esta política. La versión más reciente estará siempre disponible en esta página.
      </p>
    </LegalLayout>
  ),
});
