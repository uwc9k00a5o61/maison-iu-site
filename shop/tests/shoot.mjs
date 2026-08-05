import puppeteer from "puppeteer-core";

const CHROME =
  "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://localhost:3210";
const OUT = "C:/Users/MSI/AppData/Local/Temp/aionui/70be47ad/site/mobile-qa3";

const shots = [
  { name: "shop-catalog-desk", path: "/catalog", w: 1440, h: 900, mobile: false, dsf: 1 },
  { name: "shop-catalog-390", path: "/catalog", w: 390, h: 844, mobile: true, dsf: 2 },
  { name: "shop-product-390", path: "/product/rolex-datejust-36", w: 390, h: 844, mobile: true, dsf: 2 },
];

// widths to measure horizontal overflow at
const overflowWidths = [360, 390, 440];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

async function measure(page, url, width) {
  await page.setViewport({ width, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 350));
  return page.evaluate(() => {
    const de = document.documentElement;
    const scrollW = Math.max(de.scrollWidth, document.body.scrollWidth);
    const inner = window.innerWidth;
    let widest = null, maxR = 0;
    for (const el of document.querySelectorAll("*")) {
      const r = el.getBoundingClientRect().right;
      if (r > maxR) { maxR = r; widest = el.tagName + "." + (el.className && el.className.toString ? el.className.toString().split(" ").slice(0,2).join(".") : ""); }
    }
    return { scrollW, inner, overflow: Math.max(0, scrollW - inner), widestRight: Math.round(maxR), widest };
  });
}

async function autoScroll(page) {
  // trigger lazy-load: step to the bottom, then back to top
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const t = setInterval(() => {
        window.scrollBy(0, 600);
        y += 600;
        if (y >= document.body.scrollHeight + 1000) {
          clearInterval(t);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 60);
    });
  });
  await new Promise((r) => setTimeout(r, 600));
}

function countImages(page) {
  return page.evaluate(() => {
    const imgs = [...document.querySelectorAll('a[href^="/product/"] img')];
    const loaded = imgs.filter((i) => i.complete && i.naturalWidth > 1);
    const empty = imgs
      .filter((i) => !(i.complete && i.naturalWidth > 1))
      .map((i) => i.getAttribute("alt"));
    return { cards: imgs.length, loaded: loaded.length, empty };
  });
}

// screenshots + image audit
for (const s of shots) {
  const page = await browser.newPage();
  await page.setViewport({ width: s.w, height: s.h, deviceScaleFactor: s.dsf, isMobile: s.mobile, hasTouch: s.mobile });
  await page.goto(BASE + s.path, { waitUntil: "networkidle0", timeout: 60000 });
  await autoScroll(page);
  if (s.path === "/catalog") {
    const audit = await countImages(page);
    console.log("IMAGES " + s.name + " " + JSON.stringify(audit));
  }
  await page.screenshot({ path: `${OUT}/${s.name}.png`, fullPage: true });
  console.log("shot", s.name);
  await page.close();
}

// overflow report on /catalog
const page = await browser.newPage();
const report = {};
for (const w of overflowWidths) {
  report[w] = await measure(page, BASE + "/catalog", w);
}
await page.close();
console.log("OVERFLOW " + JSON.stringify(report, null, 2));

await browser.close();
