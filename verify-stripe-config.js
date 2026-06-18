#!/usr/bin/env node

/**
 * Stripe Integration Verification Script
 * Checks if your Stripe configuration is correct
 */

console.log('\n🔍 Stripe Integration Verification\n');
console.log('Checking your configuration...\n');

const checks = [
  {
    name: 'STRIPE_SECRET_KEY',
    env: process.env.STRIPE_SECRET_KEY,
    required: true,
    validate: (val) => val && !val.includes('YOUR_STRIPE_SECRET_KEY') && val.startsWith('sk_'),
    hint: 'Should start with "sk_" and NOT contain "YOUR_STRIPE_SECRET_KEY". Get it from https://dashboard.stripe.com/apikeys',
  },
  {
    name: 'STRIPE_PUBLISHABLE_KEY',
    env: process.env.STRIPE_PUBLISHABLE_KEY,
    required: true,
    validate: (val) => val && !val.includes('YOUR_STRIPE_PUBLISHABLE_KEY') && val.startsWith('pk_'),
    hint: 'Should start with "pk_" and NOT contain "YOUR_STRIPE_PUBLISHABLE_KEY"',
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    env: process.env.SUPABASE_SERVICE_ROLE_KEY,
    required: true,
    validate: (val) => val && !val.includes('YOUR_SERVICE_ROLE_KEY') && val.length > 50,
    hint: 'Should be a long JWT token. Get it from https://supabase.com/dashboard > Settings > API',
  },
  {
    name: 'SUPABASE_URL',
    env: process.env.SUPABASE_URL,
    required: true,
    validate: (val) => val && val.startsWith('https://'),
    hint: 'Should start with "https://"',
  },
  {
    name: 'STRIPE_WEBHOOK_SECRET',
    env: process.env.STRIPE_WEBHOOK_SECRET,
    required: false,
    validate: (val) => !val || (!val.includes('YOUR_STRIPE_WEBHOOK_SECRET') && val.startsWith('whsec_')),
    hint: 'Optional but recommended. Should start with "whsec_"',
  },
];

let allValid = true;

checks.forEach((check) => {
  const isSet = !!check.env;
  const isValid = isSet && check.validate(check.env);
  const status = isValid ? '✅' : check.required ? '❌' : '⚠️';

  console.log(`${status} ${check.name}`);

  if (!isSet) {
    console.log(`   NOT SET${check.required ? ' (REQUIRED)' : ' (optional)'}`);
    if (check.required) allValid = false;
  } else if (!isValid) {
    console.log(`   INVALID VALUE`);
    if (check.required) allValid = false;
  }

  console.log(`   ℹ️  ${check.hint}`);
  console.log('');
});

if (allValid) {
  console.log('✨ All required configuration is set!\n');
  console.log('You can now:');
  console.log('  1. Start your dev server: npm run dev');
  console.log('  2. Go to a product page');
  console.log('  3. Click "Köp nu & Ladda ner"');
  console.log('  4. Test with card: 4242 4242 4242 4242\n');
} else {
  console.log('❌ Missing or invalid configuration\n');
  console.log('Follow these steps:');
  console.log('  1. Read GET_STRIPE_KEYS.md');
  console.log('  2. Get your API keys from Stripe and Supabase');
  console.log('  3. Update .env file');
  console.log('  4. Run this script again to verify\n');
  process.exit(1);
}
