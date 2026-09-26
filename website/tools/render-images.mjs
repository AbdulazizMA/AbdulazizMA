// Renders og.png + app icons with the pre-installed Chromium.
// Re-run after changing your name/brand:  node tools/render-images.mjs
import { chromium } from "playwright";
import { readFileSync } from "node:fs";
import cfg from "../config.mjs";

const svg = readFileSync(new URL("../src/assets/favicon.svg", import.meta.url), "utf8");
const out = (f) => new URL(`../src/assets/${f}`, import.meta.url).pathname;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();

for (const size of [180, 192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `).replace('rx="10"', 'rx="0"')}</body>`);
  await page.screenshot({ path: out(`icon-${size}.png`) });
}

await page.setViewportSize({ width: 1200, height: 630 });
await page.setContent(`<!doctype html><html dir="rtl" lang="ar"><head>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=block" rel="stylesheet">
<style>
body{margin:0;width:1200px;height:630px;font-family:"IBM Plex Sans Arabic",sans-serif;background:#0d3b2e;color:#fff;display:flex;overflow:hidden;position:relative}
.g{position:absolute;inset:0;background:radial-gradient(700px 400px at 90% 0%,rgba(201,164,92,.35),transparent 60%),radial-gradient(600px 400px at 0% 100%,rgba(255,255,255,.07),transparent 60%)}
.c{position:relative;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;width:100%}
.top{display:flex;align-items:center;gap:20px;font-size:30px;font-weight:600}
.top svg{width:72px;height:72px}
h1{font-size:74px;line-height:1.2;margin:0;font-weight:700}
h1 span{color:#c9a45c}
p{font-size:30px;margin:14px 0 0;color:#cfe0d7}
.b{display:flex;gap:16px;font-size:24px}
.b div{border:1.5px solid rgba(255,255,255,.3);border-radius:999px;padding:8px 22px}
</style></head><body><div class="g"></div><div class="c">
<div class="top">${svg}<span>${cfg.brand.ar}</span></div>
<div><h1>وسيط عقاري يمثّل <span>المستثمر</span><br>في ${cfg.city.ar}</h1><p>بحث · تحليل عائد · تفاوض · متابعة حتى الإفراغ</p></div>
<div class="b"><div>رخصة فال ${cfg.falLicense}</div><div>استشارة أولى مجانية</div></div>
</div></body></html>`);
await page.waitForLoadState("networkidle").catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out("og.png") });
await browser.close();
console.log("✓ Rendered og.png and icons");
