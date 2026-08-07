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
 *
 * Admin labels are bilingual ({ en, ru }); the panel defaults to Russian.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: { en: "Product", ru: "Товар" },
    plural: { en: "Products", ru: "Товары" },
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
    group: { en: "Catalogue", ru: "Каталог" },
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
          label: { en: "Product ID", ru: "ID товара" },
          admin: {
            width: "50%",
            description: {
              en: "Stable business id (maps to Product.id). e.g. rlx-datejust-36",
              ru: "Постоянный ID товара (совпадает с Product.id). Напр. rlx-datejust-36",
            },
          },
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
          index: true,
          label: { en: "Slug", ru: "Слаг (URL)" },
          admin: {
            width: "50%",
            description: {
              en: "URL slug, e.g. rolex-datejust-36",
              ru: "Часть URL, напр. rolex-datejust-36",
            },
          },
        },
      ],
    },
    {
      name: "name",
      type: "text",
      required: true,
      label: { en: "Model name", ru: "Название модели" },
    },
    {
      type: "row",
      fields: [
        {
          name: "brand",
          type: "select",
          required: true,
          label: { en: "Brand", ru: "Бренд" },
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
          label: { en: "Category", ru: "Категория" },
          admin: { width: "50%" },
          options: [
            { label: { en: "Watches", ru: "Часы" }, value: "watches" },
            { label: { en: "Jewellery", ru: "Украшения" }, value: "jewellery" },
            { label: { en: "Bags", ru: "Сумки" }, value: "bags" },
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
          label: { en: "Reference", ru: "Референс" },
          admin: { width: "50%" },
        },
        {
          name: "priceUsd",
          type: "number",
          min: 0,
          label: { en: "Price (USD)", ru: "Цена (USD)" },
          admin: {
            width: "50%",
            description: {
              en: "Whole USD. Leave empty for POA (price on application).",
              ru: "Целые USD. Оставьте пустым для «Цена по запросу» (POA).",
            },
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
          label: { en: "Availability", ru: "Наличие" },
          admin: { width: "50%" },
          options: [
            { label: { en: "In stock", ru: "В наличии" }, value: "in-stock" },
            { label: { en: "Waitlist", ru: "Лист ожидания" }, value: "waitlist" },
            { label: { en: "Reserved", ru: "Резерв" }, value: "reserved" },
          ],
        },
        {
          name: "sortOrder",
          type: "number",
          defaultValue: 0,
          label: { en: "Sort order", ru: "Порядок сортировки" },
          admin: {
            width: "50%",
            description: {
              en: "Ascending. Controls the default 'featured' order.",
              ru: "По возрастанию. Задаёт порядок «Рекомендуемые».",
            },
          },
        },
      ],
    },
    {
      name: "image",
      type: "text",
      required: true,
      label: { en: "Photo", ru: "Фото" },
      admin: {
        description: {
          en: "Public image path, e.g. /products/watch-01.jpg",
          ru: "Путь к изображению, напр. /products/watch-01.jpg",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "imagePending",
          type: "checkbox",
          defaultValue: true,
          label: { en: "Photo pending", ru: "Фото готовится" },
          admin: {
            width: "50%",
            description: {
              en: "While ticked the storefront shows the branded placeholder tile.",
              ru: "Пока включено, на витрине показывается фирменная заглушка вместо фото.",
            },
          },
        },
        {
          name: "isNew",
          type: "checkbox",
          defaultValue: false,
          label: { en: "New arrival", ru: "Новинка" },
          admin: {
            width: "50%",
            description: {
              en: "Marketing flag for surfacing only — never pricing.",
              ru: "Маркетинговый флаг для показа — не влияет на цену.",
            },
          },
        },
      ],
    },
    {
      name: "specs",
      type: "array",
      label: { en: "Specifications", ru: "Характеристики" },
      labels: {
        singular: { en: "Spec", ru: "Характеристика" },
        plural: { en: "Specs", ru: "Характеристики" },
      },
      admin: {
        description: {
          en: "Structured spec rows shown on the product page.",
          ru: "Строки характеристик, показываемые на странице товара.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "label",
              type: "text",
              required: true,
              label: { en: "Label", ru: "Название" },
              admin: { width: "40%" },
            },
            {
              name: "value",
              type: "text",
              required: true,
              label: { en: "Value", ru: "Значение" },
              admin: { width: "60%" },
            },
          ],
        },
      ],
    },
  ],
};
