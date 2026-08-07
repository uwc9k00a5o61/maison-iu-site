import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { ProductDetail } from "@/components/site/product-detail";
import { formatPriceUsd } from "@/lib/format";
import { getProductBySlug } from "@/lib/products-data";

// CMS-backed with 60s ISR; pages render on demand and cache, so new SKUs
// added in the admin become reachable without a redeploy.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.brand} ${product.name}`,
    description: `${product.brand} ${product.name} — Ref. ${product.reference}. ${formatPriceUsd(product.priceUsd)}. Verified provenance, full box & papers.`,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <ThemeBar />
      <SiteNav />
      <main id="main" className="flex-1">
        <ProductDetail product={product} />
      </main>
      <SiteFooter />
    </>
  );
}
