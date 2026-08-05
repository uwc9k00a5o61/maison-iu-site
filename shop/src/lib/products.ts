export type Category = "watches" | "jewellery" | "bags";

export type Brand =
  | "Rolex"
  | "Patek Philippe"
  | "Audemars Piguet"
  | "Cartier"
  | "Van Cleef & Arpels"
  | "Hermès";

export type Availability = "in-stock" | "waitlist" | "reserved";

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: Brand;
  category: Category;
  reference: string;
  /** Price in whole USD. `null` = price on application (POA). */
  priceUsd: number | null;
  image: string;
  availability: Availability;
  /** Marketing flag used only for surfacing, never for pricing. */
  isNew?: boolean;
  /** Structured specs for the PDP. Placeholder values pending client data. */
  specs?: ProductSpec[];
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "watches", label: "Watches" },
  { value: "jewellery", label: "Jewellery" },
  { value: "bags", label: "Bags" },
];

/** Brands actively carried — drives the catalogue brand filter. */
export const BRANDS: Brand[] = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Cartier",
  "Van Cleef & Arpels",
  "Hermès",
];

/**
 * Placeholder catalogue seeded from the static site content
 * (site/catalog.html) + brand roster. Watch shots are distinct crops
 * of the two-tone placeholder (dial marks cropped out) so no fake
 * logo is ever readable and each SKU frames differently — interim
 * until real client photography lands.
 */
export const PRODUCTS: Product[] = [
  {
    id: "rlx-datejust-36",
    slug: "rolex-datejust-36",
    name: "Datejust 36",
    brand: "Rolex",
    category: "watches",
    reference: "126231",
    priceUsd: 18500,
    image: "/products/watch-01.jpg",
    availability: "in-stock",
    isNew: true,
    specs: [
      { label: "Case", value: "36 mm, Oystersteel & Everose" },
      { label: "Movement", value: "Automatic, calibre 3235" },
      { label: "Bracelet", value: "Two-tone Jubilee" },
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "pp-nautilus-5711",
    slug: "patek-philippe-nautilus-5711",
    name: "Nautilus 5711",
    brand: "Patek Philippe",
    category: "watches",
    reference: "5711/1A",
    priceUsd: null,
    image: "/products/watch-02.jpg",
    availability: "waitlist",
    specs: [
      { label: "Case", value: "40 mm, stainless steel" },
      { label: "Movement", value: "Automatic, calibre 26-330 S C" },
      { label: "Bracelet", value: "Integrated steel" },
      { label: "Year", value: "2021" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "ap-royal-oak",
    slug: "audemars-piguet-royal-oak",
    name: "Royal Oak Selfwinding",
    brand: "Audemars Piguet",
    category: "watches",
    reference: "15500ST",
    priceUsd: 78000,
    image: "/products/watch-03.jpg",
    availability: "reserved",
    specs: [
      { label: "Case", value: "41 mm, stainless steel" },
      { label: "Movement", value: "Automatic, calibre 4302" },
      { label: "Bracelet", value: "Integrated steel" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "vca-alhambra-necklace",
    slug: "van-cleef-vintage-alhambra",
    name: "Vintage Alhambra Necklace",
    brand: "Van Cleef & Arpels",
    category: "jewellery",
    reference: "10 Motifs",
    priceUsd: 21400,
    image: "/products/necklace.jpg",
    availability: "in-stock",
    isNew: true,
    specs: [
      { label: "Metal", value: "18K yellow gold" },
      { label: "Motifs", value: "10 · mother-of-pearl" },
      { label: "Length", value: "45 cm" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "cartier-love-bracelet",
    slug: "cartier-love-bracelet",
    name: "Love Bracelet",
    brand: "Cartier",
    category: "jewellery",
    reference: "18K · 4 Diamonds",
    priceUsd: 11500,
    image: "/products/bracelet.jpg",
    availability: "in-stock",
    specs: [
      { label: "Metal", value: "18K white gold" },
      { label: "Stones", value: "4 brilliant-cut diamonds" },
      { label: "Size", value: "17" },
      { label: "Year", value: "2022" },
      { label: "Condition", value: "Excellent · full set" },
    ],
  },
  {
    id: "cartier-trinity-ring",
    slug: "cartier-trinity-ring",
    name: "Trinity Ring",
    brand: "Cartier",
    category: "jewellery",
    reference: "Classic",
    priceUsd: 1690,
    image: "/products/ring.jpg",
    availability: "in-stock",
    specs: [
      { label: "Metal", value: "18K white / yellow / rose gold" },
      { label: "Width", value: "Three-band" },
      { label: "Size", value: "52" },
      { label: "Year", value: "2024" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "vca-perlee-bracelet",
    slug: "van-cleef-perlee-bracelet",
    name: "Perlée Signature Bracelet",
    brand: "Van Cleef & Arpels",
    category: "jewellery",
    reference: "Yellow Gold",
    priceUsd: 8950,
    image: "/products/bracelet.jpg",
    availability: "waitlist",
    specs: [
      { label: "Metal", value: "18K yellow gold" },
      { label: "Design", value: "Golden beads" },
      { label: "Size", value: "Medium" },
      { label: "Year", value: "2023" },
      { label: "Condition", value: "Excellent · full set" },
    ],
  },
  {
    id: "hermes-kelly-25",
    slug: "hermes-kelly-25",
    name: "Kelly 25 Sellier",
    brand: "Hermès",
    category: "bags",
    reference: "Togo · Gold Hardware",
    priceUsd: 42000,
    image: "/products/bag.jpg",
    availability: "reserved",
    isNew: true,
    specs: [
      { label: "Leather", value: "Togo" },
      { label: "Hardware", value: "Gold-plated" },
      { label: "Size", value: "25 cm · Sellier" },
      { label: "Year", value: "2023 · stamp B" },
      { label: "Condition", value: "Unworn · full set" },
    ],
  },
  {
    id: "hermes-birkin-30",
    slug: "hermes-birkin-30",
    name: "Birkin 30",
    brand: "Hermès",
    category: "bags",
    reference: "Clemence",
    priceUsd: null,
    image: "/products/bag.jpg",
    availability: "waitlist",
    specs: [
      { label: "Leather", value: "Clemence" },
      { label: "Hardware", value: "Palladium" },
      { label: "Size", value: "30 cm" },
      { label: "Year", value: "2022 · stamp U" },
      { label: "Condition", value: "Excellent · full set" },
    ],
  },
];
