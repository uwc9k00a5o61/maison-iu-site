/**
 * Pure VIP-tier tests. Run with:
 *   node --import tsx/esm --test tests/vip.test.ts
 */
import assert from "node:assert/strict";
import { test } from "node:test";

import { vipDiscountUsd, vipTier } from "../src/lib/vip.ts";

test("no tier below $250k", () => {
  assert.equal(vipTier(0).id, "none");
  assert.equal(vipTier(249_999).id, "none");
  assert.equal(vipTier(null).id, "none");
  assert.equal(vipTier(undefined).id, "none");
});

test("tier thresholds", () => {
  assert.equal(vipTier(250_000).id, "silver");
  assert.equal(vipTier(250_000).rate, 0.005);
  assert.equal(vipTier(499_999).id, "silver");
  assert.equal(vipTier(500_000).id, "gold");
  assert.equal(vipTier(500_000).rate, 0.01);
  assert.equal(vipTier(999_999).id, "gold");
  assert.equal(vipTier(1_000_000).id, "platinum");
  assert.equal(vipTier(1_000_000).rate, 0.015);
  assert.equal(vipTier(5_000_000).id, "platinum");
});

test("discount on priced subtotal", () => {
  // silver 0.5% of $300,000 = $1,500
  assert.deepEqual(vipDiscountUsd(300_000, 300_000), {
    tier: vipTier(300_000),
    discountUsd: 1_500,
  });
});

test("guest and no-tier get zero discount", () => {
  assert.equal(vipDiscountUsd(100_000, 0).discountUsd, 0); // guest/no cumulative
  assert.equal(vipDiscountUsd(100_000, 100_000).discountUsd, 0); // below threshold
});

test("zero priced subtotal (all POA) gets zero discount", () => {
  assert.equal(vipDiscountUsd(0, 2_000_000).discountUsd, 0);
});

test("discount rounds to whole dollars", () => {
  // platinum 1.5% of $333,333 = 4999.995 → 5000
  assert.equal(vipDiscountUsd(333_333, 1_000_000).discountUsd, 5_000);
});
