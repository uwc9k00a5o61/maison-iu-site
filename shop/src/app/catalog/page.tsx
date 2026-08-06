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

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1480px] px-5 pb-24 sm:px-8">
          <CatalogClient initialCategory={category} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
