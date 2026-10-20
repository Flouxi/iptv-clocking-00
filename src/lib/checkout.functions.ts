import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { getProduct } from "./products";

interface CreateCheckoutInput {
  slug: string;
  orbitraClickId?: string;
}

/**
 * Creates a Stripe Checkout Session for a single PDF product.
 * Returns the hosted checkout URL.
 *
 * Uses the Stripe REST API directly (Cloudflare Workers / TanStack server-fn safe).
 */
export const createCheckoutSession = createServerFn({ method: "POST" })
  .inputValidator((data: CreateCheckoutInput) => {
    if (!data?.slug || typeof data.slug !== "string") {
      throw new Error("Invalid product slug");
    }
    return { slug: data.slug, orbitraClickId: typeof data.orbitraClickId === 'string' && /^[0-9a-f]{48}$/.test(data.orbitraClickId) ? data.orbitraClickId : undefined };
  })
  .handler(async ({ data }) => {
    const product = getProduct(data.slug);
    if (!product) throw new Error("Product not found");

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes("YOUR_STRIPE_SECRET_KEY")) {
      // In a real production environment, this should be set in the deployment platform (e.g., Vercel)
      throw new Error(
        "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables. Get it from: https://dashboard.stripe.com/apikeys"
      );
    }

    const host = getRequestHost();
    const proto = host.startsWith("localhost") ? "http" : "https";
    const origin = `${proto}://${host}`;

    // Catalog prices are euros; Stripe stores integer euro cents.
    const amountCents = Math.round(product.price * 100);

    const form = new URLSearchParams();
    form.append("mode", "payment");
    form.append("success_url", `${origin}/success?session_id={CHECKOUT_SESSION_ID}`);
    form.append("cancel_url", `${origin}/product/${product.slug}`);
    form.append("locale", "es");
    form.append("billing_address_collection", "auto");
    form.append("line_items[0][quantity]", "1");
    const { syncProductToStripe } = await import("./stripe.server");
    const synced = await syncProductToStripe(product);
    form.append("line_items[0][price]", synced.priceId);
    form.append("metadata[product_slug]", product.slug);
    form.append("metadata[order_kind]", "pdf_download");
    form.append("metadata[source_site]", origin);
    if (data.orbitraClickId) form.append("metadata[orbitra_click_id]", data.orbitraClickId);

    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: form,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Stripe checkout error:", res.status, text);
      
      if (res.status === 401) {
        throw new Error("Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env");
      }
      
      throw new Error("Could not create checkout session. Please try again.");
    }

    const session = (await res.json()) as { id: string; url: string };

    // Try to create order record, but don't fail if supabase isn't configured
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("orders").insert({
        stripe_session_id: session.id,
        product_slug: product.slug,
        product_name: product.name,
        amount_total: amountCents,
        currency: "eur",
        status: "pending",
      });
    } catch (err) {
      console.warn("Could not save order to database:", err);
      // Continue anyway - the webhook will handle it
    }

    return { url: session.url };
  });
