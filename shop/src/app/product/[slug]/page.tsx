import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ShieldCheck, BadgeCheck, CalendarClock } from "lucide-react";

import { ProductImage } from "@/components/site/product-image";
import { AnnounceBar } from "@/components/site/announce-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
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

  // interim gallery: main shot + neutral plinths until client photography lands
  const gallery = [product.image, "/products/placeholder.svg", "/products/placeholder.svg"];

  return (
    <>
      <AnnounceBar />
      <SiteNav />

      <main className="flex-1">
        <div className="mx-auto max-w-[1280px] px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/catalog"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ash transition-colors hover:text-garnet"
          >
            ← Back to catalogue
          </Link>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-14">
            {/* gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-[20px] border border-line/70 bg-gradient-to-b from-[#f6f1e8] to-[#efe7d8]">
                <ProductImage
                  src={product.image}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  sizes="(max-width:768px) 100vw, 620px"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square overflow-hidden rounded-xl border bg-gradient-to-b from-[#f6f1e8] to-[#efe7d8] ${
                      i === 0 ? "border-garnet/50" : "border-line/70"
                    }`}
                  >
                    <ProductImage
                      src={src}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      sizes="200px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* detail */}
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink2">
                {product.brand}
              </span>
              <h1 className="mt-3 font-serif text-[clamp(30px,4vw,44px)] font-medium leading-[1.05] text-ink">
                {product.name}
              </h1>
              <span className="tabular mt-3 text-[13px] font-medium tracking-[0.04em] text-ash">
                Reference {product.reference}
              </span>

              <div className="mt-6 flex items-center gap-4">
                <span className="tabular font-serif text-[26px] tracking-[-0.01em] text-ink">
                  {formatPriceUsd(product.priceUsd)}
                </span>
                <Badge
                  variant={
                    product.availability === "in-stock" ? "outline" : "quiet"
                  }
                >
                  {AVAILABILITY_LABELS[product.availability]}
                </Badge>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button>Reserve this piece</Button>
                <Button variant="outline">Enquire on Telegram</Button>
              </div>

              {/* specifications */}
              {product.specs && product.specs.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ash">
                    Specifications
                  </h2>
                  <div className="mt-2 h-0.5 w-10 bg-garnet" />
                  <dl className="mt-4 divide-y divide-line">
                    {product.specs.map((s) => (
                      <div
                        key={s.label}
                        className="flex items-baseline justify-between gap-6 py-2.5"
                      >
                        <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-ash">
                          {s.label}
                        </dt>
                        <dd className="text-right text-[14px] text-ink2">
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {/* provenance / authenticity */}
              <div className="mt-10 rounded-[18px] border border-line bg-white p-6">
                <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ash">
                  Provenance &amp; authenticity
                </h2>
                <div className="mt-4 flex flex-col gap-4">
                  {ASSURANCES.map((a) => (
                    <div key={a.title} className="flex items-start gap-3">
                      <a.icon
                        className="mt-0.5 size-[18px] shrink-0 text-garnet"
                        strokeWidth={1.5}
                      />
                      <div>
                        <p className="text-[13px] font-semibold text-ink">
                          {a.title}
                        </p>
                        <p className="text-[13px] leading-relaxed text-ash">
                          {a.copy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
