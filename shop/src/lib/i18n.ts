/**
 * Lightweight RU/EN dictionary + helpers for the storefront. Client-side
 * only (paired with LangProvider/useT), consistent with the skin system.
 * Default locale is RU (Moscow audience) — change DEFAULT_LANG in one place.
 *
 * Never translated: brand names, model names, prices, spec tech-values,
 * "Maison IU".
 */
export type Lang = "ru" | "en";

export const LANGS: Lang[] = ["ru", "en"];
export const DEFAULT_LANG: Lang = "ru";

type Dict = Record<string, string>;

const en: Dict = {
  // nav
  "nav.watches": "Watches",
  "nav.jewellery": "Jewellery",
  "nav.bags": "Bags",
  "nav.catalogue": "Catalogue",
  "nav.search": "Search",
  "nav.account": "Account",
  "nav.cart": "Cart",
  "nav.menu": "Menu",
  "nav.close": "Close",
  // theme / lang bar
  "bar.theme": "Theme",
  "announce.appointment": "By appointment",
  "announce.provenance": "Provenance verified",
  "city.Moscow": "Moscow",
  "city.Dubai": "Dubai",
  "city.Istanbul": "Istanbul",
  // catalogue
  "catalog.eyebrow": "Fine Watches · Jewellery · Bags",
  "catalog.title.all": "The Collection",
  "catalog.title.watches": "Watches",
  "catalog.title.jewellery": "Jewellery",
  "catalog.title.bags": "Bags",
  "filter.all": "All",
  "filter.watches": "Watches",
  "filter.jewellery": "Jewellery",
  "filter.bags": "Bags",
  "filter.allBrands": "All brands",
  "filter.anyPrice": "Any price",
  "filter.under": "Under {v}",
  "sort.featured": "Featured",
  "sort.priceAsc": "Price · Low to High",
  "sort.priceDesc": "Price · High to Low",
  "catalog.empty.title": "Nothing here yet",
  "catalog.empty.copy": "No pieces match these filters.",
  "pieces": "{n} pieces",
  "pieces.one": "{n} piece",
  // availability / price
  "availability.in-stock": "In stock",
  "availability.waitlist": "Waitlist",
  "availability.reserved": "Reserved",
  "availability.new": "New",
  "price.onRequest": "Price on request",
  "price.onRequestShort": "On request",
  "tile.pending": "Photography in preparation",
  "ref": "Ref.",
  // pdp
  "pdp.back": "Back to catalogue",
  "pdp.reference": "Reference",
  "pdp.specifications": "Specifications",
  "pdp.provenance": "Provenance & authenticity",
  "pdp.addToBag": "Add to bag",
  "pdp.enquire": "Enquire on Telegram",
  "prov.verified.title": "Provenance verified",
  "prov.verified.copy": "Authenticated in-house before listing.",
  "prov.boxpapers.title": "Full box & papers",
  "prov.boxpapers.copy": "Complete set, original documentation.",
  "prov.viewing.title": "Private viewing",
  "prov.viewing.copy": "By appointment — Moscow · Dubai · Istanbul.",
  // spec labels
  "spec.Case": "Case",
  "spec.Movement": "Movement",
  "spec.Bracelet": "Bracelet",
  "spec.Year": "Year",
  "spec.Condition": "Condition",
  "spec.Metal": "Metal",
  "spec.Motifs": "Motifs",
  "spec.Length": "Length",
  "spec.Stones": "Stones",
  "spec.Size": "Size",
  "spec.Width": "Width",
  "spec.Design": "Design",
  "spec.Leather": "Leather",
  "spec.Hardware": "Hardware",
  // cart
  "cart.title": "Your selection",
  "cart.empty.title": "Your selection is empty",
  "cart.empty.copy":
    "Add pieces to reserve them, then complete your enquiry privately via Telegram or WhatsApp.",
  "cart.browse": "Browse the collection",
  "cart.subtotal": "Subtotal",
  "cart.onRequest": "+ {n} on request",
  "cart.proceed": "Proceed to checkout →",
  "cart.continue": "Continue browsing",
  "cart.remove": "Remove {name}",
  "cart.decrease": "Decrease quantity",
  "cart.increase": "Increase quantity",
  "cart.added": "Added",
  // checkout
  "checkout.eyebrow": "Private enquiry",
  "checkout.title": "Checkout",
  "checkout.details": "Your details",
  "checkout.name": "Name",
  "checkout.namePlaceholder": "Your name",
  "checkout.channel": "Preferred channel",
  "checkout.city": "City",
  "checkout.comment": "Comment",
  "checkout.commentPlaceholder": "Anything we should know (optional)",
  "checkout.orderSummary": "Order summary",
  "checkout.noPayment":
    "No online payment — send your selection to our concierge and we'll confirm availability, price and private viewing.",
  "checkout.orderTelegram": "Order via Telegram",
  "checkout.orderWhatsapp": "Order via WhatsApp",
  "checkout.copy": "Copy order summary",
  "checkout.copied": "Copied",
  "checkout.pending":
    "Concierge contacts are being finalised — use “Copy order summary” to send it to us for now.",
  "checkout.empty.title": "Your selection is empty",
  "checkout.empty.copy":
    "Add pieces to your selection, then return here to complete your enquiry privately.",
  // footer
  "footer.tagline":
    "Original watches, jewellery and premium bags — verified provenance, full box & papers.",
};

