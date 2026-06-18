# Stripe Integration Setup Guide

This guide walks through the complete Stripe integration for all 13 products on the IPNORD4K website.

## Prerequisites

- Stripe account (https://dashboard.stripe.com)
- Access to Stripe API keys

## Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Copy your Secret Key and Publishable Key
3. If you don't have a webhook signing secret yet, you'll create it in Step 4

## Step 2: Update Environment Variables

Update the `.env` file with your Stripe credentials:

```env
# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_YOUR_SECRET_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
STRIPE_WEBHOOK_SECRET="whsec_YOUR_WEBHOOK_SECRET_HERE"
VITE_STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_PUBLISHABLE_KEY_HERE"
```

## Step 3: Set Up Database

Run the database migration to create the necessary tables:

```sql
-- This migration is in: supabase/migrations/20260618_stripe_integration.sql
-- It creates:
-- - stripe_products table (maps local products to Stripe resources)
-- - stripe_orders table (tracks completed orders)
```

Push the migration:
```bash
supabase db push
```

## Step 4: Set Up Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy the signing secret and add it to `.env` as `STRIPE_WEBHOOK_SECRET`

## Step 5: Initialize Products in Stripe

All 13 products will be automatically synced to Stripe when a customer initiates checkout. However, you can manually initialize them all at once using the admin endpoint.

Create a startup script or admin endpoint that calls:
```typescript
import { initializeStripeProducts } from '@/lib/stripe-sync.server';

await initializeStripeProducts();
```

## Products Being Synced

The following 13 products are configured for Stripe:

1. **Starter Business Planner** - 349 SEK
2. **Complete Social Media Content Calendar** - 699 SEK
3. **Small Business Starter Kit** - 1,049 SEK
4. **Freelancer Finance Pack** - 1,299 SEK
5. **Annual Goal & Project Planner** - 1,399 SEK
6. **Restaurant Business Forms Bundle** - 1,649 SEK
7. **Real Estate Client Forms Pack** - 1,749 SEK
8. **Complete HR Starter Kit** - 1,999 SEK
9. **E-commerce Business Toolkit** - 2,099 SEK
10. **Marketing Agency Client Pack** - 2,349 SEK
11. **Ultimate Entrepreneur Bundle** - 2,449 SEK
12. **Premium Brand Identity Workbook** - 2,699 SEK
13. **Full Business Launch Kit** - 3,049 SEK

## Architecture

### Files Created

#### Server-Side Files
- `src/lib/stripe.server.ts` - Stripe API integration
- `src/lib/stripe-sync.server.ts` - Product synchronization utilities
- `src/routes/api/create-checkout-session.server.ts` - Checkout session creation endpoint
- `src/routes/api/webhooks/stripe.server.ts` - Webhook handler
- `supabase/migrations/20260618_stripe_integration.sql` - Database schema

#### Client-Side Files
- `src/components/CheckoutButton.tsx` - Reusable checkout button component

### Database Tables

#### `stripe_products`
Stores mapping between local products and Stripe resources:
- `product_slug` (unique identifier)
- `stripe_product_id`
- `stripe_price_id`
- `product_name`
- `price_amount`
- `currency`
- Timestamps

#### `stripe_orders`
Tracks completed orders:
- `stripe_session_id`
- `stripe_customer_id`
- `product_slug`
- `amount_paid`
- `currency`
- `customer_email`
- `status` (pending, completed, failed, refunded)
- `metadata` (JSON for additional info)
- Timestamps

## API Endpoints

### POST /api/create-checkout-session
Creates a Stripe Checkout Session for a product.

**Request:**
```json
{
  "productSlug": "starter-business-planner",
  "customerEmail": "customer@example.com",
  "origin": "https://yourdomain.com"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

### POST /api/webhooks/stripe
Receives webhook events from Stripe.

**Handled Events:**
- `checkout.session.completed` - Order completed
- `payment_intent.succeeded` - Payment successful
- `payment_intent.payment_failed` - Payment failed
- `charge.refunded` - Refund processed

## Usage in Components

### Using the Checkout Button

```tsx
import { CheckoutButton } from '@/components/CheckoutButton';

export function ProductCard() {
  return (
    <CheckoutButton
      productSlug="starter-business-planner"
      productName="Starter Business Planner"
      className="w-full"
    >
      Buy Now
    </CheckoutButton>
  );
}
```

### Manual Checkout

```tsx
const handleCheckout = async (productSlug: string) => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productSlug,
      customerEmail: 'customer@example.com',
      origin: window.location.origin,
    }),
  });

  const data = await response.json();
  if (data.url) {
    window.location.href = data.url;
  }
};
```

## Testing

### Test Mode
Use Stripe's test cards to test payments:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Webhook Testing
Use Stripe CLI to test webhooks locally:
```bash
stripe listen --forward-to localhost:5173/api/webhooks/stripe
```

Then trigger test events:
```bash
stripe trigger payment_intent.succeeded
```

## Production Checklist

- [ ] Switch from test keys to live keys in `.env`
- [ ] Update webhook URL to production domain
- [ ] Update success/cancel URLs to production domain
- [ ] Test checkout flow end-to-end
- [ ] Verify webhook events are received
- [ ] Set up email notifications for orders
- [ ] Configure PDF delivery/download
- [ ] Set up monitoring and logging
- [ ] Test refund flow
- [ ] Review Stripe documentation for PCI compliance

## Troubleshooting

### Products not appearing in Stripe
- Run `initializeStripeProducts()` function
- Check `STRIPE_SECRET_KEY` is correctly set
- Verify Stripe account is in test mode (if using test keys)

### Webhook events not received
- Verify webhook URL is accessible
- Check webhook signing secret in `.env`
- Review Stripe Dashboard > Webhooks > Events for failed deliveries
- Ensure endpoint returns HTTP 200 status

### Checkout fails
- Check product slug matches exactly
- Verify Stripe price exists for product
- Check API keys have correct permissions
- Review browser console for errors

## Currency

All prices are configured in **SEK (Swedish Kronor)** as per your product list. If you need multi-currency support, update:
1. `createCheckoutSession()` in `stripe.server.ts`
2. Database migrations
3. Environment configuration

## Security Notes

- Never commit `.env` file with real API keys
- Always validate webhook signatures
- Use HTTPS for all endpoints
- Store sensitive data server-side only
- Implement rate limiting on checkout endpoint
- Log all payment-related events for audit trail

## Support

For issues or questions:
- Stripe Documentation: https://stripe.com/docs
- API Reference: https://stripe.com/docs/api
- Support: https://support.stripe.com
