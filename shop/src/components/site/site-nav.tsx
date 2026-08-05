"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/catalog?category=watches", label: "Watches" },
  { href: "/catalog?category=jewellery", label: "Jewellery" },
  { href: "/catalog?category=bags", label: "Bags" },
];

export function SiteNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <nav className="mx-auto grid h-[72px] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
        {/* LEFT — burger (mobile) + wordmark (desktop) */}
        <div className="flex items-center gap-4 justify-self-start">
          <button
            type="button"
            aria-label="Menu"
            className="flex size-8 items-center justify-center md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5 text-ink" strokeWidth={1.5} />
          </button>
          <Link
            href="/catalog"
            aria-label="Maison IU"
            className="logo-script hidden text-[30px] md:block"
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
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink2 transition-colors hover:text-garnet"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/catalog"
            aria-label="Maison IU"
            className="logo-script text-[27px] md:hidden"
          >
            Maison IU
          </Link>
        </div>

        {/* RIGHT — store utilities */}
        <div className="flex items-center justify-end gap-4 justify-self-end sm:gap-5">
          <button aria-label="Search" className="text-ink transition-colors hover:text-garnet">
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button
            aria-label="Account"
            className="hidden text-ink transition-colors hover:text-garnet sm:block"
          >
            <User className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button aria-label="Cart" className="text-ink transition-colors hover:text-garnet">
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
          </button>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.14em] text-ash lg:inline">
            <b className="text-ink">RU</b> · EN
          </span>
        </div>
      </nav>

      {/* mobile drawer */}
      <div
        className={cn(
          "fixed inset-0 z-50 flex flex-col justify-center gap-1 bg-paper px-8 transition-all duration-300 md:hidden",
          open
            ? "visible opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="Close"
          className="absolute right-6 top-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ash"
          onClick={() => setOpen(false)}
        >
          Close <X className="size-4" />
        </button>
        <span className="logo-script absolute left-8 top-5 text-[36px]">
          Maison IU
        </span>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-serif text-[clamp(28px,8vw,40px)] font-semibold leading-tight text-ink transition-colors hover:text-garnet"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </Link>
        ))}
        <Link
          href="/catalog"
          className="font-serif text-[clamp(28px,8vw,40px)] font-semibold leading-tight text-ink transition-colors hover:text-garnet"
          onClick={() => setOpen(false)}
        >
          Catalogue
        </Link>
      </div>
    </header>
  );
}
