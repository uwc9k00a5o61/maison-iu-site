import type { Payload } from "payload";

import { PRODUCTS } from "./lib/products";

/**
 * Idempotent seed logic shared by the `payload run` entry (src/seed.ts) and
 * the operator init script (scripts/db-init.mts). Products are upserted by
 * `productId`; a first admin is created only when none exists.
 */
export async function seedDatabase(payload: Payload): Promise<void> {
  // --- First admin user (only when none exists) ---
  const adminCount = await payload.count({ collection: "admins" });
  if (adminCount.totalDocs === 0) {
    const email = process.env.SEED_ADMIN_EMAIL || "admin@maison-iu.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "Maison-IU-2026!";
    await payload.create({
      collection: "admins",
      data: { email, password, name: "MAISON IU Admin" },
    });
    payload.logger.info(`Seeded admin user: ${email}`);
  } else {
    payload.logger.info(
      `Admins already present (${adminCount.totalDocs}) — skipping admin seed.`,
    );
  }

  // --- Products (upsert by productId, preserving featured order) ---
  let created = 0;
  let updated = 0;
  for (let i = 0; i < PRODUCTS.length; i++) {
    const p = PRODUCTS[i];
    const data = {
      productId: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      category: p.category,
      reference: p.reference,
      // undefined leaves the field empty === POA (never store 0)
      priceUsd: p.priceUsd ?? undefined,
      image: p.image,
      imagePending: p.imagePending ?? false,
      availability: p.availability,
      isNew: p.isNew ?? false,
      sortOrder: i,
      specs: p.specs?.map((s) => ({ label: s.label, value: s.value })) ?? [],
    };

    const existing = await payload.find({
      collection: "products",
      where: { productId: { equals: p.id } },
      limit: 1,
      depth: 0,
    });

    if (existing.docs[0]) {
      await payload.update({
        collection: "products",
        id: existing.docs[0].id,
        data,
      });
      updated++;
    } else {
      await payload.create({ collection: "products", data });
      created++;
    }
  }

  payload.logger.info(
    `Products synced — created ${created}, updated ${updated}, total ${PRODUCTS.length}.`,
  );
}
