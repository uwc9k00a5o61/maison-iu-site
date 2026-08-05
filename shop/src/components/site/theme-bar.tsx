"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type Skin = "light" | "heritage";
const SKINS: { value: Skin; label: string }[] = [
  { value: "light", label: "Ivory" },
  { value: "heritage", label: "Heritage" },
];

const ANNOUNCE = ["By appointment", "Moscow", "Dubai", "Provenance verified"];

export function ThemeBar() {
  const [skin, setSkin] = React.useState<Skin>("light");

  // sync from the pre-paint init script on mount
  React.useEffect(() => {
    const current = document.documentElement.getAttribute("data-skin");
    if (current === "heritage" || current === "light") setSkin(current);
  }, []);

  function apply(next: Skin) {
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

  return (
    <div className="themebar border-b backdrop-blur-md">
      <div className="mx-auto flex h-11 max-w-[1480px] items-center justify-between gap-3 px-5 sm:px-8">
        <div className="hidden items-center gap-x-3 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-hdr-fg2 sm:flex">
          {ANNOUNCE.map((item, i) => (
            <span key={item} className="flex items-center gap-x-3">
              {i > 0 && <span className="text-foil">·</span>}
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-hdr-fg2">
            Theme
          </span>
          <div
            role="group"
            aria-label="Theme"
            className="inline-flex items-center gap-0.5 rounded-full border border-hdr-line p-[3px]"
          >
            {SKINS.map((s) => {
              const on = skin === s.value;
              return (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => apply(s.value)}
                  className={cn(
                    "rounded-full px-[15px] py-[7px] text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors",
                    on
                      ? "bg-garnet text-cream"
                      : "text-hdr-fg2 hover:text-hdr-fg",
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
