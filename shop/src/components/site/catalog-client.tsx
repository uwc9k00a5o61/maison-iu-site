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
import { useT } from "@/components/i18n/lang-provider";
import { filterProducts, sortProducts, type SortKey } from "@/lib/catalog";
import {
  BRANDS,
  CATEGORIES,
  PRODUCTS,
  type Brand,
  type Category,
  type Product,
} from "@/lib/products";

const PRICE_TIERS: { value: string; label?: string; cap?: string; max?: number }[] =
  [
    { value: "all" },
    { value: "10000", cap: "$10,000", max: 10000 },
    { value: "25000", cap: "$25,000", max: 25000 },
    { value: "75000", cap: "$75,000", max: 75000 },
  ];

const SORTS: { value: SortKey; key: string }[] = [
  { value: "featured", key: "sort.featured" },
  { value: "price-asc", key: "sort.priceAsc" },
  { value: "price-desc", key: "sort.priceDesc" },
];

// borderless editorial dropdown (no box) — text + champagne chevron
const EDITORIAL_TRIGGER =
  "h-auto w-auto gap-1.5 rounded-none border-0 bg-transparent px-0 py-0 text-[12px] font-semibold uppercase tracking-[0.1em] text-fg2 hover:border-0 data-[state=open]:border-0";

export function CatalogClient({
  initialCategory = "all",
  products = PRODUCTS,
}: {
  initialCategory?: Category | "all";
  /** Catalogue source — Payload-backed from the server, static as fallback. */
  products?: Product[];
}) {
  const { t, pieces } = useT();
  const [category, setCategory] = React.useState<Category | "all">(
    initialCategory,
  );
  const [brand, setBrand] = React.useState<Brand | "all">("all");
  const [priceTier, setPriceTier] = React.useState<string>("all");
  const [sort, setSort] = React.useState<SortKey>("featured");

  const maxPriceUsd = React.useMemo(
    () => PRICE_TIERS.find((tier) => tier.value === priceTier)?.max,
    [priceTier],
  );

  const results = React.useMemo(() => {
    const filtered = filterProducts(products, { category, brand, maxPriceUsd });
    return sortProducts(filtered, sort);
  }, [products, category, brand, maxPriceUsd, sort]);

  const tabs: (Category | "all")[] = ["all", ...CATEGORIES.map((c) => c.value)];

  return (
    <>
      {/* hero — title tracks the active category */}
      <section className="pb-6 pt-12 text-center sm:pt-16">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ey">
          {t("catalog.eyebrow")}
        </span>
        <h1 className="mt-3 font-serif text-[clamp(34px,5vw,52px)] font-medium leading-[1.03] text-fg">
          {t(`catalog.title.${category}`)}
        </h1>
        <div className="mx-auto mt-4 h-0.5 w-14 bg-script-accent" />
        <p className="mt-5 text-[14px] leading-relaxed text-fg2">
          Rolex · Patek Philippe · Audemars Piguet · Cartier · Van Cleef &amp;
          Arpels · Hermès
        </p>
      </section>

      {/* editorial category filter */}
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
          aria-label={t("catalog.title.all")}
        >
          {tabs.map((tab) => (
            <ToggleGroupItem key={tab} value={tab}>
              {t(`filter.${tab}`)}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {/* editorial sub-row: italic count + quiet dropdowns */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pt-3.5 pb-1.5">
        <span className="font-serif text-[14px] italic text-fg2">
          {pieces(results.length)}
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Select value={brand} onValueChange={(v) => setBrand(v as Brand | "all")}>
            <SelectTrigger aria-label={t("filter.allBrands")} className={EDITORIAL_TRIGGER}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">{t("filter.allBrands")}</SelectItem>
              {BRANDS.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceTier} onValueChange={setPriceTier}>
            <SelectTrigger aria-label={t("filter.anyPrice")} className={EDITORIAL_TRIGGER}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {PRICE_TIERS.map((tier) => (
                <SelectItem key={tier.value} value={tier.value}>
                  {tier.value === "all"
                    ? t("filter.anyPrice")
                    : t("filter.under", { v: tier.cap ?? "" })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger aria-label={t("sort.featured")} className={EDITORIAL_TRIGGER}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {SORTS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {t(s.key)}
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
          <p className="font-serif text-[20px] text-fg">
            {t("catalog.empty.title")}
          </p>
          <p className="mt-2 text-[14px] text-fg2">{t("catalog.empty.copy")}</p>
        </div>
      )}
    </>
  );
}
