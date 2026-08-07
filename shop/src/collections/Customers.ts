import type { Access, CollectionConfig } from "payload";

/**
 * Storefront customers — OPTIONAL accounts. Auth is passwordless from the
 * shopper's side: a 6-digit e-mail code (dev mode logs/returns the code) or
 * Telegram Login (stub until TELEGRAM_BOT_TOKEN is set). Guests never create
 * a Customer. The local (password) strategy stays enabled only so the server
 * can mint sessions via payload.login() after a code is verified — passwords
 * are random, rotated on every login, and never exposed to the shopper.
 */

// A customer may read/update only their own record; admins do anything.
const selfOrAdmin: Access = ({ req: { user } }) => {
  if (!user) return false;
  if (user.collection === "admins") return true;
  if (user.collection === "customers") {
    return { id: { equals: user.id } };
  }
  return false;
};

const adminsOnly: Access = ({ req: { user } }) =>
  user?.collection === "admins";

export const Customers: CollectionConfig = {
  slug: "customers",
  labels: {
    singular: { en: "Customer", ru: "Клиент" },
    plural: { en: "Customers", ru: "Клиенты" },
  },
  auth: {
    tokenExpiration: 60 * 60 * 24 * 30, // 30 days
    maxLoginAttempts: 0, // passwordless server-side login → no lockout
    useAPIKey: false,
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "cumulativeSpendUsd", "createdAt"],
    group: { en: "Shop", ru: "Магазин" },
  },
  access: {
    read: selfOrAdmin,
    create: adminsOnly, // shopper records are created server-side (overrideAccess)
    update: selfOrAdmin,
    delete: adminsOnly,
    admin: ({ req: { user } }) => user?.collection === "admins",
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: { en: "Name", ru: "Имя" },
    },
    {
      name: "phone",
      type: "text",
      label: { en: "Phone", ru: "Телефон" },
    },
    {
      name: "telegramId",
      type: "text",
      unique: true,
      index: true,
      label: { en: "Telegram ID", ru: "Telegram ID" },
      admin: {
        readOnly: true,
        description: {
          en: "Telegram user id (if linked).",
          ru: "Telegram ID пользователя (если привязан).",
        },
      },
    },
    {
      name: "telegramUsername",
      type: "text",
      label: { en: "Telegram username", ru: "Telegram-ник" },
      admin: { readOnly: true },
    },
    {
      name: "cumulativeSpendUsd",
      type: "number",
      defaultValue: 0,
      min: 0,
      label: { en: "Cumulative spend (USD)", ru: "Накопленная сумма (USD)" },
      admin: {
        readOnly: true,
        description: {
          en: "Sum of confirmed orders' priced ($) subtotals. Drives VIP tier. Maintained by hooks.",
          ru: "Сумма подытогов подтверждённых заказов. Определяет VIP-уровень. Ведётся автоматически.",
        },
      },
    },
    // --- Hidden passwordless one-time-code state (never exposed via API) ---
    {
      name: "loginCodeHash",
      type: "text",
      hidden: true,
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
    },
    {
      name: "loginCodeExpiresAt",
      type: "date",
      hidden: true,
      access: {
        read: () => false,
        create: () => false,
        update: () => false,
      },
    },
  ],
};
