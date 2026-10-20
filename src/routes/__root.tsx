import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { startPdfAttribution } from "@/lib/orbitra-attribution";
import appCss from "../styles.css?url";
import faviconAsset from "@/assets/ipnord4k-favicon.png.asset.json";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";


function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o se ha movido.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Se ha producido un error</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          No se pudo cargar la página. Inténtalo de nuevo o vuelve al inicio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Intentar de nuevo
          </button>
          <a href="/" className="rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent">
            Ir al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IPNORD4K — Herramientas PDF profesionales para emprendedores" },
      { name: "description", content: "Descarga, imprime y avanza. Herramientas PDF profesionales, planificadores y plantillas empresariales para empresarios suecos." },
      { property: "og:title", content: "IPNORD4K — Herramientas PDF profesionales para emprendedores" },
      { property: "og:description", content: "Descarga, imprime y avanza. Herramientas PDF profesionales, planificadores y plantillas empresariales para empresarios suecos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "IPNORD4K — Herramientas PDF profesionales para emprendedores" },
      { name: "twitter:description", content: "Descarga, imprime y avanza. Herramientas PDF profesionales, planificadores y plantillas empresariales para empresarios suecos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e7274db-0d5e-4847-b659-8d5fd65846ab/id-preview-955725e1--34400f1f-62c6-4453-beb7-51f074c5d8d0.lovable.app-1781382796712.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1e7274db-0d5e-4847-b659-8d5fd65846ab/id-preview-955725e1--34400f1f-62c6-4453-beb7-51f074c5d8d0.lovable.app-1781382796712.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: faviconAsset.url },
      { rel: "apple-touch-icon", href: faviconAsset.url },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isTvCheckout = useRouterState({ select: s => s.location.pathname === '/tv' || s.location.pathname === '/tv-success' });
  const path = useRouterState({ select: s => s.location.pathname });
  useEffect(() => {
    if (isTvCheckout) return;
    const run = () => { void startPdfAttribution(); };
    run();
    window.addEventListener('orbitra-consent-changed', run);
    window.addEventListener('storage', run);
    return () => { window.removeEventListener('orbitra-consent-changed', run); window.removeEventListener('storage', run); };
  }, [path, isTvCheckout]);
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <div className="flex min-h-screen flex-col">
          {isTvCheckout ? <header className="border-b border-border bg-card"><div className="container-page flex h-16 items-center justify-between gap-4"><a href="https://www.iptvnord4k.com/" className="font-display text-xl font-bold">IPTVNORD4K</a><span className="text-sm text-muted-foreground">Pago seguro con Stripe</span></div></header> : <Header />}
          <main className="flex-1">
            <Outlet />
          </main>
          {isTvCheckout ? <footer className="border-t border-border bg-card py-6"><div className="container-page flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"><span>IPTVNORD4K · Paquetes de televisión</span><a href="https://www.iptvnord4k.com/villkor" className="underline">Condiciones y reembolsos</a><a href="https://www.iptvnord4k.com/integritetspolicy" className="underline">Privacidad</a><a href="https://www.iptvnord4k.com/" className="underline">Contacto y soporte</a></div></footer> : <Footer />}
          {!isTvCheckout && <CookieConsent />}
        </div>
      </CartProvider>
    </QueryClientProvider>
  );
}
