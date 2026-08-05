import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3210";
const HOME3 = "file:///C:/Users/MSI/AppData/Local/Temp/aionui/70be47ad/site/home3.html";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

// --- shop overflow sweep, both themes, both pages ---
const paths = { catalog: "/catalog", product: "/product/rolex-datejust-36" };
for (const skin of ["light", "heritage"]) {
  for (const [k, p] of Object.entries(paths)) {
    const line = [];
    for (const w of [360, 390, 440]) {
      const pg = await browser.newPage();
      await pg.setViewport({ width: w, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await pg.goto(`${BASE}${p}?skin=${skin}`, { waitUntil: "networkidle0", timeout: 60000 });
      await new Promise((r) => setTimeout(r, 250));
      const of = await pg.evaluate(() => Math.max(0, Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth));
      line.push(`${w}=${of}`);
      await pg.close();
    }
    console.log(`SHOP ${skin} ${k} overflow: ${line.join(" ")}`);
  }
}

// --- home3 static check: JS errors, theme-color + data-skin toggle ---
{
  const page = await browser.newPage();
  const jsErrors = [];
  page.on("pageerror", (e) => jsErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && !/net::ERR|Failed to load resource/.test(m.text())) jsErrors.push(m.text());
  });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
  await page.goto(`${HOME3}?skin=heritage&intro=0`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 800));
  const her = await page.evaluate(() => ({
    skin: document.documentElement.getAttribute("data-skin"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
    colorScheme: getComputedStyle(document.documentElement).colorScheme,
    hasSkip: !!document.querySelector("a.skip"),
    translateNo: document.querySelector(".brandmark")?.getAttribute("translate"),
    imgLazy: document.querySelector(".gcell img")?.getAttribute("loading"),
  }));
  // toggle to light
  await page.evaluate(() => {
    const b = [...document.querySelectorAll(".seg-b")].find((x) => x.dataset.skin === "light");
    b && b.click();
  });
  await new Promise((r) => setTimeout(r, 300));
  const lite = await page.evaluate(() => ({
    skin: document.documentElement.getAttribute("data-skin"),
    themeColor: document.querySelector('meta[name="theme-color"]')?.getAttribute("content"),
  }));
  console.log(`HOME3 heritage=${JSON.stringify(her)} afterToggle=${JSON.stringify(lite)} jsErrors=${jsErrors.length}${jsErrors.length ? " :: " + jsErrors.join(" | ") : ""}`);
  await page.close();
}

await browser.close();
