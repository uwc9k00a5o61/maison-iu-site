import type { Access, CollectionConfig } from "payload";

import {
  ordersAfterChange,
  ordersAfterDelete,
} from "./hooks/recomputeCustomerSpend";

/**
 * Orders = enquiries raised from checkout. A guest order has no `customer`
 * (the guest flow must never be blocked by auth). Line items and money are
 * SNAPSHOTTED at order time so later catalogue price edits never rewrite
 * history. Status drives the concierge workflow and, once confirmed, the VIP
 * cumulative spend (Phase 3 hook). Admin labels are bilingual (en/ru).
 */

const adminOrOwner: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.collection === "admins") return true;
  if (user.collection === "customers") {
    return { customer: { equals: user.id } };
  }
  return false;
};

const adminsOnly: Access = ({ req: { user } }) =>
  user?.collection === "admins";

export const Orders: CollectionConfig = {
  slug: "orders",
  labels: {
    singular: { en: "Order", ru: "Заказ" },
    plural: { en: "Orders", ru: "Заказы" },
  },
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "status",
      "contactName",
      "totalUsd",
      "createdAt",
    ],
    group: { en: "Shop", ru: "Магазин" },
  },
  hooks: {
    afterChange: [ordersAfterChange],
    afterDelete: [ordersAfterDelete],
  },
  access: {
    read: adminOrOwner,
    // Orders are created server-side (route handler, overrideAccess) so the
    // guest flow needs no public write access.
    create: adminsOnly,
    update: adminsOnly,
    delete: adminsOnly,
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      unique: true,
      index: true,
      label: { en: "Order number", ru: "Номер заказа" },
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      label: { en: "Status", ru: "Статус" },
      options: [
        { label: { en: "New", ru: "Новый" }, value: "new" },
        { label: { en: "Confirmed", ru: "Подтверждён" }, value: "confirmed" },
        { label: { en: "Cancelled", ru: "Отменён" }, value: "cancelled" },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
      label: { en: "Customer", ru: "Клиент" },
      admin: {
        description: {
          en: "Empty for guest orders.",
          ru: "Пусто для гостевых заказов.",
        },
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "contactName",
          type: "text",
          label: { en: "Contact name", ru: "Имя контакта" },
          admin: { width: "50%" },
        },
        {
          name: "channel",
          type: "select",
          label: { en: "Channel", ru: "Канал" },
          admin: { width: "50%" },
          options: [
            { label: "Telegram", value: "telegram" },
            { label: "WhatsApp", value: "whatsapp" },
          ],
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "city",
          type: "text",
          label: { en: "City", ru: "Город" },
          admin: { width: "50%" },
        },
        {
          name: "locale",
          type: "select",
          label: { en: "Language", ru: "Язык" },
          admin: { width: "50%", readOnly: true },
          options: [
            { label: "RU", value: "ru" },
            { label: "EN", value: "en" },
          ],
        },
      ],
    },
    {
      name: "comment",
      type: "textarea",
      label: { en: "Comment", ru: "Комментарий" },
    },
    {
      name: "items",
      type: "array",
      label: { en: "Items", ru: "Позиции" },
      labels: {
        singular: { en: "Item", ru: "Позиция" },
        plural: { en: "Items", ru: "Позиции" },
      },
      admin: {
        description: {
          en: "Snapshot at order time — never back-filled.",
          ru: "Снимок на момент заказа — не пересчитывается.",
        },
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "productId",
              type: "text",
              required: true,
              label: { en: "Product ID", ru: "ID товара" },
              admin: { width: "50%" },
            },
            {
              name: "slug",
              type: "text",
              label: { en: "Slug", ru: "Слаг" },
              admin: { width: "50%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "brand",
              type: "text",
              label: { en: "Brand", ru: "Бренд" },
              admin: { width: "50%" },
            },
            {
              name: "name",
              type: "text",
              label: { en: "Model name", ru: "Название модели" },
              admin: { width: "50%" },
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "reference",
              type: "text",
              label: { en: "Reference", ru: "Референс" },
              admin: { width: "34%" },
            },
            {
              name: "unitPriceUsd",
              type: "number",
              label: { en: "Unit price (USD)", ru: "Цена за шт. (USD)" },
              admin: {
                width: "33%",
                description: { en: "Empty = POA", ru: "Пусто = по запросу" },
              },
            },
            {
              name: "qty",
              type: "number",
              required: true,
              min: 1,
              label: { en: "Qty", ru: "Кол-во" },
              admin: { width: "33%" },
            },
          ],
        },
        {
          name: "lineTotalUsd",
          type: "number",
          label: { en: "Line total (USD)", ru: "Сумма строки (USD)" },
          admin: {
            description: {
              en: "Empty when the line is POA.",
              ru: "Пусто, если позиция «по запросу».",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "pricedSubtotalUsd",
          type: "number",
          defaultValue: 0,
          label: { en: "Priced subtotal (USD)", ru: "Подытог по цене (USD)" },
          admin: {
            width: "50%",
            description: {
              en: "Sum of priced ($) lines.",
              ru: "Сумма позиций с ценой ($).",
            },
          },
        },
        {
          name: "poaCount",
          type: "number",
          defaultValue: 0,
          label: { en: "POA count", ru: "Позиций по запросу" },
          admin: {
            width: "50%",
            description: {
              en: "Count of POA units.",
              ru: "Количество единиц «по запросу».",
            },
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "vipTierAtOrder",
          type: "text",
          label: { en: "VIP tier at order", ru: "VIP-уровень на момент заказа" },
          admin: { width: "34%", readOnly: true },
        },
        {
          name: "vipDiscountUsd",
          type: "number",
          defaultValue: 0,
          label: { en: "VIP discount (USD)", ru: "VIP-скидка (USD)" },
          admin: { width: "33%", readOnly: true },
        },
        {
          name: "totalUsd",
          type: "number",
          defaultValue: 0,
          label: { en: "Total (USD)", ru: "Итого (USD)" },
          admin: {
            width: "33%",
            description: {
              en: "Priced subtotal − VIP discount.",
              ru: "Подытог по цене − VIP-скидка.",
            },
          },
        },
      ],
    },
  ],
};
