# 🆘 Stripe Checkout Not Working - Troubleshooting Guide

## 🔴 Problem: "Köp nu & Ladda ner" button doesn't direct to Stripe

If clicking the buy button doesn't redirect you to Stripe checkout, follow this guide.

## ✅ Quick Checklist

- [ ] Do you have a Stripe account? (https://stripe.com)
- [ ] Do you have a Supabase account? (Already set up at https://supabase.com/dashboard)
- [ ] Have you read `GET_STRIPE_KEYS.md`?

## 🔧 Step-by-Step Fix

### Step 1: Verify Your Configuration

Run this command to check if everything is configured:

```bash
node verify-stripe-config.js
```

This will tell you exactly what's missing.

### Step 2: Get Your Stripe API Keys

1. Go to https://dashboard.stripe.com/apikeys
2. Make sure you're in **Test Mode** (toggle at top)
3. Copy your **Secret Key** (starts with `sk_test_`)
4. Copy your **Publishable Key** (starts with `pk_test_`)
5. Update `.env`:

```env
STRIPE_SECRET_KEY="sk_test_YOUR_ACTUAL_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_YOUR_ACTUAL_KEY_HERE"
```

### Step 3: Get Your Supabase Service Role Key

1. Go to https://supabase.com/dashboard
2. Click your project: **jqtzsomsejifcilxrkyg**
3. Click **Settings** (bottom left)
4. Click **API**
5. Copy the **Service Role Secret** (NOT the anon key)
6. Update `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Step 4: Restart Your Dev Server

After updating `.env`, restart:

```bash
npm run dev
```

### Step 5: Test

1. Open http://localhost:5173
2. Go to any product page
3. Click "Köp nu & Ladda ner"
4. You should now see an email input
5. Enter any email and click "Checkout"
6. You should be redirected to Stripe Checkout

## 🐛 Common Errors

### Error: "Stripe is not configured"

**Cause**: `STRIPE_SECRET_KEY` is missing or still has the placeholder text.

**Fix**:
```bash
# Check what's in your .env
grep STRIPE_SECRET_KEY .env

# It should show something like:
# STRIPE_SECRET_KEY=sk_test_51ABC123...
# NOT: STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE
```

### Error: "Invalid Stripe API key"

**Cause**: The key is wrong or doesn't have permission.

**Fix**:
1. Make sure you're using the **Secret Key**, not the Publishable Key
2. Make sure it starts with `sk_test_` (for test mode)
3. Go to https://dashboard.stripe.com/apikeys and copy it again
4. Update `.env` and restart dev server

### Error: "Could not save order to database"

**Cause**: `SUPABASE_SERVICE_ROLE_KEY` is missing or invalid.

**Fix**:
```bash
# Check if it's set
grep SUPABASE_SERVICE_ROLE_KEY .env

# Should show a long JWT token, not the placeholder
```

**Important**: This error won't prevent checkout - it just won't save the order to your database.

### Error: Nothing happens when I click the button

**Cause**: Multiple possible reasons.

**Debug steps**:
1. Open your browser's Developer Console (Press F12)
2. Click the "Köp nu & Ladda ner" button
3. Look for error messages in the console
4. Run `node verify-stripe-config.js` to check config

## 📋 Verification Checklist

Your `.env` file should have these set (replace `YOUR_` placeholders):

```env
# Required for Stripe
STRIPE_SECRET_KEY="sk_test_ACTUAL_KEY_HERE"
STRIPE_PUBLISHABLE_KEY="pk_test_ACTUAL_KEY_HERE"

# Required for database
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi...ACTUAL_TOKEN_HERE"
SUPABASE_URL="https://jqtzsomsejifcilxrkyg.supabase.co"

# Optional but recommended
STRIPE_WEBHOOK_SECRET="whsec_ACTUAL_SECRET_HERE"
```

**None of these should contain the placeholder text like `YOUR_STRIPE_SECRET_KEY`**

## 🧪 Test After Setup

1. Go to any product page (e.g., http://localhost:5173/product/starter-business-planner)
2. Click the blue "Köp nu & Ladda ner" button
3. Enter test email: `test@example.com`
4. Click "Checkout"
5. You should be on Stripe Checkout page
6. Use test card: `4242 4242 4242 4242`
7. Use any future date (e.g., `12/25`)
8. Use any 3-digit CVC (e.g., `123`)
9. Click "Pay"
10. You should see a success message

## 🔗 Useful Links

- **Stripe Dashboard**: https://dashboard.stripe.com
- **Stripe API Keys**: https://dashboard.stripe.com/apikeys
- **Stripe Test Cards**: https://stripe.com/docs/testing#cards
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Full Setup Guide**: See `GET_STRIPE_KEYS.md`

## 💬 Still Not Working?

1. Run `node verify-stripe-config.js` and share the output
2. Check your browser console (F12) for error messages
3. Check Stripe Dashboard > Logs for API errors
4. Make sure you're in **Test Mode** on Stripe Dashboard

## ⚡ Quick Reference

| Problem | Solution |
|---------|----------|
| Nothing happens when clicking button | Check browser console (F12) for errors |
| "Stripe is not configured" | Update STRIPE_SECRET_KEY in .env |
| "Invalid Stripe API key" | Make sure you're using the Secret key (sk_), not Publishable (pk_) |
| Button says "Öppnar säker kassa..." forever | Check browser network tab (F12 > Network) for errors |
| Redirected to Stripe but can't pay | Check your Stripe account is set to Test Mode |
