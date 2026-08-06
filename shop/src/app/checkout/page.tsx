import Link from "next/link";
import type { Metadata } from "next";

import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { CheckoutClient } from "@/components/cart/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your MAISON IU enquiry privately via Telegram or WhatsApp — no online payment.",
};

export default function CheckoutPage() {
  return (
    <>
      <ThemeBar />
      <SiteNav />

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8 sm:py-14">
          <Link
            href="/catalog"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-fg2 transition-colors hover:text-script-accent"
          >
            ← Back to catalogue
          </Link>

          <header className="mt-6 mb-10 text-center sm:text-left">
            <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-ey">
              Private enquiry
            </span>
            <h1 className="mt-3 font-serif text-[clamp(30px,4vw,44px)] font-semibold leading-[1.05] text-fg">
              Checkout
            </h1>
          </header>

          <CheckoutClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
