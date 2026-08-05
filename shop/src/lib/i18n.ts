/**
 * Minimal RU/EN dictionary scaffold. Stage-1 groundwork so copy is
 * centralised now and a locale provider can be layered in later
 * without touching components. Keys are namespaced by surface.
 */
export type Locale = "ru" | "en";

export const LOCALES: Locale[] = ["ru", "en"];

export const dict = {
  announce: {
    ru: ["По записи", "Москва", "Дубай", "Подлинность подтверждена"],
    en: ["By appointment", "Moscow", "Dubai", "Provenance verified"],
  },
  nav: {
    watches: { ru: "Часы", en: "Watches" },
    jewellery: { ru: "Украшения", en: "Jewellery" },
    bags: { ru: "Сумки", en: "Bags" },
    catalog: { ru: "Каталог", en: "Catalogue" },
    contact: { ru: "Контакты", en: "Contact" },
  },
  catalog: {
    eyebrow: {
      ru: "ЧАСЫ · УКРАШЕНИЯ · СУМКИ",
      en: "FINE WATCHES · JEWELLERY · BAGS",
    },
    subtitle: {
      ru: "Rolex · Patek Philippe · Audemars Piguet · Cartier · Van Cleef & Arpels · Hermès",
      en: "Rolex · Patek Philippe · Audemars Piguet · Cartier · Van Cleef & Arpels · Hermès",
    },
    all: { ru: "Все", en: "All" },
    brand: { ru: "Бренд", en: "Brand" },
    price: { ru: "Цена", en: "Price" },
    sort: { ru: "Сортировка", en: "Sort" },
    pieces: { ru: "изделий", en: "pieces" },
    provenance: { ru: "Подлинность подтверждена", en: "Provenance verified" },
    empty: {
      ru: "По заданным фильтрам ничего не найдено.",
      en: "No pieces match these filters.",
    },
  },
} as const;

export function t<S extends { ru: string; en: string }>(
  entry: S,
  locale: Locale,
): string {
  return entry[locale];
}
