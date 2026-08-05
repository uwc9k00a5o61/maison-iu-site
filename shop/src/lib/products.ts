export type Category = "watches" | "jewellery" | "bags";

export type Brand =
  | "Rolex"
  | "Patek Philippe"
  | "Audemars Piguet"
  | "Richard Mille"
  | "Cartier"
  | "Van Cleef & Arpels"
  | "Hermès";

export type Availability = "in-stock" | "waitlist" | "reserved";

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
}

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: "watches", label: "Watches" },
  { value: "jewellery", label: "Jewellery" },
  { value: "bags", label: "Bags" },
];

export const BRANDS: Brand[] = [
  "Rolex",
  "Patek Philippe",
  "Audemars Piguet",
  "Richard Mille",
  "Cartier",
  "Van Cleef & Arpels",
  "Hermès",
];

/**
 * Placeholder catalogue seeded from the static site content
 * (site/catalog.html) + brand roster. Images are the shared
 * placeholder shots in /public/products.
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
    image: "/products/watch-twotone.jpg",
    availability: "in-stock",
    isNew: true,
  },
  {
    id: "rlx-daytona",
    slug: "rolex-cosmograph-daytona",
    name: "Cosmograph Daytona",
    brand: "Rolex",
    category: "watches",
    reference: "126503",
    priceUsd: 52000,
    image: "/products/watch-twotone.jpg",
    availability: "in-stock",
  },
  {
    id: "pp-nautilus-5711",
    slug: "patek-philippe-nautilus-5711",
    name: "Nautilus 5711",
    brand: "Patek Philippe",
    category: "watches",
    reference: "5711/1A",
    priceUsd: null,
    image: "/products/watch-twotone.jpg",
    availability: "waitlist",
  },
  {
    id: "ap-royal-oak",
    slug: "audemars-piguet-royal-oak",
    name: "Royal Oak Selfwinding",
    brand: "Audemars Piguet",
    category: "watches",
    reference: "15500ST",
    priceUsd: 78000,
    image: "/products/watch-twotone.jpg",
    availability: "reserved",
  },
  {
    id: "rm-011",
    slug: "richard-mille-rm-011",
    name: "RM 011 Flyback",
    brand: "Richard Mille",
    category: "watches",
    reference: "RM 011",
    priceUsd: 265000,
    image: "/products/watch-twotone.jpg",
    availability: "waitlist",
    isNew: true,
  },
  {
    id: "cartier-santos",
    slug: "cartier-santos-large",
    name: "Santos de Cartier",
    brand: "Cartier",
    category: "watches",
    reference: "Large Model",
    priceUsd: 12900,
    image: "/products/watch-twotone.jpg",
    availability: "in-stock",
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
  },
  {
    id: "cartier-love-bracelet",
    slug: "cartier-love-bracelet",
    name: "Love Bracelet",
    brand: "Cartier",
    category: "jewellery",
    reference: "18K, 4 Diamonds",
    priceUsd: 11500,
    image: "/products/bracelet.jpg",
    availability: "in-stock",
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
  },
  {
    id: "hermes-kelly-25",
    slug: "hermes-kelly-25",
    name: "Kelly 25 Sellier",
    brand: "Hermès",
    category: "bags",
    reference: "Togo, Gold Hardware",
    priceUsd: 42000,
    image: "/products/bag.jpg",
    availability: "reserved",
    isNew: true,
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
  },
];
