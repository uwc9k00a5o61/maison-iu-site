import type { Access, CollectionConfig } from "payload";

/**
 * Orders = enquiries raised from checkout. A guest order has no `customer`
 * (the guest flow must never be blocked by auth). Line items and money are
 * SNAPSHOTTED at order time so later catalogue price edits never rewrite
 * history. Status drives the concierge workflow and, once confirmed, the VIP
 * cumulative spend (Phase 3 hook).
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
  admin: {
    useAsTitle: "orderNumber",
    defaultColumns: [
      "orderNumber",
      "status",
      "contactName",
      "totalUsd",
      "createdAt",
    ],
    group: "Shop",
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
      admin: { readOnly: true },
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      hasMany: false,
      admin: {
        description: "Empty for guest orders.",
      },
    },
    {
      type: "row",
      fields: [
        { name: "contactName", type: "text", admin: { width: "50%" } },
        {
          name: "channel",
          type: "select",
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
        { name: "city", type: "text", admin: { width: "50%" } },
        {
          name: "locale",
          type: "select",
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
    },
    {
      name: "items",
      type: "array",
      admin: { description: "Snapshot at order time — never back-filled." },
      fields: [
        {
          type: "row",
          fields: [
            { name: "productId", type: "text", required: true, admin: { width: "50%" } },
            { name: "slug", type: "text", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "brand", type: "text", admin: { width: "50%" } },
            { name: "name", type: "text", admin: { width: "50%" } },
          ],
        },
        {
          type: "row",
          fields: [
            { name: "reference", type: "text", admin: { width: "34%" } },
            {
              name: "unitPriceUsd",
              type: "number",
              admin: { width: "33%", description: "Empty = POA" },
            },
            { name: "qty", type: "number", required: true, min: 1, admin: { width: "33%" } },
          ],
        },
        {
          name: "lineTotalUsd",
          type: "number",
          admin: { description: "Empty when the line is POA." },
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
          admin: { width: "50%", description: "Sum of priced ($) lines." },
        },
        {
          name: "poaCount",
          type: "number",
          defaultValue: 0,
          admin: { width: "50%", description: "Count of POA units." },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "vipTierAtOrder",
          type: "text",
          admin: { width: "34%", readOnly: true },
        },
        {
          name: "vipDiscountUsd",
          type: "number",
          defaultValue: 0,
          admin: { width: "33%", readOnly: true },
        },
        {
          name: "totalUsd",
          type: "number",
          defaultValue: 0,
          admin: { width: "33%", description: "Priced subtotal − VIP discount." },
        },
      ],
    },
  ],
};
