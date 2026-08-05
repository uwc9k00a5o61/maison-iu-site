import puppeteer from "puppeteer-core";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE = "http://localhost:3210";
const OUT = "C:/Users/MSI/AppData/Local/Temp/aionui/70be47ad/site/mobile-qa3";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: "new",
  args: ["--hide-scrollbars", "--no-sandbox"],
});

for (const skin of ["light", "heritage"]) {
  const page = await browser.newPage();
  const errors = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 1, isMobile: false, hasTouch: false });
  await page.goto(`${BASE}/catalog?skin=${skin}`, { waitUntil: "networkidle0", timeout: 60000 });

  // theme-color meta + color-scheme reflect skin
  const meta = await page.evaluate(() => {
    const m = document.querySelector('meta[name="theme-color"]');
    return {
      themeColor: m ? m.getAttribute("content") : null,
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      skin: document.documentElement.getAttribute("data-skin"),
    };
  });

  // keyboard focus → ring visible. Tab a few times, snapshot focused element outline.
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await new Promise((r) => setTimeout(r, 450)); // let transition-colors settle
  const focus = await page.evaluate(() => {
    const el = document.activeElement;
    const cs = getComputedStyle(el);
    let fv = false;
    try { fv = el.matches(":focus-visible"); } catch {}
    return {
      tag: el.tagName,
      focusVisible: fv,
      outlineWidth: cs.outlineWidth,
      outlineColor: cs.outlineColor,
      focusRingVar: getComputedStyle(document.documentElement).getPropertyValue("--focus-ring").trim(),
      text: (el.textContent || "").trim().slice(0, 24),
    };
  });
  await page.screenshot({ path: `${OUT}/shop-focus-${skin}.png` });

  console.log(`skin=${skin} meta=${JSON.stringify(meta)} focus=${JSON.stringify(focus)} consoleErrors=${errors.length}${errors.length ? " :: " + errors.join(" | ") : ""}`);
  await page.close();
}

await browser.close();
