/**
 * Pure catalogue-layer tests. Excluded from the Next tsconfig; run with:
 *   node --test --experimental-strip-types tests/catalog.test.ts
 * Dependency-free (node:test) so QA can lift into Vitest/Jest later.
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { filterProducts, sortProducts } from "../src/lib/catalog.ts";
import { formatPriceUsd } from "../src/lib/format.ts";
import type { Product } from "../src/lib/products.ts";

const P = (over: Partial<Product>): Product => ({
  id: "x",
  slug: "x",
  name: "X",
  brand: "Rolex",
  category: "watches",
  reference: "0",
  priceUsd: 1000,
  image: "/x.jpg",
  availability: "in-stock",
  ...over,
});

test("filter by category", () => {
  const items = [P({ category: "watches" }), P({ category: "bags" })];
  assert.equal(filterProducts(items, { category: "bags" }).length, 1);
});

test("filter by brand", () => {
  const items = [P({ brand: "Rolex" }), P({ brand: "Cartier" })];
  assert.equal(filterProducts(items, { brand: "Cartier" }).length, 1);
});

test("price cap keeps POA items", () => {
  const items = [
    P({ priceUsd: 5000 }),
    P({ priceUsd: 50000 }),
    P({ priceUsd: null }),
  ];
  const out = filterProducts(items, { maxPriceUsd: 10000 });
  assert.equal(out.length, 2); // 5000 + POA, drops 50000
});

test("sort price-asc sinks POA to end", () => {
  const items = [P({ priceUsd: null }), P({ priceUsd: 300 }), P({ priceUsd: 100 })];
  const out = sortProducts(items, "price-asc");
  assert.deepEqual(
    out.map((p) => p.priceUsd),
    [100, 300, null],
  );
});

test("formatPriceUsd renders $ and POA", () => {
  assert.equal(formatPriceUsd(18500), "$18,500");
  assert.equal(formatPriceUsd(null), "Price on request");
});
