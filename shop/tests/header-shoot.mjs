import puppeteer from "puppeteer-core";
import { mkdirSync } from "fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://localhost:3231";
const OUT = process.env.OUT || "C:/Users/MSI/AppData/Local/Temp/miu-header-qa";
mkdirSync(OUT, { recursive: true });

const SKINS = ["light", "heritage"];
const WIDTHS = [360, 390, 440];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

let fail = 0;
async function check(pathname, expectHeaderLogo, tag) {
  for (const skin of SKINS) {
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([
        { name: "prefers-reduced-motion", value: "reduce" }, // skip intro overlay
      ]);
      await page.setViewport({ width: w, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      const errors = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      await page.goto(`${BASE}${pathname}?skin=${skin}`, { waitUntil: "networkidle0", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 300));

      const m = await page.evaluate(() => {
        const headerLogos = [...document.querySelectorAll("header .logo-hdr")].filter((e) => e.getClientRects().length);
        const heroBrand = document.querySelector("main")?.textContent?.includes("Maison IU") ?? false;
        const de = document.documentElement;
        const overflow = Math.max(0, Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth);
        return { headerLogoCount: headerLogos.length, heroBrand, overflow };
      });

      if (w === 390) {
        await page.screenshot({ path: `${OUT}/${tag}-390-${skin}.png` });
      }

      const logoOk = expectHeaderLogo ? m.headerLogoCount >= 1 : m.headerLogoCount === 0;
      const ok = logoOk && m.overflow === 0 && errors.length === 0;
      if (!ok) fail++;
      console.log(
        `${ok ? "PASS" : "FAIL"} ${tag}-${w}-${skin} | headerLogo=${m.headerLogoCount} (expect ${expectHeaderLogo ? "≥1" : "0"}) | heroBrand=${m.heroBrand} | overflow=${m.overflow} | errors=${errors.length}`,
      );
      await page.close();
    }
  }
}

await check("/", false, "home");
await check("/catalog", true, "catalog");

await browser.close();
console.log(fail === 0 ? "\nALL HEADER CHECKS PASSED" : `\n${fail} HEADER CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
