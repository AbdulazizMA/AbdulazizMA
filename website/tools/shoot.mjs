// Screenshot helper:  node tools/shoot.mjs <url> <outPrefix> <width> <height> [maxShots]
// Takes sequential viewport-sized shots down the page.
import { chromium } from "playwright";
const [url, out, w, h, n = "1"] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, reducedMotion: "reduce" });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
const H = await p.evaluate(() => document.documentElement.scrollHeight);
for (let i = 0; i < +n && i * +h < H; i++) {
  await p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), i * +h);
  await p.waitForTimeout(150);
  await p.screenshot({ path: `${out}-${i}.png` });
}
console.log(url, "height", H);
await b.close();
