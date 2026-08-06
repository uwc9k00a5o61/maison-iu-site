import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, Payload } from "payload";

/** Extract a relationship id whether it's stored flat or populated. */
function relId(value: unknown): string | number | null {
  if (value == null) return null;
  if (typeof value === "object") {
    const id = (value as { id?: string | number }).id;
    return id ?? null;
  }
  return value as string | number;
}

/**
 * Recompute a customer's cumulative CONFIRMED spend from scratch — the sum of
 * `pricedSubtotalUsd` across their confirmed orders. Full recompute (not
 * increment) keeps the figure idempotent under any status transition, edit,
 * or delete, so it can never drift or double-count. Guests (no customer) are
 * a no-op.
 */
export async function recomputeCustomerSpend(
  payload: Payload,
  customerId: string | number | null,
): Promise<void> {
  if (customerId == null) return;
  const confirmed = await payload.find({
    collection: "orders",
    where: {
      and: [
        { customer: { equals: customerId } },
        { status: { equals: "confirmed" } },
      ],
    },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });
  const total = confirmed.docs.reduce(
    (sum, o) => sum + (Number((o as { pricedSubtotalUsd?: number }).pricedSubtotalUsd) || 0),
    0,
  );
  await payload.update({
    collection: "customers",
    id: customerId,
    data: { cumulativeSpendUsd: total },
    overrideAccess: true,
    context: { skipRecompute: true },
  });
}

/** afterChange: recompute the (possibly re-assigned) customer's spend. */
export const ordersAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  const current = relId(doc?.customer);
  const previous = relId(previousDoc?.customer);
  await recomputeCustomerSpend(req.payload, current);
  if (previous != null && previous !== current) {
    await recomputeCustomerSpend(req.payload, previous);
  }
  return doc;
};

/** afterDelete: recompute the deleted order's customer. */
export const ordersAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  await recomputeCustomerSpend(req.payload, relId(doc?.customer));
  return doc;
};
