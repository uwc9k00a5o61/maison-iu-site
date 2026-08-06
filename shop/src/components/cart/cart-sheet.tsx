"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ProductImage } from "@/components/site/product-image";
import { PhotoTile } from "@/components/site/photo-tile";
import { useCart } from "@/components/cart/cart-store";
import { useT } from "@/components/i18n/lang-provider";
import { resolveLines, subtotalUsd, poaQty } from "@/lib/cart";
import { formatPriceUsd } from "@/lib/format";

export function CartSheet() {
  const { lines, open, setOpen, setQty, remove } = useCart();
  const { t } = useT();
  const resolved = resolveLines(lines);
  const sub = subtotalUsd(resolved);
  const poa = poaQty(resolved);
  const units = resolved.reduce((s, l) => s + l.qty, 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent title={t("cart.title")}>
        <div className="flex items-center justify-between border-b border-panel-line px-6 py-5">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ey">
            {t("cart.title")}
            {units > 0 ? ` · ${units}` : ""}
          </span>
        </div>

        {resolved.length === 0 ? (
          /* concierge empty state */
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full border border-panel-line text-script-accent">
              <ShoppingBag className="size-6" strokeWidth={1.3} />
            </span>
            <p className="font-serif text-[22px] text-fg">
              {t("cart.empty.title")}
            </p>
            <p className="max-w-[34ch] text-[14px] leading-relaxed text-fg2">
              {t("cart.empty.copy")}
            </p>
            <Button className="mt-2" onClick={() => setOpen(false)} asChild>
              <Link href="/catalog">{t("cart.browse")}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4">
              <ul className="flex flex-col divide-y divide-hairline">
                {resolved.map(({ product, qty }) => (
                  <li key={product.id} className="flex gap-4 py-4">
                    <Link
                      href={`/product/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="plinth relative size-[68px] shrink-0 overflow-hidden rounded-lg border border-panel-line"
                    >
                      {product.imagePending ? (
                        <PhotoTile
                          variant="mini"
                          brand={product.brand}
                          reference={product.reference}
                        />
                      ) : (
                        <ProductImage
                          src={product.image}
                          alt={`${product.brand} ${product.name}`}
                          fill
                          sizes="68px"
                          className="object-cover"
                        />
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-fg2">
                        {product.brand}
                      </span>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={() => setOpen(false)}
                        className="truncate font-serif text-[15px] font-semibold text-fg"
                      >
                        {product.name}
                      </Link>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-mute">
                        {t("ref")} {product.reference}
                      </span>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            aria-label={t("cart.decrease")}
                            onClick={() => setQty(product.id, qty - 1)}
                            className="flex size-6 items-center justify-center rounded-full border border-line2 text-fg2 transition-colors hover:text-fg"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="tabular w-4 text-center text-[13px] font-semibold text-fg">
                            {qty}
                          </span>
                          <button
                            type="button"
                            aria-label={t("cart.increase")}
                            onClick={() => setQty(product.id, qty + 1)}
                            className="flex size-6 items-center justify-center rounded-full border border-line2 text-fg2 transition-colors hover:text-fg"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        {product.priceUsd !== null ? (
                          <span className="tabular font-sans text-[14px] font-bold text-fg">
                            {formatPriceUsd(product.priceUsd * qty)}
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-champ">
                            {t("price.onRequestShort")}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      aria-label={t("cart.remove", { name: product.name })}
                      onClick={() => remove(product.id)}
                      className="self-start text-fg2 transition-colors hover:text-garnet"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-panel-line px-6 py-5">
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg2">
                  {t("cart.subtotal")}
                </span>
                <span className="tabular font-sans text-[20px] font-bold text-fg">
                  {formatPriceUsd(sub)}
                </span>
              </div>
              {poa > 0 && (
                <p className="mt-1 text-right text-[11px] font-semibold uppercase tracking-[0.1em] text-champ">
                  {t("cart.onRequest", { n: poa })}
                </p>
              )}
              <Button className="mt-4 w-full" onClick={() => setOpen(false)} asChild>
                <Link href="/checkout">{t("cart.proceed")}</Link>
              </Button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-3 w-full text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-fg2 transition-colors hover:text-fg"
              >
                {t("cart.continue")}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
