"use client";

import * as React from "react";

import { type CartLine, totalQty } from "@/lib/cart";

const KEY = "miu_cart";

interface CartCtx {
  lines: CartLine[];
  count: number;
  hydrated: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const Ctx = React.createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [hydrated, setHydrated] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // hydrate from localStorage once
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setLines(
            parsed.filter(
              (x): x is CartLine =>
                !!x &&
                typeof x.id === "string" &&
                typeof x.qty === "number" &&
                x.qty > 0,
            ),
          );
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // persist after hydration
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota / privacy mode */
    }
  }, [lines, hydrated]);

  const add = React.useCallback((id: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, qty: l.qty + qty } : l));
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const setQty = React.useCallback((id: string, qty: number) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty } : l)),
    );
  }, []);

  const remove = React.useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = React.useCallback(() => setLines([]), []);

  const value: CartCtx = {
    lines,
    count: hydrated ? totalQty(lines) : 0,
    hydrated,
    open,
    setOpen,
    add,
    setQty,
    remove,
    clear,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
