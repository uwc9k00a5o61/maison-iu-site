"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import { Reveal } from "@/components/site/reveal";
import { useT } from "@/components/i18n/lang-provider";
import { telegramUrl, whatsappUrl } from "@/lib/contacts";

const SECTION = "mx-auto w-full max-w-[1480px] px-5 sm:px-8";

const CATEGORIES = [
  { key: "watches", img: "/products/watch-01.jpg", sub: "home.cat.watches.sub", label: "nav.watches" },
  { key: "jewellery", img: "/products/necklace.jpg", sub: "home.cat.jewellery.sub", label: "nav.jewellery" },
  { key: "bags", img: "/products/bag.jpg", sub: "home.cat.bags.sub", label: "nav.bags" },
] as const;

export function HomeLanding() {
  const { t } = useT();
  const concierge =
    "MAISON IU — интерес к персональному подбору / interest in personal sourcing";

  return (
    <>
      {/* ---------- HERO ---------- */}
      <header id="main" className={`${SECTION} pb-[clamp(44px,6vw,68px)] pt-[clamp(56px,10vw,112px)] text-center`}>
        <Reveal>
          <span className="block text-[10px] font-semibold uppercase leading-[2] tracking-[0.36em] text-ey">
            {t("home.hero.eyebrow1")}
            <br />
            {t("home.hero.eyebrow2")}
          </span>
        </Reveal>
        <Reveal delay={80}>
          <div
            translate="no"
            className="mx-auto mt-[22px] mb-1.5 font-script text-[clamp(58px,12.5vw,142px)] leading-[0.86] text-fg"
            style={{
              WebkitTextStroke: "0.85px currentColor",
              paintOrder: "stroke fill",
            }}
          >
            Maison IU
          </div>
        </Reveal>
        <Reveal delay={140}>
          <div className="mx-auto my-[30px] flex items-center justify-center gap-3.5">
            <span className="h-px w-[clamp(22px,6vw,60px)] bg-foil opacity-85" />
            <span className="whitespace-nowrap font-serif text-[clamp(10px,1.4vw,12.5px)] font-semibold uppercase tracking-[0.34em] text-ey">
              {t("catalog.eyebrow")}
            </span>
            <span className="h-px w-[clamp(22px,6vw,60px)] bg-foil opacity-85" />
          </div>
        </Reveal>
        <Reveal delay={200}>
          <h1 className="font-serif text-[clamp(33px,5.2vw,62px)] font-medium leading-[0.98] tracking-[-0.022em] text-fg">
            {t("home.hero.title")}
          </h1>
        </Reveal>
        <Reveal delay={260}>
          <p className="mx-auto mt-[22px] mb-8 max-w-[42ch] text-[16px] leading-[1.8] text-fg2">
            {t("home.hero.slogan")}
          </p>
        </Reveal>
        <Reveal delay={320}>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-4">
            <Link
              href="/catalog"
              className="group inline-flex min-h-[54px] items-center justify-center rounded-full bg-garnet py-0 pl-[30px] pr-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream transition-transform duration-300 hover:-translate-y-0.5"
            >
              {t("home.hero.ctaPrimary")}
              <span className="ml-3.5 inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/15 text-[14px] transition-transform duration-300 group-hover:translate-x-[3px]">
                →
              </span>
            </Link>
            <Link
              href="#appt"
              className="border-b border-foil pb-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-fg2 transition-colors hover:border-fg hover:text-fg"
            >
              {t("home.hero.ctaSecondary")}
            </Link>
          </div>
        </Reveal>
      </header>

      {/* ---------- CATEGORY TILES ---------- */}
      <section className={`${SECTION} py-[clamp(40px,7vw,80px)]`} id="cat">
        <div className="mb-[18px] flex justify-end">
          <Reveal>
            <Link
              href="/catalog"
              className="border-b border-foil pb-[3px] text-[11px] font-semibold uppercase tracking-[0.14em] text-script-accent"
            >
              {t("home.cat.allLink")} →
            </Link>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-[clamp(16px,2.2vw,26px)] sm:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <Reveal key={c.key} delay={i * 90}>
              <Link
                href={`/catalog?category=${c.key}`}
                className="panel group relative block overflow-hidden rounded-[20px] border p-1.5"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[15px] plinth">
                  <Image
                    src={c.img}
                    alt={t(c.label)}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5 rounded-[12px] border border-white/20 bg-black/35 px-5 py-2.5 text-center text-white backdrop-blur-md">
                  <span className="text-[9.5px] font-semibold uppercase tracking-[0.24em] opacity-85">
                    {t(c.sub)}
                  </span>
                  <span className="font-serif text-[clamp(21px,5vw,25px)] font-semibold leading-[1.05]">
                    {t(c.label)}
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- TRUST ROW ---------- */}
      <section className={`${SECTION} py-[clamp(40px,7vw,80px)]`}>
        <Reveal>
          <div className="grid grid-cols-1 border-y border-hairline sm:grid-cols-3">
            {[
              { k: "12", l: t("home.trust.years.l"), tab: true },
              { k: "Box & Papers", l: t("home.trust.set.l"), tab: false },
              { k: "3", l: t("home.trust.cities.l"), tab: true },
            ].map((s, i) => (
              <div
                key={i}
                className={`px-[clamp(14px,3vw,44px)] py-[clamp(28px,4vw,44px)] text-center ${
                  i > 0
                    ? "border-t border-hairline sm:border-l sm:border-t-0"
                    : ""
                }`}
              >
                <div
                  className={`font-serif text-[clamp(28px,3.9vw,46px)] font-semibold leading-none text-fg ${
                    s.tab ? "tabular" : ""
                  }`}
                >
                  {s.k}
                </div>
                <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.2em] text-fg2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- CONCIERGE ---------- */}
      <section className={`${SECTION} py-[clamp(40px,7vw,80px)]`}>
        <Reveal>
          <div
            id="appt"
            className="panel rounded-[24px] border px-[clamp(28px,5vw,68px)] py-[clamp(48px,7vw,84px)] text-center"
          >
            <div className="mx-auto mb-[22px] h-0.5 w-10 rounded-sm bg-script-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-script-accent">
              {t("home.appt.eyebrow")}
            </span>
            <h2 className="mt-3 font-serif text-[clamp(30px,4.6vw,50px)] font-semibold leading-[1.04] tracking-[-0.01em] text-fg">
              {t("home.appt.title")}
            </h2>
            <p className="mx-auto mb-7 mt-4 max-w-[46ch] text-[15.5px] leading-[1.7] text-fg2">
              {t("home.appt.copy")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={telegramUrl(concierge)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-garnet px-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-cream transition-transform duration-300 hover:-translate-y-0.5"
              >
                Telegram
              </a>
              <a
                href={whatsappUrl(concierge)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-foil px-8 text-[12px] font-semibold uppercase tracking-[0.14em] text-fg transition-colors hover:border-fg"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
