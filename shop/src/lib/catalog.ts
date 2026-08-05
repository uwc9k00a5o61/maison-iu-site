import type { Availability, Brand, Category, Product } from "./products";

export type SortKey = "featured" | "price-asc" | "price-desc";

export interface CatalogFilter {
  category?: Category | "all";
  brand?: Brand | "all";
  /** Inclusive upper bound in USD. `undefined` = no cap. */
  maxPriceUsd?: number;
}

/**
 * Pure catalogue filter. POA items (priceUsd === null) are kept
 * regardless of a price cap — you cannot exclude an unpriced piece
 * by a numeric ceiling. Kept pure & side-effect free for tests.
 */
export function filterProducts(
  products: readonly Product[],
  filter: CatalogFilter = {},
): Product[] {
  const { category = "all", brand = "all", maxPriceUsd } = filter;
  return products.filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (brand !== "all" && p.brand !== brand) return false;
    if (
      maxPriceUsd !== undefined &&
      p.priceUsd !== null &&
      p.priceUsd > maxPriceUsd
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Pure sort. Returns a new array; original order preserved for
 * "featured". POA items sink to the end of price sorts so priced
 * inventory always leads.
 */
export function sortProducts(
  products: readonly Product[],
  sort: SortKey = "featured",
): Product[] {
  if (sort === "featured") return [...products];
  const priced = products.filter((p) => p.priceUsd !== null);
  const poa = products.filter((p) => p.priceUsd === null);
  priced.sort((a, b) =>
    sort === "price-asc"
      ? (a.priceUsd as number) - (b.priceUsd as number)
      : (b.priceUsd as number) - (a.priceUsd as number),
  );
  return [...priced, ...poa];
}

/** Distinct brands present for a given category (for smart filters later). */
export function brandsForCategory(
  products: readonly Product[],
  category: Category | "all",
): Brand[] {
  const pool =
    category === "all"
      ? products
      : products.filter((p) => p.category === category);
  return [...new Set(pool.map((p) => p.brand))];
}

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  "in-stock": "In stock",
  waitlist: "Waitlist",
  reserved: "Reserved",
};
