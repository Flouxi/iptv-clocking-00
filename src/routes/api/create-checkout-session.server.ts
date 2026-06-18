import { json } from '@tanstack/react-start';
import { stripe, createCheckoutSession, syncProductToStripe } from '@/lib/stripe.server';
import { getProduct } from '@/lib/products';
import { supabaseServer } from '@/integrations/supabase/client.server';

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json();
    const { productSlug, customerEmail, origin } = body;

    if (!productSlug) {
      return json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    // Get product from local database
    const product = getProduct(productSlug);
    if (!product) {
      return json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Sync product to Stripe if needed
    const syncedProduct = await syncProductToStripe(product);

    // Get the base URL for redirect
    const baseUrl = origin || 'https://ipnord4k.com';
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/product/${productSlug}`;

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
        product_slug: productSlug,
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
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
