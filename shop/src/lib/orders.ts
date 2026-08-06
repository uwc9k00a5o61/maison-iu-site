import "server-only";

import crypto from "crypto";

import { getPayload } from "payload";
import config from "@payload-config";

import { getCurrentCustomer } from "./customer-auth";
import { getAllProducts } from "./products-data";
import { vipDiscountUsd } from "./vip";

export interface OrderItemInput {
  id: string;
  qty: number;
}

export interface OrderContactInput {
  name?: string;
  channel?: "telegram" | "whatsapp";
  city?: string;
  comment?: string;
}

export interface CreateOrderInput {
  items: OrderItemInput[];
  contact?: OrderContactInput;
  locale?: "ru" | "en";
}

export interface CartQuote {
  pricedSubtotalUsd: number;
  poaCount: number;
  vipTier: string;
  vipPercentLabel: string;
  vipDiscountUsd: number;
  totalUsd: number;
  isMember: boolean;
}

/**
 * Server-authoritative price quote for a cart — subtotal, POA count and the
 * VIP discount for the session's customer (0 for guests / no tier / POA).
 * Prices are re-resolved from the catalogue; client-sent prices are ignored.
 */
export async function quoteCart(
  rawItems: unknown,
  headers: Headers,
): Promise<CartQuote> {
  const items = sanitiseItems(rawItems);
  const products = await getAllProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  let pricedSubtotalUsd = 0;
  let poaCount = 0;
  for (const { id, qty } of items) {
    const p = byId.get(id);
    if (!p) continue;
    if (p.priceUsd !== null) pricedSubtotalUsd += p.priceUsd * qty;
    else poaCount += qty;
  }

  const customer = await getCurrentCustomer(headers);
  const { tier, discountUsd } = vipDiscountUsd(
    pricedSubtotalUsd,
    customer?.cumulativeSpendUsd ?? 0,
  );

  return {
    pricedSubtotalUsd,
    poaCount,
    vipTier: tier.id,
    vipPercentLabel: tier.percentLabel,
    vipDiscountUsd: discountUsd,
    totalUsd: Math.max(0, pricedSubtotalUsd - discountUsd),
    isMember: Boolean(customer),
  };
}

function genOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `MIU-${stamp}-${rand}`;
}

function sanitiseItems(raw: unknown): OrderItemInput[] {
  if (!Array.isArray(raw)) return [];
  const out: OrderItemInput[] = [];
  for (const r of raw) {
    const id = (r as { id?: unknown })?.id;
    const qtyRaw = (r as { qty?: unknown })?.qty;
    const qty = Math.floor(Number(qtyRaw));
    if (typeof id === "string" && id && Number.isFinite(qty) && qty > 0) {
      out.push({ id, qty: Math.min(qty, 99) });
    }
  }
  return out;
}

/**
 * Create an Order from a checkout submission. Prices are re-resolved from the
 * catalogue on the SERVER (never trust client-sent prices). A logged-in
 * customer is linked via the session cookie; guests create a customerless
 * order. Returns the human order number.
 */
export async function createOrder(
  input: CreateOrderInput,
  headers: Headers,
): Promise<{ ok: true; orderNumber: string } | { ok: false; error: string }> {
  const items = sanitiseItems(input.items);
  if (items.length === 0) return { ok: false, error: "empty" };

  const locale = input.locale === "en" ? "en" : "ru";
  const products = await getAllProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  const snapshots: {
    productId: string;
    slug: string;
    brand: string;
    name: string;
    reference: string;
    unitPriceUsd: number | null;
    qty: number;
    lineTotalUsd: number | null;
  }[] = [];
  let pricedSubtotalUsd = 0;
  let poaCount = 0;

  for (const { id, qty } of items) {
    const p = byId.get(id);
    if (!p) continue; // silently drop unknown ids — never fail the enquiry
    const unit = p.priceUsd;
    const lineTotal = unit !== null ? unit * qty : null;
    if (unit !== null) pricedSubtotalUsd += unit * qty;
    else poaCount += qty;
    snapshots.push({
      productId: p.id,
      slug: p.slug,
      brand: p.brand,
      name: p.name,
      reference: p.reference,
      unitPriceUsd: unit,
      qty,
      lineTotalUsd: lineTotal,
    });
  }

  if (snapshots.length === 0) return { ok: false, error: "no_valid_items" };

  const customer = await getCurrentCustomer(headers);
  const { tier, discountUsd } = vipDiscountUsd(
    pricedSubtotalUsd,
    customer?.cumulativeSpendUsd ?? 0,
  );
  const totalUsd = Math.max(0, pricedSubtotalUsd - discountUsd);

  const contact = input.contact ?? {};
  const orderNumber = genOrderNumber();

  const payload = await getPayload({ config });
  await payload.create({
    collection: "orders",
    overrideAccess: true,
    data: {
      orderNumber,
      status: "new",
      customer: customer ? customer.id : undefined,
      contactName: contact.name?.trim() || undefined,
      channel:
        contact.channel === "telegram" || contact.channel === "whatsapp"
          ? contact.channel
          : undefined,
      city: contact.city?.trim() || undefined,
      comment: contact.comment?.trim() || undefined,
      locale,
      items: snapshots,
      pricedSubtotalUsd,
      poaCount,
      vipTierAtOrder: tier.id,
      vipDiscountUsd: discountUsd,
      totalUsd,
    },
  });

  return { ok: true, orderNumber };
}
