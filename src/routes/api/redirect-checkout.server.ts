import { json } from '@tanstack/react-start';
import { stripe, createCheckoutSession, syncProductToStripe } from '@/lib/stripe.server';
import { PRODUCTS } from '@/lib/products';
import { supabaseServer } from '@/integrations/supabase/client.server';

/**
 * Privacy-Preserving Checkout Redirect Endpoint
 * 
 * This endpoint accepts only a price and optional email, finds the matching product,
 * and redirects to Stripe checkout without exposing the referral source.
 * 
 * This allows external sites to send users to checkout without revealing their origin,
 * keeping both sites completely independent for privacy reasons.
 */
export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { price, customerEmail, origin } = body;

    // Validate price parameter
    if (!price || typeof price !== 'number') {
      return json(
        { error: 'Price parameter is required and must be a number' },
        { status: 400 }
      );
    }

    // Find product by exact price match
    const product = PRODUCTS.find((p) => p.price === price);
    if (!product) {
      return json(
        { error: `No product found for price: ${price} kr` },
        { status: 404 }
      );
    }

    // Sync product to Stripe if needed
    const syncedProduct = await syncProductToStripe(product);

    // Use provided origin or default to iptv-clocking-00
    const baseUrl = origin || 'https://iptv-clocking-00.vercel.app';
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/shop`;

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      priceId: syncedProduct.priceId,
      successUrl,
      cancelUrl,
      customerEmail,
    });

    // Store the Stripe product mapping in database
    await supabaseServer()
      .from('stripe_products')
      .upsert({
        product_slug: product.slug,
        stripe_product_id: syncedProduct.productId,
        stripe_price_id: syncedProduct.priceId,
        product_name: product.name,
        price_amount: product.price,
        currency: 'sek',
      }, {
        onConflict: 'product_slug',
      });

    return json({
      success: true,
      sessionId: session.id,
      url: session.url,
      productSlug: product.slug,
      productName: product.name,
    });
  } catch (error) {
    console.error('Redirect checkout error:', error);
    return json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
