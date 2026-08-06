import type { CollectionConfig } from "payload";

/**
 * Catalogue products — the CMS-managed source of truth for the storefront.
 * Fields mirror `src/lib/products.ts` (the static seed) 1:1 so the
 * storefront can map a Payload doc straight onto the existing `Product`
 * type with no shape drift.
 *
 * Pricing: `priceUsd` empty === POA (price on application). Do not use 0.
 * Photography: while `imagePending` is true the storefront renders the
 * branded PhotoTile placeholder instead of `image`. To ship a real shot:
 * set `image` to a real path and untick `imagePending`.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Product",
    plural: "Products",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: [
      "name",
      "brand",
      "category",
      "priceUsd",
      "availability",
      "imagePending",
    ],
    group: "Catalogue",
  },
  // Storefront reads the catalogue publicly. Writes stay admin-only
  // (Payload default: only authenticated admins).
  access: {
    read: () => true,
  },
  defaultSort: "sortOrder",
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "productId",
          type: "text",
          required: true,
          unique: true,
          label: "Product ID",
          admin: {
            width: "50%",
            description:
              "Stable business id (maps to Product.id). e.g. rlx-datejust-36",
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          admin: {
            width: "50%",
            description: "URL slug, e.g. rolex-datejust-36",
          },
        },
      ],
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: "Model name",
    },
    {
      type: "row",
      fields: [
        {
          name: "brand",
          type: "select",
          required: true,
          admin: { width: "50%" },
          options: [
            "Rolex",
            "Patek Philippe",
            "Audemars Piguet",
            "Cartier",
            "Van Cleef & Arpels",
            "Hermès",
          ],
        },
        {
          name: "category",
          type: "select",
          required: true,
          admin: { width: "50%" },
          options: [
            { label: "Watches", value: "watches" },
            { label: "Jewellery", value: "jewellery" },
            { label: "Bags", value: "bags" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "reference",
          type: "text",
          required: true,
          admin: { width: "50%" },
        },
        {
          name: "priceUsd",
          type: "number",
          min: 0,
          label: "Price (USD)",
          admin: {
            width: "50%",
            description: "Whole USD. Leave empty for POA (price on application).",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "availability",
          type: "select",
          required: true,
          defaultValue: "in-stock",
          admin: { width: "50%" },
          options: [
            { label: "In stock", value: "in-stock" },
            { label: "Waitlist", value: "waitlist" },
            { label: "Reserved", value: "reserved" },
          ],
        },
        {
          name: "sortOrder",
          type: "number",
          defaultValue: 0,
          label: "Sort order",
          admin: {
            width: "50%",
            description: "Ascending. Controls the default 'featured' order.",
          },
        },
      ],
    },
    {
      name: "image",
      type: "text",
      required: true,
      admin: {
        description: "Public image path, e.g. /products/watch-01.jpg",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "imagePending",
          type: "checkbox",
          defaultValue: true,
          label: "Photo pending",
          admin: {
            width: "50%",
            description:
              "While ticked the storefront shows the branded placeholder tile.",
          },
        },
        {
          name: "isNew",
          type: "checkbox",
          defaultValue: false,
          label: "New arrival",
          admin: {
            width: "50%",
            description: "Marketing flag for surfacing only — never pricing.",
          },
        },
      ],
    },
    {
      name: "specs",
      type: "array",
      label: "Specifications",
      labels: { singular: "Spec", plural: "Specs" },
      admin: {
        description: "Structured spec rows shown on the product page.",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              admin: { width: "40%" },
            },
            {
              name: "value",
              type: "text",
              required: true,
              admin: { width: "60%" },
            },
          ],
        },
      ],
    },
  ],
};
