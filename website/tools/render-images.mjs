// Renders og.png + app icons with Chromium (Playwright).
// Re-run after changing your name:  node tools/render-images.mjs
import { chromium } from "playwright";
import { readFileSync, writeFileSync, unlinkSync } from "node:fs";
import cfg from "../config.mjs";

const svg = readFileSync(new URL("../src/assets/favicon.svg", import.meta.url), "utf8");
const out = (f) => new URL(`../src/assets/${f}`, import.meta.url).pathname;
const fontsDir = new URL("../src/assets/fonts/", import.meta.url).href;
const fontCss = readFileSync(new URL("../src/assets/styles.css", import.meta.url), "utf8")
  .split("/* ===")[0]
  .replace(/url\(fonts\//g, `url(${fontsDir}`);
const browser = await chromium.launch();
const page = await browser.newPage();

for (const size of [180, 192, 512]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0;background:#0f1c18">${svg.replace("<svg ", `<svg width="${size}" height="${size}" `).replace('rx="9"', 'rx="0"')}</body>`);
  await page.screenshot({ path: out(`icon-${size}.png`) });
}

const pattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg fill='none' stroke='%23b8904a' stroke-opacity='.16'%3E%3Crect x='18' y='18' width='28' height='28'/%3E%3Cpath d='M32 12 52 32 32 52 12 32Z M32 0v12M32 52v12M0 32h12M52 32h12'/%3E%3C/g%3E%3C/svg%3E")`;
const fee = String(cfg.feePercent).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]).replace(".", "٫");
await page.setViewportSize({ width: 1200, height: 630 });
const ogHtml = `<!doctype html><html dir="rtl" lang="ar"><head>
<style>${fontCss}</style>
<style>
body{margin:0;width:1200px;height:630px;font-family:"IBM Plex Sans Arabic",sans-serif;background:#0f1c18 ${pattern};color:#d5ded9;display:flex;overflow:hidden;position:relative}
.g{position:absolute;inset:0;background:radial-gradient(640px 380px at 92% 0%,rgba(184,144,74,.3),transparent 70%),linear-gradient(90deg,rgba(15,28,24,0) 40%,rgba(15,28,24,.85))}
.c{position:relative;padding:64px 76px;display:flex;flex-direction:column;justify-content:space-between;width:100%}
.top{display:flex;align-items:center;gap:18px}
.top b{font:800 34px "Noto Kufi Arabic";color:#fff}
.top small{display:block;font-size:20px;color:#9fb0a8}
h1{font:800 84px/1.25 "Noto Kufi Arabic";margin:0;color:#fff}
h1 em{font-style:normal;color:#dcc08a}
.b{display:flex;gap:14px;font-size:24px}
.b div{border:1.5px solid rgba(184,144,74,.5);border-radius:999px;padding:8px 24px;color:#dcc08a}
</style></head><body><div class="g"></div><div class="c">
<div class="top">${svg.replace("<svg ", '<svg width="78" height="78" ')}<div><b>${cfg.name.ar}</b><small>${cfg.role.ar}</small></div></div>
<h1>أمثّل المستثمر.<br><em>لا البائع.</em></h1>
<div class="b"><div>${cfg.cities.map((c) => c.ar).join(" · ")}</div><div>أتعاب ${fee}٪ عند الإفراغ فقط</div><div>استشارة أولى مجانية</div></div>
</div></body></html>`;
const tmp = new URL("../src/assets/_og.html", import.meta.url);
writeFileSync(tmp, ogHtml);
await page.goto(tmp.href);
unlinkSync(tmp);
await page.waitForLoadState("networkidle").catch(() => {});
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out("og.png") });
await browser.close();
console.log("✓ Rendered og.png and icons");
