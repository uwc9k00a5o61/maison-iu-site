"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart/cart-store";
import { useT } from "@/components/i18n/lang-provider";
import { LANGS, type Lang } from "@/lib/i18n";

const LINKS = [
  { href: "/catalog?category=watches", key: "nav.watches" },
  { href: "/catalog?category=jewellery", key: "nav.jewellery" },
  { href: "/catalog?category=bags", key: "nav.bags" },
];

type Skin = "light" | "heritage";

export function SiteNav() {
  const [open, setOpen] = React.useState(false);
  const { count, setOpen: setCartOpen } = useCart();
  const { t, lang, setLang } = useT();
  const [skin, setSkin] = React.useState<Skin>("light");
  // On the home page the hero IS the brand mark, so the header wordmark is
  // hidden to avoid two stacked "Maison IU" logos. Every other page (no hero)
  // keeps the header logo.
  const isHome = usePathname() === "/";

  React.useEffect(() => {
    const current = document.documentElement.getAttribute("data-skin");
    if (current === "heritage" || current === "light") setSkin(current);
  }, []);

  // Body scroll-lock while the drawer is open.
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function applySkin(next: Skin) {
    setSkin(next);
    document.documentElement.setAttribute("data-skin", next);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", next === "heritage" ? "#2C0E15" : "#F4F0E7");
    }
    try {
      localStorage.setItem("miu_skin", next);
    } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("skin", next);
      window.history.replaceState(null, "", url);
    } catch {}
  }

  const seg = "inline-flex items-center gap-0.5 rounded-full border border-ivory/25 p-[3px]";
  const segBtn = "rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors";

  return (
    <>
      <header className="hdr-plate sticky top-0 z-40 border-b backdrop-blur-md">
        <nav className="mx-auto grid h-[72px] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
          {/* LEFT — burger (mobile) + wordmark (desktop) */}
          <div className="flex items-center gap-4 justify-self-start">
            <button
              type="button"
              aria-label={t("nav.menu")}
              aria-expanded={open}
              className="flex size-8 items-center justify-center text-hdr-fg md:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
            {!isHome && (
              <Link
                href="/"
                aria-label="Maison IU"
                translate="no"
                className="logo-hdr hidden text-[30px] md:block"
              >
                Maison IU
              </Link>
            )}
          </div>

          {/* CENTER — menu (desktop) / wordmark (mobile, hidden on home) */}
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
            {!isHome && (
              <Link
                href="/"
                aria-label="Maison IU"
                translate="no"
                className="logo-hdr text-[27px] md:hidden"
              >
                Maison IU
              </Link>
            )}
          </div>

          {/* RIGHT — store utilities */}
          <div className="flex items-center justify-end gap-4 justify-self-end text-hdr-fg2 sm:gap-5">
            <button aria-label={t("nav.search")} className="transition-colors hover:text-hdr-fg">
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            <Link
              href="/account"
              aria-label={t("nav.account")}
              className="hidden transition-colors hover:text-hdr-fg sm:block"
            >
              <User className="size-[18px]" strokeWidth={1.5} />
            </Link>
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
      </header>

      {/* mobile drawer — sibling of <header> (NOT a child), so its fixed
          positioning resolves against the viewport, not the header's
          backdrop-filter containing block. Full-screen, opaque, both skins. */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        className={cn(
          "fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-[#14110c] transition-opacity duration-300 md:hidden",
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="flex min-h-full flex-col px-8 pb-10 pt-6">
          {/* top bar: brand + close (in flow — no overlap, no double logo) */}
          <div className="flex items-center justify-between">
            <span translate="no" className="logo-script on-dark text-[30px]">
              Maison IU
            </span>
            <button
              type="button"
              aria-label={t("nav.close")}
              className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/70 transition-colors hover:text-ivory"
              onClick={() => setOpen(false)}
            >
              {t("nav.close")} <X className="size-4" />
            </button>
          </div>

          {/* links — centered, scroll if they ever overflow */}
          <nav className="flex flex-1 flex-col justify-center gap-1 py-10">
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
            <Link
              href="/account"
              className="mt-1 font-serif text-[clamp(22px,6vw,30px)] font-medium leading-tight text-ivory/80 transition-colors hover:text-champ"
              onClick={() => setOpen(false)}
            >
              {t("nav.account")}
            </Link>
          </nav>

          {/* language + theme toggles */}
          <div className="flex flex-wrap items-center gap-3 border-t border-ivory/15 pt-6">
            <div role="group" aria-label="Language" className={seg}>
              {LANGS.map((l: Lang) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={lang === l}
                  onClick={() => setLang(l)}
                  className={cn(
                    segBtn,
                    lang === l ? "bg-garnet text-cream" : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <div role="group" aria-label={t("bar.theme")} className={seg}>
              {(["light", "heritage"] as Skin[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={skin === s}
                  onClick={() => applySkin(s)}
                  className={cn(
                    segBtn,
                    skin === s ? "bg-garnet text-cream" : "text-ivory/70 hover:text-ivory",
                  )}
                >
                  {s === "light" ? "Ivory" : "Heritage"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
