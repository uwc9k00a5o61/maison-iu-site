/**
 * Price formatting for the storefront. USD, $-symbol, thousands
 * separators, no cents (luxury convention). `null` renders as POA.
 * Pure & locale-stable so QA can assert exact strings.
 */
export function formatPriceUsd(
  priceUsd: number | null,
  opts: { poaLabel?: string } = {},
): string {
  if (priceUsd === null) return opts.poaLabel ?? "Price on request";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceUsd);
}
