import { json } from '@tanstack/react-start';
import { supabaseServer } from '@/integrations/supabase/client.server';

/**
 * Admin endpoint to fetch orders
 */
export async function GET({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');
    const apiKey = request.headers.get('x-admin-key');
    const expectedKey = process.env.ADMIN_API_KEY;

    // Basic auth check
    if (expectedKey && apiKey !== expectedKey) {
      return json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (email) {
      // Fetch orders for specific email
      const result = await supabaseServer()
        .from('stripe_orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (result.error) {
        return json(
          { error: result.error.message },
          { status: 500 }
        );
      }

      return json({
        email,
        count: result.data?.length || 0,
        orders: result.data,
      });
    }

    // Fetch all recent orders
    const result = await supabaseServer()
      .from('stripe_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (result.error) {
      return json(
        { error: result.error.message },
        { status: 500 }
      );
    }

    return json({
      count: result.data?.length || 0,
      orders: result.data,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    return json(
      {
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
