# 🔑 Get Your Stripe API Keys - Step by Step

## ✅ Step 1: Sign In to Stripe Dashboard

Go to: https://dashboard.stripe.com/

Sign in with your Stripe account.

## ✅ Step 2: Navigate to API Keys

1. Click on **Developers** in the left sidebar
2. Click on **API Keys**
3. Make sure you're viewing **Test Mode** (not Live Mode)

You should see two keys:
- **Publishable key** - starts with `pk_test_`
- **Secret key** - starts with `sk_test_`

## ✅ Step 3: Copy Your Keys

1. Find the **Secret key** and click "Reveal test key"
2. Copy the entire secret key (starts with `sk_test_`)
3. Copy the **Publishable key**

## ✅ Step 4: Update Your .env File

Open `.env` in your project and replace:

```env
STRIPE_SECRET_KEY="sk_test_..." 
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

With your actual keys:

```env
STRIPE_SECRET_KEY="sk_test_51ABC123XYZ..."
STRIPE_PUBLISHABLE_KEY="pk_test_51ABC123XYZ..."
```

## ✅ Step 5: Get Supabase Service Role Key

This is also needed for the checkout to work properly.

1. Go to: https://supabase.com/dashboard
2. Click on your project: **jqtzsomsejifcilxrkyg**
3. Click **Settings** (bottom left)
4. Click **API**
5. Look for **Service Role Secret** (the longer key)
6. Click to reveal and copy it

Then update `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## ✅ Step 6: Set Up Webhook (Optional but Recommended)

For order notifications:

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
   - For local testing: `http://localhost:5173/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `charge.refunded`
5. Copy the **Signing secret** and add to `.env`:

```env
STRIPE_WEBHOOK_SECRET="whsec_1ABC123..."
```

## ✅ Step 7: Restart Your Development Server

After updating `.env`, restart your dev server:

```bash
npm run dev
```

## ✅ Step 8: Test the Checkout

1. Go to any product page
2. Click "Köp nu & Ladda ner" (Buy Now & Download)
3. Enter any email
4. Use test card: **4242 4242 4242 4242**
5. Use any future date and any 3-digit CVC
6. You should be redirected to success page

## 🆘 If It Still Doesn't Work

Check the browser console (F12) for error messages. Common issues:

**"Stripe is not configured"**
- ✅ Verify `.env` has real keys (not the placeholder text)
- ✅ Restart dev server after changing `.env`

**"Invalid Stripe API key"**
- ✅ Make sure you copied the **Secret key**, not the Publishable key
- ✅ Make sure it starts with `sk_test_` or `sk_live_`

**"Could not save order to database"**
- ✅ Check that `SUPABASE_SERVICE_ROLE_KEY` is set in `.env`
- ✅ This shouldn't prevent checkout, but it's needed for order tracking

## 🧪 Test Cards for Stripe

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

For any date (future) and any 3-digit CVC.

## 📚 Links

- Stripe Dashboard: https://dashboard.stripe.com
- Stripe API Keys: https://dashboard.stripe.com/apikeys
- Stripe Webhooks: https://dashboard.stripe.com/webhooks
- Supabase Dashboard: https://supabase.com/dashboard
