"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductImage } from "@/components/site/product-image";
import { PhotoTile } from "@/components/site/photo-tile";
import { CardAddButton } from "@/components/cart/add-to-bag";
import { Badge } from "@/components/ui/badge";
import { useT } from "@/components/i18n/lang-provider";
import { formatPriceUsd } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const { t } = useT();
  const showBadge =
    product.availability === "waitlist" ||
    product.availability === "reserved" ||
    product.isNew;
  const isPoa = product.priceUsd === null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="panel group flex flex-col overflow-hidden rounded-2xl border shadow-[0_12px_44px_rgba(22,19,14,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(22,19,14,0.10)]"
    >
      <div className="plinth photo-vignette relative aspect-[1/1.1] overflow-hidden">
        {product.imagePending ? (
          <PhotoTile
            variant="card"
            brand={product.brand}
            reference={product.reference}
          />
        ) : (
          <ProductImage
            src={product.image}
            alt={`${product.brand} ${product.name}`}
            fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 360px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        )}

        {showBadge && (
          <div className="absolute left-3 top-3 z-[2]">
            {product.isNew ? (
              <Badge variant="solid">{t("availability.new")}</Badge>
            ) : (
              <Badge
                variant={product.availability === "reserved" ? "quiet" : "outline"}
                className="bg-paper/85 backdrop-blur-sm"
              >
                {t(`availability.${product.availability}`)}
              </Badge>
            )}
          </div>
        )}

        {/* ghost wishlist — hairline ring, no heavy disc */}
        <span
          aria-hidden
          className="absolute right-3 top-3 z-[2] flex size-[30px] items-center justify-center rounded-full border border-line2 bg-paper/60 backdrop-blur-sm"
        >
          <Heart className="size-3.5 text-ink2" strokeWidth={1.3} />
        </span>
      </div>

      {/* fixed grid rows → every card aligns to the same baseline rhythm */}
      <div className="grid grid-rows-[auto_minmax(2.6em,auto)_auto_auto] content-start gap-1.5 px-4 pb-[18px] pt-3.5 text-center">
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-fg2">
          {product.brand}
        </span>
        <h3 className="flex items-center justify-center font-serif text-[16px] font-semibold leading-tight text-fg sm:text-[17px]">
          {product.name}
        </h3>
        <span className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-mute">
          {t("ref")} {product.reference}
        </span>
        {isPoa ? (
          <span className="whitespace-nowrap pt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-champ">
            {t("price.onRequest")}
          </span>
        ) : (
          /* price in Inter (legible $ / numerals) — names stay Bodoni */
          <span className="tabular whitespace-nowrap font-sans text-[17px] font-bold tracking-[0.01em] text-fg sm:text-[18px]">
            {formatPriceUsd(product.priceUsd)}
          </span>
        )}
        <CardAddButton id={product.id} />
      </div>
    </Link>
  );
}
