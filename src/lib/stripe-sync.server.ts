import { syncProductToStripe } from '@/lib/stripe.server';
import { PRODUCTS } from '@/lib/products';
import { supabaseServer } from '@/integrations/supabase/client.server';

/**
 * Initialize all products in Stripe
 * This should be run once during setup or when adding new products
 */
export async function initializeStripeProducts() {
  console.log(`Syncing ${PRODUCTS.length} products to Stripe...`);

  const results = [];

  for (const product of PRODUCTS) {
    try {
      console.log(`Syncing ${product.name}...`);

      const syncedProduct = await syncProductToStripe({
        slug: product.slug,
        name: product.name,
        price: product.price,
        description: product.description,
        short: product.short,
      });

      // Store in database
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

      results.push({
        slug: product.slug,
        status: 'success',
        stripeProductId: syncedProduct.productId,
        stripePriceId: syncedProduct.priceId,
      });

      console.log(`✓ ${product.name} synced`);
    } catch (error) {
      console.error(`✗ Failed to sync ${product.name}:`, error);
      results.push({
        slug: product.slug,
        status: 'failed',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  console.log('\n=== Sync Summary ===');
  console.log(`Total: ${PRODUCTS.length}`);
  console.log(`Successful: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);

  return results;
}

/**
 * Get Stripe price ID for a product
 */
export async function getStripePriceId(productSlug: string) {
  const result = await supabaseServer()
    .from('stripe_products')
    .select('stripe_price_id')
    .eq('product_slug', productSlug)
    .single();

  if (result.error || !result.data) {
    throw new Error(`Stripe price not found for product: ${productSlug}`);
  }

  return result.data.stripe_price_id;
}

/**
 * Get order information by email
 */
export async function getOrdersByEmail(email: string) {
  const result = await supabaseServer()
    .from('stripe_orders')
    .select('*')
    .eq('customer_email', email)
    .order('created_at', { ascending: false });

  if (result.error) {
    throw new Error(`Failed to fetch orders: ${result.error.message}`);
  }

  return result.data || [];
}

/**
 * Get all Stripe products from database
 */
export async function getAllStripeProducts() {
  const result = await supabaseServer()
    .from('stripe_products')
    .select('*')
    .order('created_at', { ascending: true });

  if (result.error) {
    throw new Error(`Failed to fetch Stripe products: ${result.error.message}`);
  }

  return result.data || [];
}
