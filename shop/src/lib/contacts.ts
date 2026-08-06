/**
 * Single source of truth for the boutique's contact channels. Real values
 * are pending from Islam (task 019fd38c) — fill these two lines to go live:
 *   telegram: "maisoniu"      → t.me/maisoniu
 *   whatsapp: "79990000000"   → wa.me/79990000000  (digits only, no +)
 * Until then the checkout still builds the full order summary; the buttons
 * simply point at "#" (guarded by CONTACTS_PENDING).
 */
export const CONTACTS = {
  telegram: "", // Telegram @handle without the @  — PENDING
  whatsapp: "", // WhatsApp number, digits only     — PENDING
} as const;

export const CONTACTS_PENDING = !CONTACTS.telegram && !CONTACTS.whatsapp;

export function telegramUrl(text: string): string {
  if (!CONTACTS.telegram) return "#";
  return `https://t.me/${CONTACTS.telegram}?text=${encodeURIComponent(text)}`;
}

export function whatsappUrl(text: string): string {
  if (!CONTACTS.whatsapp) return "#";
  return `https://wa.me/${CONTACTS.whatsapp}?text=${encodeURIComponent(text)}`;
}
