import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

// Handle checkout API endpoint before routing
async function handleCheckoutApi(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  
  // Only handle /api/redirect-checkout
  if (!url.pathname.startsWith("/api/redirect-checkout")) {
    return null;
  }

  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  // Only handle POST requests
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  try {
    const body = await request.json();
    const { price, productSlug, customerEmail, origin } = body;
    const extraScreens = body.extraScreens ?? 0;
    if (!Number.isInteger(extraScreens) || extraScreens < 0 || extraScreens > 5 || (extraScreens > 0 && !productSlug)) {
      return new Response(JSON.stringify({ error: "Número de pantallas no válido" }), {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      });
    }

    // Validate inputs
    if (!price || typeof price !== "number") {
      return new Response(
        JSON.stringify({ error: "Price parameter is required and must be a number" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Import Stripe dynamically to avoid initialization errors
    const { stripe, createCheckoutSession, syncProductToStripe } = await import("@/lib/stripe.server");
    const { PRODUCTS, getProduct } = await import("@/lib/products");

    // Find product by price (convert from cents if needed)
    const priceInCents = Math.round(price);
    const product = productSlug
      ? getProduct(productSlug)
      : PRODUCTS.find((p) => Math.round(p.price * 100) === priceInCents);

    if (!product || (extraScreens > 0 && product.category !== "iptv") || Math.round(product.price * 100) + extraScreens * 2000 !== priceInCents) {
      return new Response(
        JSON.stringify({ error: `No product found for price: ${priceInCents}` }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Sync product to Stripe
    const syncedProduct = await syncProductToStripe(product);
    const additionalLineItems: { price: string; quantity: number }[] = [];
    if (extraScreens > 0) {
      const extra = await syncProductToStripe({ slug: "iptv-extra-screen", name: "Pantalla adicional IPTV", price: 20, short: "Una pantalla adicional durante el período del paquete contratado." });
      additionalLineItems.push({ price: extra.priceId, quantity: extraScreens });
    }

    // Create checkout session
    const baseUrl = origin || "https://iptv-clocking-00.vercel.app";
    const successUrl = `${url.origin}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}${baseUrl === url.origin ? "/shop" : "/"}`;

    const session = await createCheckoutSession({
      priceId: syncedProduct.priceId,
      successUrl,
      cancelUrl,
      customerEmail: customerEmail || undefined,
      additionalLineItems,
      metadata: { product_slug: product.slug, extra_screens: String(extraScreens) },
    });

    return new Response(
      JSON.stringify({
        success: true,
        sessionId: session.id,
        url: session.url,
        productSlug: product.slug,
        productName: product.name,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Checkout API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: `Failed to create checkout session: ${errorMessage}` }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      // The payment subdomain has a clear TV checkout entry. Existing PDF URLs remain intact.
      if (url.hostname === 'pay.iptvnord4k.com' && url.pathname === '/') {
        return Response.redirect('https://pay.iptvnord4k.com/tv', 302);
      }
      // Try to handle checkout API first
      const checkoutResponse = await handleCheckoutApi(request);
      if (checkoutResponse) {
        return checkoutResponse;
      }

      // Otherwise, pass to TanStack
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
