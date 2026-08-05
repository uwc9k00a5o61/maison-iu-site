"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/site/product-card";
import {
  filterProducts,
  sortProducts,
  type SortKey,
} from "@/lib/catalog";
import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
  type Brand,
  type Category,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const PRICE_TIERS: { value: string; label: string; max?: number }[] = [
  { value: "all", label: "Any price" },
  { value: "10000", label: "Under $10,000", max: 10000 },
  { value: "25000", label: "Under $25,000", max: 25000 },
  { value: "75000", label: "Under $75,000", max: 75000 },
];

const SORTS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price · Low to High" },
  { value: "price-desc", label: "Price · High to Low" },
];

export function CatalogClient({
  initialCategory = "all",
}: {
  initialCategory?: Category | "all";
}) {
  const [category, setCategory] = React.useState<Category | "all">(
    initialCategory,
  );
  const [brand, setBrand] = React.useState<Brand | "all">("all");
  const [priceTier, setPriceTier] = React.useState<string>("all");
  const [sort, setSort] = React.useState<SortKey>("featured");

  const maxPriceUsd = React.useMemo(
    () => PRICE_TIERS.find((t) => t.value === priceTier)?.max,
    [priceTier],
  );

  const results = React.useMemo(() => {
    const filtered = filterProducts(PRODUCTS, {
      category,
      brand,
      maxPriceUsd,
    });
    return sortProducts(filtered, sort);
  }, [category, brand, maxPriceUsd, sort]);

  const chips: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "All" },
    ...CATEGORIES,
  ];

  return (
    <div>
      {/* category chips — horizontal scroll on mobile, no overflow */}
      <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
        {chips.map((c) => {
          const active = category === c.value;
          return (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setCategory(c.value);
                setBrand("all");
              }}
              className={cn(
                "shrink-0 rounded-full border px-[18px] py-2.5 text-[12px] font-semibold uppercase tracking-[0.1em] transition-colors",
                active
                  ? "border-ink bg-ink text-ivory"
                  : "border-line bg-transparent text-ink2 hover:border-line2",
              )}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* tool row: brand / price / sort */}
      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid grid-cols-2 gap-2.5 sm:flex sm:w-auto">
          <Select
            value={brand}
            onValueChange={(v) => setBrand(v as Brand | "all")}
          >
            <SelectTrigger className="sm:w-[210px]" aria-label="Brand">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceTier} onValueChange={setPriceTier}>
            <SelectTrigger className="sm:w-[190px]" aria-label="Price">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              {PRICE_TIERS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="tabular text-[12px] tracking-[0.06em] text-ash">
            {results.length} pieces
          </span>
          <Select
            value={sort}
            onValueChange={(v) => setSort(v as SortKey)}
          >
            <SelectTrigger className="w-[190px]" aria-label="Sort">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* grid */}
      {results.length > 0 ? (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 border-y border-line py-20 text-center">
          <p className="font-serif text-[20px] text-ink">Nothing here yet</p>
          <p className="mt-2 text-[14px] text-ash">
            No pieces match these filters.
          </p>
        </div>
      )}
    </div>
  );
}