const ru: Dict = {
  "nav.watches": "Часы",
  "nav.jewellery": "Украшения",
  "nav.bags": "Сумки",
  "nav.catalogue": "Каталог",
  "nav.search": "Поиск",
  "nav.account": "Профиль",
  "nav.cart": "Корзина",
  "nav.menu": "Меню",
  "nav.close": "Закрыть",
  "bar.theme": "Тема",
  "announce.appointment": "По записи",
  "announce.provenance": "Подлинность подтверждена",
  "city.Moscow": "Москва",
  "city.Dubai": "Дубай",
  "city.Istanbul": "Стамбул",
  "catalog.eyebrow": "Часы · Украшения · Сумки",
  "catalog.title.all": "Коллекция",
  "catalog.title.watches": "Часы",
  "catalog.title.jewellery": "Украшения",
  "catalog.title.bags": "Сумки",
  "filter.all": "Все",
  "filter.watches": "Часы",
  "filter.jewellery": "Украшения",
  "filter.bags": "Сумки",
  "filter.allBrands": "Все бренды",
  "filter.anyPrice": "Любая цена",
  "filter.under": "До {v}",
  "sort.featured": "Рекомендуемые",
  "sort.priceAsc": "Цена · по возрастанию",
  "sort.priceDesc": "Цена · по убыванию",
  "catalog.empty.title": "Пока ничего нет",
  "catalog.empty.copy": "Нет позиций по заданным фильтрам.",
  "pieces": "{n} изделий",
  "pieces.one": "{n} изделие",
  "availability.in-stock": "В наличии",
  "availability.waitlist": "Лист ожидания",
  "availability.reserved": "Резерв",
  "availability.new": "Новинка",
  "price.onRequest": "Цена по запросу",
  "price.onRequestShort": "По запросу",
  "tile.pending": "Фотосъёмка готовится",
  "ref": "Ref.",
  "pdp.back": "Назад в каталог",
  "pdp.reference": "Референс",
  "pdp.specifications": "Характеристики",
  "pdp.provenance": "Происхождение и подлинность",
  "pdp.addToBag": "В корзину",
  "pdp.enquire": "Написать в Telegram",
  "prov.verified.title": "Подлинность подтверждена",
  "prov.verified.copy": "Проверено нашими экспертами перед публикацией.",
  "prov.boxpapers.title": "Полный комплект",
  "prov.boxpapers.copy": "Коробка, документы, оригинальная комплектация.",
  "prov.viewing.title": "Личный просмотр",
  "prov.viewing.copy": "По записи — Москва · Дубай · Стамбул.",
  "spec.Case": "Корпус",
  "spec.Movement": "Механизм",
  "spec.Bracelet": "Браслет",
  "spec.Year": "Год",
  "spec.Condition": "Состояние",
  "spec.Metal": "Металл",
  "spec.Motifs": "Мотивы",
  "spec.Length": "Длина",
  "spec.Stones": "Камни",
  "spec.Size": "Размер",
  "spec.Width": "Ширина",
  "spec.Design": "Дизайн",
  "spec.Leather": "Кожа",
  "spec.Hardware": "Фурнитура",
  "cart.title": "Ваш выбор",
  "cart.empty.title": "Ваш выбор пуст",
  "cart.empty.copy":
    "Добавьте изделия, чтобы зарезервировать их, затем оформите заявку в Telegram или WhatsApp.",
  "cart.browse": "Смотреть коллекцию",
  "cart.subtotal": "Подытог",
  "cart.onRequest": "+ {n} по запросу",
  "cart.proceed": "Оформить →",
  "cart.continue": "Продолжить покупки",
  "cart.remove": "Удалить {name}",
  "cart.decrease": "Уменьшить количество",
  "cart.increase": "Увеличить количество",
  "cart.added": "Добавлено",
  "checkout.eyebrow": "Частная заявка",
  "checkout.title": "Оформление",
  "checkout.details": "Ваши данные",
  "checkout.name": "Имя",
  "checkout.namePlaceholder": "Ваше имя",
  "checkout.channel": "Предпочтительный канал",
  "checkout.city": "Город",
  "checkout.comment": "Комментарий",
  "checkout.commentPlaceholder": "Что-то, что нам стоит знать (необязательно)",
  "checkout.orderSummary": "Сводка заказа",
  "checkout.noPayment":
    "Без онлайн-оплаты — отправьте выбор нашему консьержу, и мы подтвердим наличие, цену и личный просмотр.",
  "checkout.orderTelegram": "Оформить в Telegram",
  "checkout.orderWhatsapp": "Оформить в WhatsApp",
  "checkout.copy": "Скопировать сводку",
  "checkout.copied": "Скопировано",
  "checkout.pending":
    "Контакты консьержа уточняются — пока воспользуйтесь «Скопировать сводку», чтобы отправить её нам.",
  "checkout.empty.title": "Ваш выбор пуст",
  "checkout.empty.copy":
    "Добавьте изделия в выбор, затем вернитесь сюда, чтобы оформить заявку.",
  "footer.tagline":
    "Оригинальные часы, украшения и премиум-сумки — подтверждённая подлинность, полный комплект box & papers.",
};

const DICT: Record<Lang, Dict> = { en, ru };

function interpolate(s: string, vars?: Record<string, string | number>): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) =>
    vars[k] !== undefined ? String(vars[k]) : `{${k}}`,
  );
}

export function translate(
  lang: Lang,
  key: string,
  vars?: Record<string, string | number>,
): string {
  const s = DICT[lang][key] ?? DICT.en[key] ?? key;
  return interpolate(s, vars);
}

/** Localised "{n} pieces" with correct RU plural forms. */
export function piecesLabel(n: number, lang: Lang): string {
  if (lang === "ru") {
    const mod10 = n % 10;
    const mod100 = n % 100;
    let noun = "изделий";
    if (mod10 === 1 && mod100 !== 11) noun = "изделие";
    else if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14))
      noun = "изделия";
    return `${n} ${noun}`;
  }
  const words = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six",
    "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  ];
  const word = words[n] ?? String(n);
  return `${word} ${n === 1 ? "piece" : "pieces"}`;
}
