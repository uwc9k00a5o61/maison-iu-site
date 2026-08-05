"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ProductCard } from "@/components/site/product-card";
import { Reveal } from "@/components/site/reveal";
import { filterProducts, sortProducts, type SortKey } from "@/lib/catalog";
import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
  type Brand,
  type Category,
} from "@/lib/products";

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

const WORDS = [
  "Zero", "One", "Two", "Three", "Four", "Five", "Six",
  "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
];
function pieces(n: number) {
  const word = WORDS[n] ?? String(n);
  return `${word} ${n === 1 ? "piece" : "pieces"}`;
}

// borderless editorial dropdown (no box) — text + champagne chevron
const EDITORIAL_TRIGGER =
  "h-auto w-auto gap-1.5 rounded-none border-0 bg-transparent px-0 py-0 text-[12px] font-semibold uppercase tracking-[0.1em] text-fg2 hover:border-0 data-[state=open]:border-0";

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
    const filtered = filterProducts(PRODUCTS, { category, brand, maxPriceUsd });
    return sortProducts(filtered, sort);
  }, [category, brand, maxPriceUsd, sort]);

  const tabs: { value: Category | "all"; label: string }[] = [
    { value: "all", label: "All" },
    ...CATEGORIES,
  ];

  return (
    <div>
      {/* editorial category filter — text + garnet underline (keyboard a11y via ToggleGroup) */}
      <div className="border-y border-hairline py-3.5">
        <ToggleGroup
          type="single"
          value={category}
          onValueChange={(v) => {
            if (v) {
              setCategory(v as Category | "all");
              setBrand("all");
            }
          }}
          aria-label="Category"
        >
          {tabs.map((t) => (
            <ToggleGroupItem key={t.value} value={t.value}>
              {t.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* editorial sub-row: italic count + quiet brand / price / sort dropdowns */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-3.5 pb-1.5">
        <span className="font-serif text-[14px] italic text-fg2">
          {pieces(results.length)}
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Select
            value={brand}
            onValueChange={(v) => setBrand(v as Brand | "all")}
          >
            <SelectTrigger aria-label="Brand" className={EDITORIAL_TRIGGER}>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All brands</SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceTier} onValueChange={setPriceTier}>
            <SelectTrigger aria-label="Price" className={EDITORIAL_TRIGGER}>
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent align="end">
              {PRICE_TIERS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger aria-label="Sort" className={EDITORIAL_TRIGGER}>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent align="end">
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
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {results.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 6) * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="mt-12 border-y border-hairline py-20 text-center">
          <p className="font-serif text-[20px] text-fg">Nothing here yet</p>
          <p className="mt-2 text-[14px] text-fg2">
            No pieces match these filters.
          </p>
        </div>
      )}
    </div>
  );
}
