"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart/cart-store";
import { cn } from "@/lib/utils";

/** PDP primary CTA — adds to bag and opens the cart. */
export function AddToBagButton({
  id,
  className,
}: {
  id: string;
  className?: string;
}) {
  const { add, setOpen } = useCart();
  return (
    <Button
      className={cn(
        "relative w-full active:translate-y-px md:w-auto md:pr-16",
        className,
      )}
      onClick={() => {
        add(id);
        setOpen(true);
      }}
    >
      Add to bag
      <span
        aria-hidden
        className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 md:flex"
      >
        <ArrowRight className="size-4" strokeWidth={1.6} />
      </span>
    </Button>
  );
}

/** Small catalogue-card affordance — adds without leaving the grid. */
export function CardAddButton({ id }: { id: string }) {
  const { add } = useCart();
  const [added, setAdded] = React.useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        // the card is a <Link>; don't navigate on add
        e.preventDefault();
        e.stopPropagation();
        add(id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1200);
      }}
      className={cn(
        "mt-3 inline-flex items-center justify-center gap-1.5 justify-self-center rounded-full border px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors",
        added
          ? "border-garnet bg-garnet text-cream"
          : "border-hairline text-fg2 hover:border-foil hover:text-fg",
      )}
    >
      {added ? (
        <>
          <Check className="size-3" /> Added
        </>
      ) : (
        "Add to bag"
      )}
    </button>
  );
}
