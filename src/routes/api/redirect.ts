import { stripe, createCheckoutSession } from '@/lib/stripe.server';
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
      // If no pre-configured price ID, we can create one or look it up in Stripe
      // For now, we assume prices are synced or pre-configured in the DB
      // Alternatively, we can use a default product and create a price on the fly
      // But for production, pre-configured is better.
      return new Response('Stripe Price ID not configured for this plan', { status: 500 });
    }

    // 3. Create Stripe Checkout Session
    const baseUrl = 'https://iptv-clocking-00.vercel.app';
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
    
    // Fake referrers for rotation
    const referrers = [
      'https://www.facebook.com/',
      'https://www.instagram.com/',
      'https://www.google.com/',
      'https://t.co/', // Twitter
      'https://www.youtube.com/',
      'direct'
    ];
    const randomReferrer = referrers[Math.floor(Math.random() * referrers.length)];

    // HTML for stealth redirect
    // Includes:
    // - Referrer-Policy: no-referrer
    // - Meta refresh for backup
    // - JavaScript window.location for primary
    // - Random delay (300-800ms)
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
    // Referrer cloaking: use a fake referrer if possible or just strip it
    // Most modern browsers respect the meta tag, but JS adds an extra layer
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
