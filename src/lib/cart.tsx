import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { PRODUCTS, type Product } from "./products";

interface CartItem { slug: string; qty: number }
interface CartCtx {
  items: CartItem[];
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  detailed: { product: Product; qty: number; line: number }[];
}

const Ctx = createContext<CartCtx | null>(null);
const KEY = "ipnord4k_cart_v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const add = (slug: string, qty = 1) =>
    setItems((cur) => {
      const ex = cur.find((i) => i.slug === slug);
      if (ex) return cur.map((i) => i.slug === slug ? { ...i, qty: i.qty + qty } : i);
      return [...cur, { slug, qty }];
    });
  const remove = (slug: string) => setItems((cur) => cur.filter((i) => i.slug !== slug));
  const setQty = (slug: string, qty: number) =>
    setItems((cur) => qty <= 0 ? cur.filter((i) => i.slug !== slug)
      : cur.map((i) => i.slug === slug ? { ...i, qty } : i));
  const clear = () => setItems([]);

  const detailed = items
    .map((i) => {
      const product = PRODUCTS.find((p) => p.slug === i.slug);
      if (!product) return null;
      return { product, qty: i.qty, line: product.price * i.qty };
    })
    .filter((x): x is { product: Product; qty: number; line: number } => x !== null);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const subtotal = detailed.reduce((s, d) => s + d.line, 0);

  return (
    <Ctx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, detailed }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside CartProvider");
  return v;
};
