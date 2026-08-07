import type { Metadata } from "next";

import { ThemeBar } from "@/components/site/theme-bar";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";
import { HomeLanding } from "@/components/site/home-landing";
import { IntroOverlay } from "@/components/site/intro-overlay";

export const metadata: Metadata = {
  title: "MAISON IU — Fine Watches, Jewellery & Bags",
  description:
    "Original watches, jewellery and premium bags with verified provenance and full box & papers. By appointment — Moscow · Dubai · Istanbul.",
};

export default function Home() {
  return (
    <>
      <IntroOverlay />
      <ThemeBar />
      <SiteNav />
      <main className="flex-1">
        <HomeLanding />
      </main>
      <SiteFooter />
    </>
  );
}
