import type { Metadata } from "next";

import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { CatalogClient } from "@/components/site/catalog-client";
import type { Category } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Fine watches, jewellery and bags — Rolex, Patek Philippe, Audemars Piguet, Cartier, Hermès. Verified provenance, $ pricing.",
};

const VALID: (Category | "all")[] = ["all", "watches", "jewellery", "bags"];
const TITLES: Record<Category | "all", string> = {
  all: "The Collection",
  watches: "Watches",
  jewellery: "Jewellery",
  bags: "Bags",
};

export default async function CatalogPage({
  searchParams,
}: PageProps<"/catalog">) {
  const sp = await searchParams;
  const raw = typeof sp.category === "string" ? sp.category : "all";
  const category = (VALID.includes(raw as Category | "all")
    ? raw
    : "all") as Category | "all";

  return (
    <>
      <ThemeBar />
      <SiteNav />

      <main className="flex-1">
        <div className="mx-auto max-w-[1480px] px-5 sm:px-8">
          {/* catalogue hero — Rolex-store calm, generous whitespace */}
          <section className="pb-6 pt-12 text-center sm:pt-16">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ey">
              Fine Watches · Jewellery · Bags
            </span>
            <h1 className="mt-3 font-serif text-[clamp(34px,5vw,52px)] font-medium leading-[1.03] text-fg">
              {TITLES[category]}
            </h1>
            <div className="mx-auto mt-4 h-0.5 w-14 bg-script-accent" />
            <p className="mt-5 text-[14px] leading-relaxed text-fg2">
              Rolex · Patek Philippe · Audemars Piguet · Cartier · Van Cleef &amp;
              Arpels · Hermès
            </p>
          </section>

          <section className="pb-24 pt-4">
            <CatalogClient initialCategory={category} />
          </section>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
