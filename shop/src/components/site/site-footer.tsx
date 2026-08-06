"use client";

import { useT } from "@/components/i18n/lang-provider";

export function SiteFooter() {
  const { t } = useT();
  return (
    <footer className="foot-skin border-t border-[rgba(244,240,231,0.14)] text-[#cfc9bc]">
      <div className="mx-auto flex max-w-[1480px] flex-wrap items-end justify-between gap-5 px-5 py-12 text-[12.5px] sm:px-8">
        <span translate="no" className="logo-script on-dark text-[30px]">
          Maison IU
        </span>
        <span className="max-w-[44ch]">{t("footer.tagline")}</span>
        <span className="uppercase tracking-[0.16em]">
          {t("city.Moscow")} · {t("city.Dubai")} · {t("city.Istanbul")}
        </span>
      </div>
    </footer>
  );
}
