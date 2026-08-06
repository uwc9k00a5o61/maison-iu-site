"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-store";
import { useT } from "@/components/i18n/lang-provider";

const LINKS = [
  { href: "/catalog?category=watches", key: "nav.watches" },
  { href: "/catalog?category=jewellery", key: "nav.jewellery" },
  { href: "/catalog?category=bags", key: "nav.bags" },
];

export function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const { t } = useT();

  return (
    <header className="hdr-plate sticky top-0 z-40 border-b backdrop-blur-md">
      <nav className="mx-auto grid h-[72px] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
        {/* LEFT — burger (mobile) + wordmark (desktop) */}
        <div className="flex items-center gap-4 justify-self-start">
          <button
            type="button"
            aria-label={t("nav.menu")}
            className="flex size-8 items-center justify-center text-hdr-fg md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <Link
            href="/catalog"
            aria-label="Maison IU"
            translate="no"
            className="logo-hdr hidden text-[30px] md:block"
          >
            Maison IU
          </Link>
        </div>

        {/* CENTER — menu (desktop) / wordmark (mobile) */}
        <div className="justify-self-center">
          <ul className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-hdr-fg2 transition-colors hover:text-hdr-fg"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/catalog"
            aria-label="Maison IU"
            translate="no"
            className="logo-hdr text-[27px] md:hidden"
          >
            Maison IU
          </Link>
        </div>

        {/* RIGHT — store utilities */}
        <div className="flex items-center justify-end gap-4 justify-self-end text-hdr-fg2 sm:gap-5">
          <button aria-label={t("nav.search")} className="transition-colors hover:text-hdr-fg">
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button
            aria-label={t("nav.account")}
            className="hidden transition-colors hover:text-hdr-fg sm:block"
          >
            <User className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={`${t("nav.cart")}${count > 0 ? ` (${count})` : ""}`}
            onClick={() => setCartOpen(true)}
            className="relative transition-colors hover:text-hdr-fg"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="tabular absolute -right-2 -top-2 flex min-w-[16px] items-center justify-center rounded-full bg-garnet px-1 text-[9px] font-bold leading-[16px] text-cream">
                {count}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* mobile drawer — dark in both skins (matches home3) */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col justify-center gap-1 overflow-y-auto overscroll-contain bg-[#14110c] px-8 transition-all duration-300 md:hidden",
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <button
          type="button"
          aria-label={t("nav.close")}
          className="absolute right-6 top-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/70"
          onClick={() => setOpen(false)}
        >
          {t("nav.close")} <X className="size-4" />
        </button>
        <span
          translate="no"
          className="logo-script on-dark absolute left-8 top-5 text-[36px]"
        >
          Maison IU
        </span>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-serif text-[clamp(28px,8vw,40px)] font-semibold leading-tight text-ivory transition-colors hover:text-champ"
            onClick={() => setOpen(false)}
          >
            {t(l.key)}
          </Link>
        ))}
        <Link
          href="/catalog"
          className="font-serif text-[clamp(28px,8vw,40px)] font-semibold leading-tight text-ivory transition-colors hover:text-champ"
          onClick={() => setOpen(false)}
        >
          {t("nav.catalogue")}
        </Link>
      </div>
    </header>
  );
}
