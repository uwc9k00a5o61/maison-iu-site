import "server-only";

import { getPayload } from "payload";
import config from "@payload-config";

import {
  PRODUCTS,
  type Availability,
  type Brand,
  type Category,
  type Product,
  type ProductSpec,
} from "./products";

/**
 * Server-only catalogue data access. The storefront reads products from
 * Payload (Local API — no HTTP hop), and always degrades gracefully to the
 * static `PRODUCTS` seed if the CMS/DB is unreachable, so a database hiccup
 * can never blank the shop. Payload docs are mapped 1:1 onto the existing
 * `Product` type used everywhere in the UI.
 */

type MediaDoc = {
  url?: string | null;
  sizes?: Record<string, { url?: string | null } | undefined> | null;
};

type ProductDoc = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  reference: string;
  priceUsd?: number | null;
  image: string;
  imagePending?: boolean | null;
  availability: string;
  isNew?: boolean | null;
  specs?: { label: string; value: string }[] | null;
  /** Uploaded real photo (populated at depth ≥ 1); overrides the placeholder. */
  photo?: MediaDoc | string | null;
};

/** Best available URL from an uploaded media doc (hero size → original). */
function photoUrl(photo: ProductDoc["photo"]): string | null {
  if (!photo || typeof photo === "string") return null;
  return photo.sizes?.hero?.url ?? photo.url ?? null;
}

function mapDoc(doc: ProductDoc): Product {
  const specs: ProductSpec[] | undefined = doc.specs?.length
    ? doc.specs.map((s) => ({ label: s.label, value: s.value }))
    : undefined;

  // A real uploaded photo takes priority and auto-clears the placeholder.
  const realPhoto = photoUrl(doc.photo);
  const image = realPhoto ?? doc.image;
  const imagePending = realPhoto ? false : (doc.imagePending ?? false);

  return {
    id: doc.productId,
    slug: doc.slug,
    name: doc.name,
    brand: doc.brand as Brand,
    category: doc.category as Category,
    reference: doc.reference,
    priceUsd: doc.priceUsd ?? null,
    image,
    imagePending,
    availability: doc.availability as Availability,
    isNew: doc.isNew ?? false,
    specs,
  };
}

/** All catalogue products in "featured" order (Payload → static fallback). */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "products",
      limit: 500,
      sort: "sortOrder",
      depth: 1,
    });
    if (!res.docs.length) return PRODUCTS;
    return (res.docs as unknown as ProductDoc[]).map(mapDoc);
  } catch (err) {
    console.error("[products-data] getAllProducts fallback to static:", err);
    return PRODUCTS;
  }
}

/** Single product by slug (Payload → static fallback). `null` if unknown. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "products",
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    });
    const doc = res.docs[0] as unknown as ProductDoc | undefined;
    if (doc) return mapDoc(doc);
  } catch (err) {
    console.error("[products-data] getProductBySlug fallback to static:", err);
  }
  return PRODUCTS.find((p) => p.slug === slug) ?? null;
}
