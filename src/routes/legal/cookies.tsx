import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/LegalLayout";

export const Route = createFileRoute("/legal/cookies")({
  head: () => ({
    meta: [
      { title: "Política de cookies — IPNORD4K" },
      { name: "description", content: "Información sobre las cookies de IPNORD4K.COM." },
    ],
  }),
  component: () => (
    <LegalLayout title="Política de cookies" updated="2026-10-20">
      <h2>1. ¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que se guardan en tu navegador al visitar un sitio web. Permiten que el sitio funcione, recordar tus preferencias y analizar el tráfico.
      </p>

      <h2>2. Cookies que utilizamos</h2>

      <h3>Cookies necesarias (no se pueden desactivar)</h3>
      <ul>
        <li>
          <strong>Sesión e inicio de sesión:</strong> mantiene activo tu carrito entre las distintas páginas.
        </li>
        <li>
          <strong>Consentimiento de cookies:</strong> recuerda tus preferencias de cookies.
        </li>
        <li>
          <strong>Pago de Stripe:</strong> Stripe utiliza cookies para proteger los pagos y evitar el fraude. Consulta{" "}
          <a
            href="https://stripe.com/cookies-policy/legal"
            target="_blank"
            rel="noopener noreferrer"
          >
            la política de cookies de Stripe
          </a>
          .
        </li>
      </ul>

      <h3>Cookies analíticas (opcionales)</h3>
      <ul>
        <li>
          <strong>Orbitra Analytics</strong> — mide visitas y compras PDF atribuidas a campañas. Solo se activa al pulsar «Aceptar todas» y respeta las señales Global Privacy Control y Do Not Track. Guarda un identificador aleatorio en el almacenamiento de sesión durante un máximo de 30 minutos; no añade datos de contacto a las URL.
        </li>
      </ul>

      <h2>3. Gestionar tus cookies</h2>
      <p>
        Puedes retirar tu consentimiento en cualquier momento borrando las cookies de este sitio en tu navegador. El aviso de consentimiento volverá a aparecer.
      </p>
      <button type="button" className="text-primary underline" onClick={() => { localStorage.setItem('ipnord4k:cookie-consent:v1', 'essential'); window.dispatchEvent(new Event('orbitra-consent-changed')); window.alert('Analítica opcional desactivada.'); }}>Desactivar analítica opcional</button>
      <p>Cómo gestionar las cookies en los navegadores más habituales:</p>
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

      <h2>4. Consentimiento según el RGPD</h2>
      <p>
        Al visitar el sitio por primera vez, verás un aviso para elegir las cookies que aceptas. No se instalan cookies opcionales sin tu consentimiento.
      </p>

      <h2>5. Contacto</h2>
      <p>
        ¿Tienes dudas sobre las cookies? Escribe a{" "}
        <a href="mailto:support@ipnord4k.com">support@ipnord4k.com</a>.
      </p>
    </LegalLayout>
  ),
});
