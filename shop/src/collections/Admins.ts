import type { CollectionConfig } from "payload";

/**
 * Admin panel users. This is the auth collection that backs `/admin`
 * (Payload `admin.user`). It is intentionally separate from the future
 * storefront `customers` collection — staff who manage catalogue/orders,
 * not shoppers. Access is admin-only by default (Payload requires a valid
 * session for every operation on an auth collection unless opened up).
 */
export const Admins: CollectionConfig = {
  slug: "admins",
  labels: {
    singular: { en: "Admin", ru: "Администратор" },
    plural: { en: "Admins", ru: "Администраторы" },
  },
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
    group: { en: "Staff", ru: "Персонал" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Name", ru: "Имя" },
    },
  ],
};
