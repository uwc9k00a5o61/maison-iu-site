"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/lang-provider";
import { LANGS, type Lang } from "@/lib/i18n";

type Skin = "light" | "heritage";
const SKINS: { value: Skin; label: string }[] = [
  { value: "light", label: "Ivory" },
  { value: "heritage", label: "Heritage" },
];

const segWrap =
  "inline-flex items-center gap-0.5 rounded-full border border-hdr-line p-[3px]";
const segBtn =
  "rounded-full px-[13px] py-[7px] text-[10px] font-bold uppercase tracking-[0.12em] transition-colors";

export function ThemeBar() {
  const { t, lang, setLang } = useT();
  const [skin, setSkin] = React.useState<Skin>("light");

  React.useEffect(() => {
    const current = document.documentElement.getAttribute("data-skin");
    if (current === "heritage" || current === "light") setSkin(current);
  }, []);

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

  const announce = [
    t("announce.appointment"),
    t("city.Moscow"),
    t("city.Dubai"),
    t("announce.provenance"),
  ];

  return (
    <div className="themebar border-b backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-[1480px] items-center justify-between gap-3 px-5 sm:px-8">
        <div className="hidden items-center gap-x-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-hdr-fg2 md:flex">
          {announce.map((item, i) => (
            <span key={i} className="flex items-center gap-x-3">
              {i > 0 && <span className="text-foil">·</span>}
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2.5">
          {/* language */}
          <div role="group" aria-label="Language" className={segWrap}>
            {LANGS.map((l: Lang) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => setLang(l)}
                className={cn(
                  segBtn,
                  lang === l ? "bg-garnet text-cream" : "text-hdr-fg2 hover:text-hdr-fg",
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          {/* theme */}
          <div role="group" aria-label={t("bar.theme")} className={segWrap}>
            {SKINS.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={skin === s.value}
                onClick={() => applySkin(s.value)}
                className={cn(
                  segBtn,
                  skin === s.value
                    ? "bg-garnet text-cream"
                    : "text-hdr-fg2 hover:text-hdr-fg",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
