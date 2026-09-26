// Screenshots + JS error check.  node tools/qa.mjs <baseUrl> <outDir>
import { chromium } from "playwright";
const [base, dir] = process.argv.slice(2);
import { readdirSync, statSync } from "node:fs";
const walk = (d, pre = "") => readdirSync(d).flatMap((f) => (statSync(`${d}/${f}`).isDirectory() ? walk(`${d}/${f}`, `${pre}/${f}`) : f === "index.html" ? [pre + "/"] : []));
const pages = walk(new URL("../dist", import.meta.url).pathname);
const b = await chromium.launch();
let errors = 0;
for (const [name, vp] of [["desk", { width: 1366, height: 900 }], ["mob", { width: 390, height: 844 }]]) {
  const ctx = await b.newContext({ viewport: vp });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => { errors++; console.log("PAGEERROR", p.url(), e.message); });
  p.on("console", (m) => m.type() === "error" && console.log("CONSOLE", p.url(), m.text()));
  for (const path of pages) {
    await p.goto(base + path, { waitUntil: "networkidle" });
    const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    if (overflow) console.log("H-OVERFLOW", name, path);
    await p.screenshot({ path: `${dir}/${name}${path.replace(/\//g, "_") || "_"}.png`, fullPage: true });
  }
  await ctx.close();
}
// calculator behaviour
const p = await b.newPage();
await p.goto(base + "/tools/roi-calculator/");
const get = () => p.$$eval("output", (os) => Object.fromEntries(os.map((o) => [o.dataset.k, o.value])));
console.log("calc default", await get());
await p.fill('input[name="ltv"]', "70");
console.log("calc 70% LTV", await get(), "finHidden:", await p.$eval(".fin-only", (e) => e.hidden));
console.log("wa link:", decodeURIComponent((await p.$eval("#roi-send", (a) => a.href)).split("text=")[1]).slice(0, 200));
// form behaviour
await p.goto(base + "/contact/");
let opened = null;
await p.exposeFunction("__cap", (u) => (opened = u));
await p.evaluate(() => (window.open = (u) => window.__cap(u)));
await p.click("#brief button[type=submit]");
console.log("empty submit opened:", opened);
await p.fill('[name="name"]', "Test");
await p.fill('[name="phone"]', "0500000000");
await p.click('label.chip:has-text("دخل شهري")');
await p.click('label.chip:has-text("عمارة")');
await p.selectOption('[name="budget"]', { index: 3 });
await p.selectOption('[name="when"]', { index: 2 });
await p.click('label.chip:has-text("كاش")');
await p.click("#brief button[type=submit]");
await p.waitForTimeout(300);
console.log("form wa:", opened && decodeURIComponent(opened.split("text=")[1]));
await b.close();
console.log("page errors:", errors);
