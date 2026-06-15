import { createServerFn } from "@tanstack/react-start";

interface FetchOrderInput {
  sessionId: string;
}

/**
 * Called by the /success page after Stripe redirects.
 * Verifies the session with Stripe, marks the order as paid, and returns it.
 */
export const fetchOrderBySession = createServerFn({ method: "POST" })
  .inputValidator((data: FetchOrderInput) => {
    if (!data?.sessionId || typeof data.sessionId !== "string") {
      throw new Error("Missing session id");
    }
    return data;
  })
  .handler(async ({ data }) => {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) throw new Error("Stripe is not configured");

    const res = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(data.sessionId)}`,
      { headers: { Authorization: `Bearer ${stripeKey}` } },
    );
    if (!res.ok) throw new Error("Could not verify payment");
    const session = (await res.json()) as {
      id: string;
      payment_status: string;
      customer_details?: { email?: string };
      amount_total?: number;
    };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (session.payment_status === "paid") {
      await supabaseAdmin
        .from("orders")
        .update({
          status: "paid",
          customer_email: session.customer_details?.email ?? null,
          amount_total: session.amount_total ?? undefined,
        })
        .eq("stripe_session_id", session.id);
    }

    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, product_slug, product_name, amount_total, currency, status, customer_email, download_token, created_at")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    return { order, paid: session.payment_status === "paid" };
  });
