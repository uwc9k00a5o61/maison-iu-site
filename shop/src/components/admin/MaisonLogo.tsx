import React from "react";
import { Pinyon_Script } from "next/font/google";

// Load Pinyon in the component itself so the admin logo always renders in the
// script face (an @import in admin CSS never reached this context → cursive
// fallback / Comic Sans). next/font self-hosts + applies the family directly.
const pinyon = Pinyon_Script({ subsets: ["latin"], weight: "400", display: "swap" });

/**
 * Login-screen brand mark — replaces the default Payload logo.
 * Colour/size in src/app/(payload)/custom.scss (.miu-brand).
 */
export function MaisonLogo() {
  return (
    <span className={`miu-brand miu-brand--logo ${pinyon.className}`} translate="no">
      Maison IU
    </span>
  );
}
