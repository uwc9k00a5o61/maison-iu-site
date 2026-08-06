import { formatPriceUsd } from "./format";
import { PRODUCTS, type Product } from "./products";

/** Persisted cart line — only id + qty are stored; product data is resolved. */
export interface CartLine {
  id: string;
  qty: number;
}

export interface ResolvedLine {
  product: Product;
  qty: number;
}

/** Resolve stored lines against the catalogue, dropping unknown ids. */
export function resolveLines(lines: readonly CartLine[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const l of lines) {
    const product = PRODUCTS.find((p) => p.id === l.id);
    if (product && l.qty > 0) out.push({ product, qty: l.qty });
  }
  return out;
}

export function totalQty(lines: readonly CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

/** $ subtotal — POA (priceUsd === null) items are NOT summed. */
export function subtotalUsd(resolved: readonly ResolvedLine[]): number {
  return resolved.reduce(
    (sum, l) => sum + (l.product.priceUsd !== null ? l.product.priceUsd * l.qty : 0),
    0,
  );
}

/** Count of POA units (priced "on request"), reported separately. */
export function poaQty(resolved: readonly ResolvedLine[]): number {
  return resolved.reduce(
    (sum, l) => sum + (l.product.priceUsd === null ? l.qty : 0),
    0,
  );
}

export interface CheckoutDetails {
  name?: string;
  channel?: string;
  city?: string;
  comment?: string;
  locale?: "ru" | "en";
}

/**
 * Plain-text order summary for the Telegram / WhatsApp hand-off. Pure &
 * deterministic so QA can assert it. Bilingual header (RU · EN); item lines
 * are language-neutral (brand / model / ref / qty / price).
 */
export function buildOrderSummary(
  resolved: readonly ResolvedLine[],
  details: CheckoutDetails = {},
): string {
  const lines: string[] = [];
  lines.push("MAISON IU — Заявка на заказ / Order enquiry");
  lines.push("");

  resolved.forEach((l, i) => {
    const price =
      l.product.priceUsd !== null
        ? formatPriceUsd(l.product.priceUsd)
        : "Price on request";
    lines.push(
      `${i + 1}. ${l.product.brand} — ${l.product.name} · Ref. ${l.product.reference} · ×${l.qty} · ${price}`,
    );
  });

  const sub = subtotalUsd(resolved);
  const poa = poaQty(resolved);
  lines.push("");
  lines.push(`Подытог / Subtotal: ${formatPriceUsd(sub)}`);
  if (poa > 0) {
    lines.push(`+ ${poa} позиц. по запросу / on request`);
  }

  const meta: string[] = [];
  if (details.name) meta.push(`Имя / Name: ${details.name}`);
  if (details.channel) meta.push(`Канал / Channel: ${details.channel}`);
  if (details.city) meta.push(`Город / City: ${details.city}`);
  if (details.comment) meta.push(`Комментарий / Note: ${details.comment}`);
  if (meta.length) {
    lines.push("");
    lines.push(...meta);
  }

  return lines.join("\n");
}
