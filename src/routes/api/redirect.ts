import { stripe, createCheckoutSession, syncProductToStripe } from '@/lib/stripe.server';
import { supabaseServer } from '@/integrations/supabase/client.server';

/**
 * Stealth Redirect API with Referrer Cloaking
 * 
 * Takes a 'plan' parameter (e.g., '3m-1s'), finds the matching Stripe price,
 * and performs a stealth redirect to Stripe Checkout with no-referrer policy
 * and fake referrer rotation.
 */
export async function GET({ request }: { request: Request }) {
  const url = new URL(request.url);
  const planKey = url.searchParams.get('plan');

  if (!planKey) {
    return new Response('Plan parameter is required', { status: 400 });
  }

  try {
    // 1. Get plan details from Supabase
    const { data: plan, error } = await supabaseServer()
      .from('iptv_plans')
      .select('*')
      .eq('plan_key', planKey)
      .single();

    if (error || !plan) {
      console.error('Plan not found:', planKey, error);
      return new Response('Plan not found', { status: 404 });
    }

    // 2. Determine Stripe Price ID
    let stripePriceId = plan.stripe_price_id;

    if (!stripePriceId) {
      // If no pre-configured price ID, we sync it on the fly
      const synced = await syncProductToStripe({
        slug: plan.plan_key,
        name: plan.display_name,
        price: plan.price_amount,
        short: `IPTV Plan: ${plan.display_name}`
      });
      stripePriceId = synced.priceId;
      
      // Update the DB with the new price ID for future use
      await supabaseServer()
        .from('iptv_plans')
        .update({ stripe_price_id: stripePriceId })
        .eq('id', plan.id);
    }

    // 3. Create Stripe Checkout Session
    const successUrl = 'https://iptvnord4k.com/success';
    const cancelUrl = 'https://iptvnord4k.com/#bestall';

    const session = await createCheckoutSession({
      priceId: stripePriceId,
      successUrl,
      cancelUrl,
    });

    if (!session.url) {
      throw new Error('Failed to generate Stripe Checkout URL');
    }

    // 4. Stealth Redirect Implementation
    const checkoutUrl = session.url;
    
    // HTML for stealth redirect
    const delay = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="refresh" content="${delay/1000};url=${checkoutUrl}">
  <title>Redirecting to Secure Checkout...</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f9fafb; color: #374151; }
    .loader { border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin-bottom: 16px; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .container { text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="loader"></div>
    <p>Säker anslutning upprättas...</p>
  </div>
  <script>
    setTimeout(function() {
      window.location.href = "${checkoutUrl}";
    }, ${delay});
  </script>
</body>
</html>
`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Referrer-Policy': 'no-referrer',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });

  } catch (error) {
    console.error('Stealth redirect error:', error);
    return new Response('An error occurred during redirect', { status: 500 });
  }
}
