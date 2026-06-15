import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Download, Loader2, AlertTriangle } from "lucide-react";
import { fetchOrderBySession } from "@/lib/orders.functions";
import { formatPrice } from "@/lib/products";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/success")({
  validateSearch: (s: Record<string, unknown>) => ({
    session_id: typeof s.session_id === "string" ? s.session_id : undefined,
  }),
  head: () => ({ meta: [{ title: "Tack för ditt köp — IPNORD4K" }] }),
  component: SuccessPage,
});

interface Order {
  id: string;
  product_slug: string;
  product_name: string;
  amount_total: number;
  currency: string;
  status: string;
  customer_email: string | null;
  download_token: string;
}

function SuccessPage() {
  const { session_id } = Route.useSearch();
  const { clear } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session_id) {
      setError("Saknar sessionsinformation.");
      setLoading(false);
      return;
    }
    fetchOrderBySession({ data: { sessionId: session_id } })
      .then((res) => {
        setOrder(res.order as Order | null);
        setPaid(res.paid);
        clear();
      })
      .catch((e) => setError(e?.message ?? "Något gick fel"))
      .finally(() => setLoading(false));
  }, [session_id]);

  if (loading) {
    return (
      <div className="container-page py-24 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Bekräftar din betalning…</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-10 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Något gick fel</h1>
          <p className="mt-2 text-muted-foreground">
            {error ?? "Vi kunde inte hitta din order."}
          </p>
          <Link to="/contact" className="mt-6 inline-block text-primary hover:underline">
            Kontakta support →
          </Link>
        </div>
      </div>
    );
  }

  const orderNumber = order.id.slice(0, 8).toUpperCase();

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 sm:p-12">
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success/10">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h1 className="mt-5 text-3xl font-bold sm:text-4xl">Tack för ditt köp!</h1>
          <p className="mt-3 text-muted-foreground">
            Din betalning är bekräftad. En kopia av kvittot och nedladdningslänken har skickats till{" "}
            <span className="font-semibold text-foreground">
              {order.customer_email ?? "din e-postadress"}
            </span>
            .
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border bg-background p-5">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Ordernummer</dt>
              <dd className="font-mono font-semibold">#{orderNumber}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-semibold text-success">
                {paid ? "Betald" : order.status}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">Produkt</dt>
              <dd className="font-semibold">{order.product_name}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Belopp</dt>
              <dd className="font-semibold">{formatPrice(order.amount_total / 100)}</dd>
            </div>
          </dl>
        </div>

        <a
          href={`/api/public/download/${order.download_token}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-base font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Download className="h-5 w-5" /> Ladda ner din PDF
        </a>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Din nedladdningslänk är aktiv direkt och giltig i 30 dagar.
        </p>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/shop"
            className="rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:bg-accent"
          >
            Fortsätt handla
          </Link>
          <Link
            to="/"
            className="rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-navy-foreground hover:opacity-90"
          >
            Till startsidan
          </Link>
        </div>
      </div>
    </div>
  );
}
