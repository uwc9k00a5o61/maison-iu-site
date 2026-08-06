import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Inter, Pinyon_Script } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-store";
import { CartSheet } from "@/components/cart/cart-sheet";

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

// Applied before first paint (no theme flash). Same localStorage key
// ('miu_skin') and ?skin= handoff as the static home3 site. Also syncs the
// theme-color meta so the mobile browser chrome matches the skin.
const SKIN_INIT = `(function(){try{
  var q=new URLSearchParams(location.search).get('skin');
  var ls=localStorage.getItem('miu_skin');
  var s=(q==='light'||q==='heritage')?q:((ls==='light'||ls==='heritage')?ls:'light');
  document.documentElement.setAttribute('data-skin',s);
  var m=document.querySelector('meta[name="theme-color"]');
  if(m)m.setAttribute('content',s==='heritage'?'#2C0E15':'#F4F0E7');
  if(q==='light'||q==='heritage'){try{localStorage.setItem('miu_skin',s);}catch(e){}}
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-skin="light"
      className={`${inter.variable} ${bodoni.variable} ${pinyon.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <script dangerouslySetInnerHTML={{ __html: SKIN_INIT }} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <CartProvider>
          {children}
          <CartSheet />
        </CartProvider>
      </body>
    </html>
  );
}
