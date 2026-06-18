import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { getProduct } from "./products";

interface CreateCheckoutInput {
  slug: string;
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
    return data;
  })
  .handler(async ({ data }) => {
    const product = getProduct(data.slug);
    if (!product) throw new Error("Product not found");

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey || stripeKey.includes("YOUR_STRIPE_SECRET_KEY")) {
      throw new Error(
        "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env file. Get it from: https://dashboard.stripe.com/apikeys"
      );
    }

    const host = getRequestHost();
    const proto = host.startsWith("localhost") ? "http" : "https";
    const origin = `${proto}://${host}`;

    // Stripe expects amounts in the smallest unit (öre for SEK).
    const amountOre = Math.round(product.price * 100);

    const form = new URLSearchParams();
    form.append("mode", "payment");
    form.append("success_url", `${origin}/success?session_id={CHECKOUT_SESSION_ID}`);
    form.append("cancel_url", `${origin}/product/${product.slug}`);
    form.append("payment_method_types[]", "card");
    form.append("payment_method_types[]", "klarna");
    form.append("locale", "sv");
    form.append("billing_address_collection", "auto");
    form.append("line_items[0][quantity]", "1");
    form.append("line_items[0][price_data][currency]", "sek");
    form.append("line_items[0][price_data][unit_amount]", String(amountOre));
    form.append("line_items[0][price_data][product_data][name]", product.name);
    form.append(
      "line_items[0][price_data][product_data][description]",
      product.short.slice(0, 250),
    );
    form.append("metadata[product_slug]", product.slug);

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
        amount_total: amountOre,
        currency: "sek",
        status: "pending",
      });
    } catch (err) {
      console.warn("Could not save order to database:", err);
      // Continue anyway - the webhook will handle it
    }

    return { url: session.url };
  });
