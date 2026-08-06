import type { Metadata, Viewport } from "next";
import {
  Bodoni_Moda,
  Inter,
  Pinyon_Script,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";
import { LangProvider } from "@/components/i18n/lang-provider";
import { CartProvider } from "@/components/cart/cart-store";
import { CartSheet } from "@/components/cart/cart-sheet";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});

// Cyrillic-capable Didone serif — used for RU headings where Bodoni Moda
// lacks Cyrillic glyphs (see globals.css html[data-lang="ru"]).
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
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
      "Rolex, Patek Philippe, Audemars Piguet, Cartier, Van Cleef & Arpels & Hermès. Verified provenance, full box & papers.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4F0E7",
};

// Applied before first paint (no flash). Skin (?skin=/miu_skin) + language
// (?lang=/miu_lang, default RU). Sets data-skin/data-lang/lang + theme-color.
const APP_INIT = `(function(){try{
  var d=document.documentElement, q=new URLSearchParams(location.search);
  var qs=q.get('skin'), ls=localStorage.getItem('miu_skin');
  var s=(qs==='light'||qs==='heritage')?qs:((ls==='light'||ls==='heritage')?ls:'light');
  d.setAttribute('data-skin',s);
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute('content',s==='heritage'?'#2C0E15':'#F4F0E7');
  if(qs==='light'||qs==='heritage'){try{localStorage.setItem('miu_skin',s);}catch(e){}}
  var ql=q.get('lang'), ll=localStorage.getItem('miu_lang');
  var l=(ql==='ru'||ql==='en')?ql:((ll==='ru'||ll==='en')?ll:'ru');
  d.setAttribute('data-lang',l); d.setAttribute('lang',l);
  if(ql==='ru'||ql==='en'){try{localStorage.setItem('miu_lang',l);}catch(e){}}
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      data-skin="light"
      data-lang="ru"
      className={`${inter.variable} ${bodoni.variable} ${playfair.variable} ${pinyon.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: APP_INIT }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <LangProvider>
          <CartProvider>
            {children}
            <CartSheet />
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
