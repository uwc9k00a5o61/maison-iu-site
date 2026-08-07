/* Based on the Payload-generated admin layout, extended with brand fonts. */
import type { ServerFunctionClient } from "payload";

import config from "@payload-config";
import "@payloadcms/next/css";
import {
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import { Inter, Pinyon_Script, Playfair_Display } from "next/font/google";
import React from "react";

import { importMap } from "./admin/importMap.js";
import "./custom.scss";

// Load the brand fonts reliably in the ADMIN context via next/font (self-hosted
// + preloaded) — an @import in custom.scss did not reach the admin document, so
// the script logo fell back to cursive. Exposed as CSS variables consumed by
// custom.scss (.miu-fonts).
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--miu-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--miu-playfair",
  display: "swap",
});
const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--miu-pinyon",
  display: "swap",
});

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    {/* display:contents → provides the font CSS variables to the whole admin
        subtree without introducing a layout box */}
    <div
      className={`miu-fonts ${inter.variable} ${playfair.variable} ${pinyon.variable}`}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  </RootLayout>
);

export default Layout;
