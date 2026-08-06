"use client";

import * as React from "react";

import {
  DEFAULT_LANG,
  type Lang,
  piecesLabel,
  translate,
} from "@/lib/i18n";

interface LangCtx {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  pieces: (n: number) => string;
}

const Ctx = React.createContext<LangCtx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR + first client render use DEFAULT_LANG to avoid hydration mismatch;
  // the pre-paint script has already set <html data-lang> — we adopt it here.
  const [lang, setLangState] = React.useState<Lang>(DEFAULT_LANG);

  React.useEffect(() => {
    const attr = document.documentElement.getAttribute("data-lang");
    if (attr === "ru" || attr === "en") setLangState(attr);
  }, []);

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.setAttribute("lang", next);
    try {
      localStorage.setItem("miu_lang", next);
    } catch {}
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url);
    } catch {}
  }, []);

  const value = React.useMemo<LangCtx>(
    () => ({
      lang,
      setLang,
      t: (key, vars) => translate(lang, key, vars),
      pieces: (n) => piecesLabel(n, lang),
    }),
    [lang, setLang],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useT(): LangCtx {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useT must be used within <LangProvider>");
  return ctx;
}
