import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://localhost:3230";
const OUT = process.env.OUT || "C:/Users/MSI/AppData/Local/Temp/miu-menu-qa";
import { mkdirSync } from "fs";
mkdirSync(OUT, { recursive: true });

const SKINS = ["light", "heritage"];
const WIDTHS = [360, 390, 440];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

let fail = 0;
for (const skin of SKINS) {
  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 800, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(`${BASE}/catalog?skin=${skin}`, { waitUntil: "networkidle0", timeout: 60000 });

    // open the drawer
    await page.click('header button[aria-expanded]');
    await new Promise((r) => setTimeout(r, 450));

    const m = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const r = d.getBoundingClientRect();
      const style = getComputedStyle(d);
      const links = [...d.querySelectorAll("a")];
      const vis = links.filter((a) => {
        const b = a.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && b.top >= -1 && b.bottom <= window.innerHeight + 1;
      });
      const toggles = d.querySelectorAll('[role="group"] button').length;
      const de = document.documentElement;
      const overflow = Math.max(0, Math.max(de.scrollWidth, document.body.scrollWidth) - window.innerWidth);
      return {
        drawerH: Math.round(r.height),
        drawerW: Math.round(r.width),
        winH: window.innerHeight,
        winW: window.innerWidth,
        opacity: style.opacity,
        bg: style.backgroundColor,
        totalLinks: links.length,
        visibleLinks: vis.length,
        linkTexts: links.map((a) => a.textContent.trim()),
        toggles,
        overflow,
      };
    });

    const name = `menu-${w}-${skin}`;
    await page.screenshot({ path: `${OUT}/${name}.png` });

    const fullH = m.drawerH >= m.winH - 2;
    const allVisible = m.visibleLinks === m.totalLinks && m.totalLinks >= 4;
    const ok = fullH && allVisible && m.overflow === 0 && m.opacity === "1" && errors.length === 0 && m.toggles === 4;
    if (!ok) fail++;
    console.log(
      `${ok ? "PASS" : "FAIL"} ${name} | drawerH=${m.drawerH}/${m.winH} fullH=${fullH} | links ${m.visibleLinks}/${m.totalLinks} | toggles=${m.toggles} | overflow=${m.overflow} | opacity=${m.opacity} | bg=${m.bg} | errors=${errors.length} | [${m.linkTexts.join(", ")}]`,
    );

    // close test
    await page.click('[role="dialog"] button[aria-label]');
    await new Promise((r) => setTimeout(r, 400));
    const closed = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      const s = getComputedStyle(d);
      return s.opacity === "0" || s.visibility === "hidden";
    });
    console.log(`   close ${name}: ${closed ? "OK (hidden)" : "FAIL (still visible)"}`);
    if (!closed) fail++;
    await page.close();
  }
}

await browser.close();
console.log(fail === 0 ? "\nALL MENU CHECKS PASSED" : `\n${fail} MENU CHECK(S) FAILED`);
process.exit(fail === 0 ? 0 : 1);
