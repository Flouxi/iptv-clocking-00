## Stripe Integration - Developer Quick Reference

### 🎯 Common Tasks

#### Add Checkout Button to a Component
```tsx
import { CheckoutButton } from '@/components/CheckoutButton';

export function MyComponent() {
  return (
    <CheckoutButton
      productSlug="starter-business-planner"
      productName="Starter Business Planner"
    >
      Buy Now
    </CheckoutButton>
  );
}
```

#### Get Product's Stripe Price ID
```typescript
import { getStripePriceId } from '@/lib/stripe-sync.server';

const priceId = await getStripePriceId('starter-business-planner');
```

#### Fetch Customer Orders
```typescript
import { getOrdersByEmail } from '@/lib/stripe-sync.server';

const orders = await getOrdersByEmail('customer@example.com');
```

#### Manual Checkout (Without Button)
```typescript
const handleCheckout = async () => {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      productSlug: 'starter-business-planner',
      customerEmail: 'customer@example.com',
      origin: window.location.origin,
    }),
  });

  const { url } = await response.json();
  window.location.href = url;
};
```

#### Verify Webhook (Server-Side)
```typescript
import { verifyWebhookSignature } from '@/lib/stripe.server';

const event = verifyWebhookSignature(body, signature);
if (event?.type === 'checkout.session.completed') {
  // Handle payment
}
```

---

### 📱 Using CheckoutButton

```tsx
<CheckoutButton
  productSlug="starter-business-planner"      // Required: Product slug from products.ts
  productName="Starter Business Planner"      // Required: Display name
  className="w-full"                          // Optional: CSS classes
>
  Buy Now                                     // Optional: Button text (default: "Buy Now")
</CheckoutButton>
```

**Features:**
- Asks for email before checkout
- Shows loading state during processing
- Displays errors if checkout fails
- Redirects to Stripe Checkout on success

---

### 🔄 Checkout Flow

1. **User clicks checkout button**
2. **Prompt for email**
3. **POST /api/create-checkout-session**
   - Product synced to Stripe if needed
   - Order saved to database
   - Checkout session created
4. **Redirect to Stripe Checkout**
5. **Customer pays**
6. **Webhook: checkout.session.completed**
   - Order status updated
   - Email sent (implement separately)
7. **Redirect to /success?session_id=...**

---

### 🗄️ Database Queries

#### Get all products synced to Stripe
```typescript
const { data } = await supabaseServer()
  .from('stripe_products')
  .select('*');
```

#### Get completed orders
```typescript
const { data } = await supabaseServer()
  .from('stripe_orders')
  .select('*')
  .eq('status', 'completed')
  .order('created_at', { ascending: false });
```

#### Get failed payments
```typescript
const { data } = await supabaseServer()
  .from('stripe_orders')
  .select('*')
  .eq('status', 'failed');
```

#### Check if customer bought a product
```typescript
const { data } = await supabaseServer()
  .from('stripe_orders')
  .select('*')
  .eq('customer_email', 'customer@example.com')
  .eq('product_slug', 'starter-business-planner')
  .eq('status', 'completed')
  .single();

const hasPurchased = !!data;
```

---

### 🔑 Environment Variables

```env
# Required for Stripe integration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# For admin endpoints
ADMIN_API_KEY=your_admin_key_here
```

---

### 🧪 Testing Checklist

- [ ] Checkout button appears on product pages
- [ ] Email input works
- [ ] Stripe Checkout loads
- [ ] Test card payment succeeds
- [ ] Order appears in database
- [ ] Webhook received (check Stripe Dashboard)
- [ ] /success page displays
- [ ] Admin order endpoint works
- [ ] Refund flow works

---

### 📊 Useful Stripe Dashboard Links

- [API Keys](https://dashboard.stripe.com/apikeys)
- [Webhooks](https://dashboard.stripe.com/webhooks)
- [Products](https://dashboard.stripe.com/products)
- [Customers](https://dashboard.stripe.com/customers)
- [Payments](https://dashboard.stripe.com/payments)
- [Logs](https://dashboard.stripe.com/logs)

---

### 🐛 Common Issues

**Issue: "Missing Stripe signature"**
- Check webhook endpoint is being called
- Verify `stripe-signature` header is sent
- Check `STRIPE_WEBHOOK_SECRET` in `.env`

**Issue: "Unauthorized" on admin endpoints**
- Verify `x-admin-key` header matches `ADMIN_API_KEY`
- Check `.env` has `ADMIN_API_KEY` set

**Issue: Product doesn't sync to Stripe**
- Check `STRIPE_SECRET_KEY` is correct
- Verify product slug exists in `PRODUCTS` array
- Check Stripe API rate limits not exceeded

**Issue: Checkout redirects to wrong URL**
- Check `success_url` and `cancel_url` in checkout session
- Verify `origin` parameter is passed correctly

---

### 🚀 Production Checklist

Before going live:
- [ ] Switch to live Stripe keys
- [ ] Update webhook URLs to production domain
- [ ] Set secure `ADMIN_API_KEY`
- [ ] Enable HTTPS everywhere
- [ ] Set up email notifications
- [ ] Implement PDF downloads
- [ ] Test full checkout flow
- [ ] Set up monitoring and alerts
- [ ] Review security settings
- [ ] Backup Supabase database
- [ ] Set up logging for all payment events
- [ ] Test refund process
- [ ] Configure CORS for production domain

---

### 📞 Support

- 📖 Read: [STRIPE_INTEGRATION.md](./STRIPE_INTEGRATION.md)
- 📋 Reference: [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- 🔍 API Docs: [stripe.com/docs/api](https://stripe.com/docs/api)

---

Last Updated: 2026-06-18
