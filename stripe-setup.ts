#!/usr/bin/env node

/**
 * Stripe Integration Setup Script
 * Run this after setting up your .env file with Stripe credentials
 * 
 * Usage: npx tsx stripe-setup.ts
 */

import { initializeStripeProducts } from './src/lib/stripe-sync.server';

async function main() {
  console.log('🚀 Starting Stripe Integration Setup...\n');

  // Check environment variables
  console.log('📋 Checking environment variables...');
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
  ];

  const missingVars = requiredVars.filter(
    (v) => !process.env[v]
  );

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:');
    missingVars.forEach((v) => console.error(`   - ${v}`));
    console.error('\nℹ️  Please update your .env file with Stripe credentials from:');
    console.error('   https://dashboard.stripe.com/apikeys\n');
    process.exit(1);
  }

  console.log('✅ Environment variables configured\n');

  // Initialize products
  console.log('📦 Syncing 13 products to Stripe...\n');

  try {
    const results = await initializeStripeProducts();

    console.log('\n✨ Setup complete!\n');
    console.log('Summary:');
    console.log(`  - Total products: 13`);
    console.log(
      `  - Successfully synced: ${
        results.filter((r) => r.status === 'success').length
      }`
    );
    console.log(
      `  - Failed: ${results.filter((r) => r.status === 'failed').length}`
    );

    if (results.some((r) => r.status === 'failed')) {
      console.log('\n⚠️  Some products failed to sync. Details:');
      results
        .filter((r) => r.status === 'failed')
        .forEach((r) => {
          console.log(`  - ${r.slug}: ${r.error}`);
        });
    }

    console.log('\n📋 Next steps:');
    console.log('  1. Set up webhook at: https://dashboard.stripe.com/webhooks');
    console.log('     Endpoint URL: https://yourdomain.com/api/webhooks/stripe');
    console.log('     Events: checkout.session.completed, payment_intent.*');
    console.log('  2. Add STRIPE_WEBHOOK_SECRET to .env');
    console.log('  3. Test checkout flow on your site');
    console.log('  4. Deploy to production when ready\n');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

main();
