import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Only initialize Stripe if the key is present to avoid crashing during build or when Stripe is not needed
export const stripe = stripeSecretKey && !stripeSecretKey.includes("YOUR_STRIPE_SECRET_KEY")
  ? new Stripe(stripeSecretKey)
  : null;

if (!stripe && process.env.NODE_ENV === 'production') {
  console.warn('STRIPE_SECRET_KEY environment variable is not set. Stripe functionality will be unavailable.');
}

/**
 * Create or get a Stripe product for a given product slug
 */
export async function syncProductToStripe(product: {
  slug: string;
  name: string;
  price: number;
  description?: string;
  short?: string;
}) {
  if (!stripe) throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY.");
  try {
    // Search for existing product by metadata slug
    const products = await stripe.products.list({
      limit: 100,
    });

    const existingProduct = products.data.find(
      (p) => p.metadata?.slug === product.slug
    );

    let stripeProduct;

    if (existingProduct) {
      // Update existing product
      stripeProduct = await stripe.products.update(existingProduct.id, {
        name: product.name,
        description: product.short || product.description,
        metadata: {
          slug: product.slug,
        },
      });
    } else {
      // Create new product
      stripeProduct = await stripe.products.create({
        name: product.name,
        description: product.short || product.description,
        metadata: {
          slug: product.slug,
        },
      });
    }

    // Check if price already exists
    const prices = await stripe.prices.list({
      product: stripeProduct.id,
      active: true,
    });

    let stripePrice;

    if (prices.data.length > 0) {
      // Use existing price
      stripePrice = prices.data[0];
    } else {
      // Create new price (in cents)
      stripePrice = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: Math.round(product.price * 100),
        currency: 'sek',
        metadata: {
          slug: product.slug,
        },
      });
    }

    return {
      productId: stripeProduct.id,
      priceId: stripePrice.id,
      product: stripeProduct,
      price: stripePrice,
    };
  } catch (error) {
    console.error('Error syncing product to Stripe:', error);
    throw error;
  }
}

/**
 * Create a checkout session for a single product
 */
export async function createCheckoutSession({
  priceId,
  successUrl,
  cancelUrl,
  customerEmail,
}: {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}) {
  if (!stripe) throw new Error("Stripe is not configured. Please set STRIPE_SECRET_KEY.");
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'ideal', 'bancontact', 'giropay', 'eps', 'p24'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      locale: 'sv',
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string
): Stripe.Event | null {
  if (!stripe) return null;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Handle checkout.session.completed event
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  try {
    // Update order status in database, send confirmation email, etc.
    console.log('Checkout session completed:', {
      sessionId: session.id,
      customerId: session.customer,
      amount: session.amount_total,
      email: session.customer_email,
    });

    return {
      success: true,
      sessionId: session.id,
    };
  } catch (error) {
    console.error('Error handling checkout session:', error);
    throw error;
  }
}
