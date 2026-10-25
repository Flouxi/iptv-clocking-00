import { createServerFn } from '@tanstack/react-start';
// Stripe remains authoritative even when the optional order database is unavailable.
export const fetchOrderBySession = createServerFn({method:'POST'})
  .inputValidator((data:{sessionId:string}) => {
    if (!/^cs_(live|test)_[A-Za-z0-9]{20,200}$/.test(data?.sessionId || '')) throw new Error('Sesión no válida.');
    return {sessionId:data.sessionId};
  })
  .handler(async ({data}) => {
    const { verifiedPdfOrder, issueDownload, downloadSecret, DownloadDenied } = await import('./pdf-access.server');
    try {
      const {file,files,expires,session} = await verifiedPdfOrder(data.sessionId);
      // Preserve the existing optional order ledger; its availability does not grant access.
      if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        try {
          const {supabaseAdmin} = await import('@/integrations/supabase/client.server');
          await supabaseAdmin.from('orders').update({status:'paid',amount_total:session.amount_total,
            customer_email:session.customer_details?.email ?? null}).eq('stripe_session_id',session.id);
        } catch { /* Stripe remains the payment authority if the optional ledger is unavailable. */ }
      }
      return {paid:true,order:{id:session.id.replace(/^cs_(live|test)_/,''),product_slug:file.slug,product_name:files.map(f => f.title).join(', '),
        amount_total:session.amount_total,currency:session.currency,status:'paid',
        download_token:issueDownload(session.id,expires,downloadSecret()),customer_email:null,
        files:files.map(f => ({slug:f.slug,title:f.title}))}};
    } catch(error) {
      if(error instanceof DownloadDenied) return {paid:false,order:null};
      throw new Error('No se pudo verificar el pago. Inténtalo de nuevo o contacta con soporte.');
    }
  });
