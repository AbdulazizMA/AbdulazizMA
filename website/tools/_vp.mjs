import { chromium } from "playwright";
const [url, out, w, h, scroll] = process.argv.slice(2);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), +(scroll || 0));
await p.waitForTimeout(200);
await p.screenshot({ path: out });
await b.close();
