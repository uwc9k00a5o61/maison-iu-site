import type { Metadata } from "next";
import { Bodoni_Moda, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

const pinyon = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MAISON IU — Fine Watches, Jewellery & Bags",
    template: "%s · MAISON IU",
  },
  description:
    "Original watches, jewellery and premium bags with verified provenance and full box & papers. By appointment — Moscow · Dubai · Istanbul.",
  openGraph: {
    title: "MAISON IU — Fine Watches, Jewellery & Bags",
    description:
      "Rolex, Patek Philippe, Audemars Piguet, Cartier & Richard Mille. Verified provenance, full box & papers.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bodoni.variable} ${pinyon.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
