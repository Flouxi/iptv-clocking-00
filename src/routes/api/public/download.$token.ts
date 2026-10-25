import { createFileRoute } from '@tanstack/react-router';
export const Route = createFileRoute('/api/public/download/$token')({
  server: { handlers: { GET: async ({ params, request }) => {
    const headers = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer' };
    const { readDownload, verifiedPdfOrder, downloadSecret, DownloadDenied } = await import('@/lib/pdf-access.server');
    try {
      let sessionId: string;
      if (params.token.startsWith('v1.')) sessionId = readDownload(params.token, downloadSecret());
      else {
        // Preserve legacy order links, but independently verify their payment.
        if (!/^[A-Za-z0-9_-]{16,160}$/.test(params.token) || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new DownloadDenied();
        const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
        const { data: order, error } = await supabaseAdmin.from('orders').select('stripe_session_id').eq('download_token',params.token).maybeSingle();
        if (error || !order?.stripe_session_id) throw new DownloadDenied();
        sessionId = order.stripe_session_id;
      }
      const order = await verifiedPdfOrder(sessionId);
      const requestedSlug = new URL(request.url).searchParams.get('product');
      const file = requestedSlug ? order.files.find(f => f.slug === requestedSlug) : order.files.length === 1 ? order.file : undefined;
      if (!file) throw new DownloadDenied();
      const { useStorage } = await import('nitro/storage');
      const bytes = await useStorage('assets:pdf-products').getItemRaw<Uint8Array>(file.slug + '.pdf');
      if (!bytes) return new Response('El archivo no está disponible. Contacta con soporte.',{status:503,headers});
      return new Response(new Uint8Array(bytes),{headers:{...headers,'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="${file.slug}.pdf"`}});
    } catch (error) {
      const denied = error instanceof DownloadDenied || (error as {statusCode?:number})?.statusCode === 404;
      return new Response(denied ? 'El enlace no es válido, ha caducado o el pago no permite esta descarga.' : 'No se pudo verificar la descarga. Inténtalo de nuevo.',{status:denied?403:503,headers});
    }
  } } },
});
