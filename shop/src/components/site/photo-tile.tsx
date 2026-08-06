"use client";

import { cn } from "@/lib/utils";
import { useT } from "@/components/i18n/lang-provider";

/**
 * Honest branded placeholder shown while real photography is pending
 * (imagePending). Theme-aware via globals tokens only — no fake logos or
 * dials. Swap to a real photo by setting `image` + `imagePending: false`.
 */
export function PhotoTile({
  brand,
  reference,
  variant = "card",
  className,
}: {
  brand: string;
  reference: string;
  variant?: "card" | "hero" | "mini";
  className?: string;
}) {
  const { t } = useT();
  // compact thumbnail (e.g. cart line) — script mark only, keeps the
  // branded ground consistent with the catalogue placeholder
  if (variant === "mini") {
    return (
      <div
        className={cn(
          "plinth tile-rings absolute inset-0 flex items-center justify-center",
          className,
        )}
      >
        <span translate="no" className="tile-script relative text-[15px]">
          Maison IU
        </span>
      </div>
    );
  }

  const hero = variant === "hero";
  return (
    <div
      className={cn(
        "plinth tile-rings absolute inset-0 z-[1] flex flex-col items-center justify-center px-4 text-center",
        className,
      )}
    >
      <div className="relative flex flex-col items-center">
        <span
          translate="no"
          className={cn("tile-script", hero ? "text-[clamp(44px,8vw,72px)]" : "text-[30px]")}
        >
          Maison IU
        </span>
        <span
          className={cn("block bg-foil", hero ? "my-3.5 h-px w-10" : "my-2 h-px w-7")}
        />
        <span
          className={cn(
            "font-bold uppercase text-fg2",
            hero
              ? "text-[12px] tracking-[0.14em]"
              : "text-[9px] tracking-[0.12em]",
          )}
        >
          {brand} · Ref. {reference}
        </span>
        <span
          className={cn(
            "font-semibold uppercase text-ey",
            hero
              ? "mt-2.5 text-[10px] tracking-[0.16em]"
              : "mt-1.5 text-[7.5px] tracking-[0.12em]",
          )}
        >
          {t("tile.pending")}
        </span>
      </div>
    </div>
  );
}
