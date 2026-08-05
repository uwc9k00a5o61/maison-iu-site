import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Search,
  ShieldCheck,
} from "lucide-react";

import { ProductImage } from "@/components/site/product-image";
import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AVAILABILITY_LABELS } from "@/lib/catalog";
import { formatPriceUsd } from "@/lib/format";
import { PRODUCTS } from "@/lib/products";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Not found" };
  return {
    title: `${product.brand} ${product.name}`,
    description: `${product.brand} ${product.name} — Ref. ${product.reference}. ${formatPriceUsd(product.priceUsd)}. Verified provenance, full box & papers.`,
  };
}

const ASSURANCES = [
  { icon: ShieldCheck, title: "Provenance verified", copy: "Authenticated in-house before listing." },
  { icon: BadgeCheck, title: "Full box & papers", copy: "Complete set, original documentation." },
  { icon: CalendarClock, title: "Private viewing", copy: "By appointment — Moscow · Dubai · Istanbul." },
];

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  return (
    <>
      <ThemeBar />
      <SiteNav />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/catalog"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg2 transition-colors hover:text-script-accent"
          >
            ← Back to catalogue
          </Link>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
            {/* gallery — single confident hero + zoom + caption (no placeholder tiles) */}
            <Reveal>
              <div className="plinth photo-vignette relative aspect-square overflow-hidden rounded-[20px] border border-panel-line">
                <ProductImage
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  sizes="(max-width:768px) 100vw, 620px"
                  className="object-cover"
                  priority
                />
                <span
                  aria-hidden
                  className="absolute right-3.5 top-3.5 z-[2] flex size-8 items-center justify-center rounded-full bg-paper/85 backdrop-blur-sm"
                >
                  <Search className="size-[15px] text-ink2" strokeWidth={1.4} />
                </span>
                <span className="absolute bottom-3.5 left-3.5 z-[2] rounded-full bg-[rgba(18,16,13,0.72)] px-[11px] py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  {product.brand} · Ref. {product.reference}
                </span>
              </div>
            </Reveal>

            {/* detail — centred on mobile, left-aligned from md up */}
            <div className="flex flex-col items-center text-center md:items-start md:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-fg2">
                {product.brand}
              </span>
              <h1 className="mt-3 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-[1.05] text-fg">
                {product.name}
              </h1>
              <span className="tabular mt-3 text-[13px] font-semibold tracking-[0.04em] text-fg2">
                Reference {product.reference}
              </span>

              {/* price + stock — Inter on mobile (legible), Bodoni on desktop (#6) */}
              <div className="mt-6 flex items-center justify-center gap-4 md:justify-start">
                <span className="tabular font-sans text-[26px] font-bold tracking-[0.01em] text-fg md:font-serif md:text-[30px] md:font-semibold md:tracking-normal">
                  {formatPriceUsd(product.priceUsd)}
                </span>
                <Badge
                  variant={
                    product.availability === "in-stock" ? "outline" : "quiet"
                  }
                  className="bg-paper/85 backdrop-blur-sm"
                >
                  {AVAILABILITY_LABELS[product.availability]}
                </Badge>
              </div>

              {/* CTAs — stacked full-width on mobile; row + nested-arrow on desktop (#6) */}
              <div className="mt-8 flex w-full flex-col gap-3 md:w-auto md:flex-row md:flex-wrap">
                <Button className="relative w-full active:translate-y-px md:w-auto md:pr-16">
                  Reserve this piece
                  <span
                    aria-hidden
                    className="absolute right-2 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 md:flex"
                  >
                    <ArrowRight className="size-4" strokeWidth={1.6} />
                  </span>
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  Enquire on Telegram
                </Button>
              </div>

              {/* specifications — divide-y list on mobile (unchanged); 2-col
                  Bodoni grid without hairlines on desktop (#5) */}
              {product.specs && product.specs.length > 0 && (
                <Reveal className="w-full">
                  <div className="mt-10 w-full">
                    <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ey">
                      Specifications
                    </h2>
                    <div className="mx-auto mt-2 h-0.5 w-10 bg-script-accent md:mx-0" />
                    <dl className="mt-4 md:grid md:grid-cols-2 md:gap-x-6 md:gap-y-5">
                      {product.specs.map((s) => (
                        <div
                          key={s.label}
                          className="flex items-baseline justify-between gap-6 border-t border-hairline py-2.5 text-left first:border-t-0 md:block md:border-0 md:p-0"
                        >
                          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-fg2 md:mb-1 md:text-[10.5px] md:tracking-[0.14em] md:text-mute">
                            {s.label}
                          </dt>
                          <dd className="text-right text-[14px] text-fg md:text-left md:font-serif md:text-[17px] md:font-medium md:leading-tight">
                            {s.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              )}

              {/* provenance / authenticity */}
              <Reveal className="w-full">
                <div className="panel mt-10 w-full rounded-[18px] border p-6 text-left">
                  <h2 className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-ey md:text-left">
                    Provenance &amp; authenticity
                  </h2>
                  <div className="mt-4 flex flex-col">
                    {ASSURANCES.map((a, i) => (
                      <div
                        key={a.title}
                        className={`flex items-start gap-3 py-2.5 ${i > 0 ? "border-t border-hairline" : ""}`}
                      >
                        <a.icon
                          className="mt-0.5 size-[18px] shrink-0 text-script-accent"
                          strokeWidth={1.5}
                        />
                        <div>
                          <p className="text-[13px] font-semibold text-fg">
                            {a.title}
                          </p>
                          <p className="text-[13px] leading-relaxed text-fg2">
                            {a.copy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
