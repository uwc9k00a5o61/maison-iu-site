import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductImage } from "@/components/site/product-image";
import { Badge } from "@/components/ui/badge";
import { AVAILABILITY_LABELS } from "@/lib/catalog";
import { formatPriceUsd } from "@/lib/format";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const showBadge =
    product.availability === "waitlist" ||
    product.availability === "reserved" ||
    product.isNew;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-[20px] border border-line/70 bg-white shadow-[0_12px_44px_rgba(22,19,14,0.05)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_66px_rgba(22,19,14,0.12)]"
    >
      <div className="relative aspect-[1/1.1] overflow-hidden bg-gradient-to-b from-[#f6f1e8] to-[#efe7d8]">
        <ProductImage
          src={product.image}
          alt={`${product.brand} ${product.name}`}
          fill
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 360px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />

        {showBadge && (
          <div className="absolute left-4 top-4 z-[2]">
            {product.isNew ? (
              <Badge variant="solid">New</Badge>
            ) : (
              <Badge
                variant={product.availability === "reserved" ? "quiet" : "outline"}
                className="bg-paper/85 backdrop-blur-sm"
              >
                {AVAILABILITY_LABELS[product.availability]}
              </Badge>
            )}
          </div>
        )}

        <span
          aria-hidden
          className="absolute right-4 top-4 z-[2] flex size-8 items-center justify-center rounded-full bg-paper/90 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
        >
          <Heart className="size-[15px] text-ink2" strokeWidth={1.1} />
        </span>
      </div>

      <div className="flex flex-col items-center px-4 pb-8 pt-6 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink2">
          {product.brand}
        </span>
        <h3 className="mt-2 flex min-h-[2.6em] items-center justify-center font-sans text-[16px] font-semibold leading-snug text-ink sm:text-[17px]">
          {product.name}
        </h3>
        <span className="tabular mt-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
          Ref. {product.reference}
        </span>
        <span className="tabular mt-3 font-sans text-[17px] font-bold tracking-[0.01em] text-ink sm:text-[18px]">
          {formatPriceUsd(product.priceUsd)}
        </span>
      </div>
    </Link>
  );
}
