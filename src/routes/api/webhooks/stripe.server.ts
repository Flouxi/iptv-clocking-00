import { json } from '@tanstack/react-start';
import { verifyWebhookSignature, handleCheckoutSessionCompleted, stripe } from '@/lib/stripe.server';
import { supabaseServer } from '@/integrations/supabase/client.server';
import Stripe from 'stripe';

export async function POST({ request }: { request: Request }) {
  // Get the signature from headers
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  // Get the raw body for signature verification
  const body = await request.text();

  // Verify webhook signature
  const event = verifyWebhookSignature(body, signature);

  if (!event) {
    return json(
      { error: 'Invalid webhook signature' },
      { status: 401 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get full session details
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ['line_items'],
        });

        // Handle the completed checkout
        await handleCheckoutSessionCompleted(fullSession);

        // Get product slug from line items
        const lineItem = (fullSession.line_items?.data || [])[0];
        let productSlug = 'unknown';

        if (lineItem?.price?.metadata?.slug) {
          productSlug = lineItem.price.metadata.slug;
        }

        // Store order in database
        await supabaseServer()
          .from('stripe_orders')
          .insert({
            stripe_session_id: session.id,
            stripe_customer_id: session.customer || null,
            product_slug: productSlug,
            amount_paid: session.amount_total || 0,
            currency: session.currency || 'sek',
            customer_email: session.customer_email || null,
            status: 'completed',
            completed_at: new Date().toISOString(),
            metadata: {
              payment_intent: session.payment_intent,
              payment_status: session.payment_status,
            },
          });

        console.log(`Order recorded for session ${session.id}`);
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment succeeded: ${paymentIntent.id}`);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`Payment failed: ${paymentIntent.id}`);
        
        // Update order status
        await supabaseServer()
          .from('stripe_orders')
          .update({ status: 'failed' })
          .eq('stripe_session_id', paymentIntent.id);
        
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge refunded: ${charge.id}`);
        
        // Update order status
        const result = await supabaseServer()
          .from('stripe_orders')
          .select('id')
          .eq('stripe_session_id', charge.payment_intent as string)
          .single();

        if (result.data) {
          await supabaseServer()
            .from('stripe_orders')
            .update({ status: 'refunded' })
            .eq('id', result.data.id);
        }
        
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
