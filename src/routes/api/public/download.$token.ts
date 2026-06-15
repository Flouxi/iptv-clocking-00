import { createFileRoute } from "@tanstack/react-router";

/**
 * Demo download endpoint. Verifies the order is paid, then streams a
 * placeholder PDF. In production you'd stream the real file from storage.
 */
export const Route = createFileRoute("/api/public/download/$token")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const token = params.token;
        if (!token || token.length < 16) {
          return new Response("Ogiltig länk", { status: 400 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: order } = await supabaseAdmin
          .from("orders")
          .select("product_name, status")
          .eq("download_token", token)
          .maybeSingle();

        if (!order) return new Response("Hittades inte", { status: 404 });
        if (order.status !== "paid") {
          return new Response("Betalning ej bekräftad", { status: 403 });
        }

        const pdf = buildPlaceholderPdf(order.product_name);
        const safeName = order.product_name.replace(/[^a-z0-9-_ ]/gi, "_");

        return new Response(pdf, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${safeName}.pdf"`,
            "Cache-Control": "private, no-store",
          },
        });
      },
    },
  },
});

function buildPlaceholderPdf(title: string): string {
  const safeTitle = title.replace(/[()\\]/g, "");
  const content = `BT /F1 24 Tf 72 720 Td (${safeTitle}) Tj 0 -40 Td /F1 12 Tf (IPNORD4K - PDF placeholder. Production version replaces this with the real product file.) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((obj, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${off.toString().padStart(10, "0")} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}
