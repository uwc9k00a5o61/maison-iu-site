import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = process.env.BASE || "http://localhost:3210";
const OUT = "C:/Users/MSI/AppData/Local/Temp/aionui/70be47ad/site/mobile-qa3";

const PAGES = [
  { key: "catalog", path: "/catalog" },
  { key: "product", path: "/product/rolex-datejust-36" },
];
const SKINS = ["light", "heritage"];
const VIEWS = [
  { tag: "desk", w: 1440, h: 900, mobile: false, dsf: 1 },
  { tag: "390", w: 390, h: 844, mobile: true, dsf: 2 },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

async function autoScroll(page) {
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
      }, 50);
    });
  });
  await new Promise((r) => setTimeout(r, 500));
}

function measureOverflow(page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const scrollW = Math.max(de.scrollWidth, document.body.scrollWidth);
    return { scrollW, inner: window.innerWidth, overflow: Math.max(0, scrollW - window.innerWidth) };
  });
}
function countImages(page) {
  return page.evaluate(() => {
    const imgs = [...document.querySelectorAll('a[href^="/product/"] img')];
    const loaded = imgs.filter((i) => i.complete && i.naturalWidth > 1);
    return { cards: imgs.length, loaded: loaded.length };
  });
}

for (const pg of PAGES) {
  for (const skin of SKINS) {
    for (const v of VIEWS) {
      const page = await browser.newPage();
      await page.setViewport({ width: v.w, height: v.h, deviceScaleFactor: v.dsf, isMobile: v.mobile, hasTouch: v.mobile });
      await page.goto(`${BASE}${pg.path}?skin=${skin}`, { waitUntil: "networkidle0", timeout: 60000 });
      await autoScroll(page);
      const skinAttr = await page.evaluate(() => document.documentElement.getAttribute("data-skin"));
      const name = `shop-${pg.key}-${v.tag}-${skin}`;
      await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
      let extra = "";
      if (pg.key === "catalog") extra = " img=" + JSON.stringify(await countImages(page));
      const of = await measureOverflow(page);
      console.log(`shot ${name} skin=${skinAttr} overflow=${of.overflow}${extra}`);
      await page.close();
    }
  }
}

// toggle interaction + persistence test (light -> click Heritage)
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/catalog`, { waitUntil: "networkidle0", timeout: 60000 });
  const before = await page.evaluate(() => document.documentElement.getAttribute("data-skin"));
  await page.evaluate(() => {
    const btns = [...document.querySelectorAll('[role="group"][aria-label="Theme"] button')];
    const her = btns.find((b) => b.textContent.trim().toLowerCase() === "heritage");
    her && her.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const after = await page.evaluate(() => ({
    attr: document.documentElement.getAttribute("data-skin"),
    ls: localStorage.getItem("miu_skin"),
    url: location.search,
  }));
  console.log(`TOGGLE before=${before} afterAttr=${after.attr} localStorage=${after.ls} url=${after.url}`);
  await page.close();
}

await browser.close();
