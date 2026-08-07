/**
 * VIP tier logic — pure & framework-free so it can be unit-tested and reused
 * on the server for both display (/account) and discount math (checkout).
 *
 * Thresholds on cumulative confirmed spend (USD):
 *   ≥ $1,000,000 → 1.5%
 *   ≥   $500,000 → 1.0%
 *   ≥   $250,000 → 0.5%
 *   else         → no tier, 0%
 *
 * The discount applies to the priced ($) subtotal on the SERVER only. Guests
 * and POA (price-on-application) lines never receive a discount.
 */
export type VipTierId = "none" | "silver" | "gold" | "platinum";

export interface VipTier {
  id: VipTierId;
  /** Discount as a fraction, e.g. 0.005 for 0.5%. */
  rate: number;
  /** Human percent for display, e.g. "0.5". */
  percentLabel: string;
  /** Lower bound in USD that unlocked this tier. */
  threshold: number;
}

const TIERS: readonly VipTier[] = [
  { id: "platinum", rate: 0.015, percentLabel: "1.5", threshold: 1_000_000 },
  { id: "gold", rate: 0.01, percentLabel: "1", threshold: 500_000 },
  { id: "silver", rate: 0.005, percentLabel: "0.5", threshold: 250_000 },
];

const NONE: VipTier = {
  id: "none",
  rate: 0,
  percentLabel: "0",
  threshold: 0,
};

/** Resolve the VIP tier for a cumulative confirmed spend (USD). */
export function vipTier(cumulativeUsd: number | null | undefined): VipTier {
  const spend = typeof cumulativeUsd === "number" ? cumulativeUsd : 0;
  if (!Number.isFinite(spend) || spend <= 0) return NONE;
  for (const tier of TIERS) {
    if (spend >= tier.threshold) return tier;
  }
  return NONE;
}

/**
 * Server-side discount on a priced ($) subtotal. `pricedSubtotalUsd` must
 * already EXCLUDE POA lines. Guests pass cumulative 0 → tier none → 0.
 * Returns a whole-dollar discount (rounded) and the resolved tier.
 */
export function vipDiscountUsd(
  pricedSubtotalUsd: number,
  cumulativeUsd: number | null | undefined,
): { tier: VipTier; discountUsd: number } {
  const tier = vipTier(cumulativeUsd);
  if (tier.rate === 0 || pricedSubtotalUsd <= 0) {
    return { tier, discountUsd: 0 };
  }
  return { tier, discountUsd: Math.round(pricedSubtotalUsd * tier.rate) };
}
