import { json } from '@tanstack/react-start';
import { initializeStripeProducts } from '@/lib/stripe-sync.server';

/**
 * Admin endpoint to sync all products to Stripe
 * Protected by simple API key for now - should be enhanced with proper auth
 */
export async function POST({ request }: { request: Request }) {
  try {
    // Get API key from header
    const apiKey = request.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_API_KEY;

    // For now, allow if ADMIN_API_KEY is not set (development)
    // In production, this should always be set
    if (expectedKey && apiKey !== expectedKey) {
      return json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const results = await initializeStripeProducts();

    return json({
      success: true,
      message: 'Products synced to Stripe',
      results,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return json(
      {
        error: 'Failed to sync products',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
