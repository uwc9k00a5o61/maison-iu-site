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
          <CheckoutClient />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
