import React from "react";
import { Pinyon_Script } from "next/font/google";

const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap" });

/**
 * Compact nav/header brand mark — replaces the default Payload icon.
 * Styled in src/app/(payload)/custom.scss (.miu-brand--icon).
 */
export function MaisonIcon() {
  return (
    <span className={`miu-brand miu-brand--icon ${pinyon.className}`} translate="no">
      Maison IU
    </span>
  );
}
