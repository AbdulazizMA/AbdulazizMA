// Zero-dependency static site generator.  Usage:  node build.mjs
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cfg, layout, abs, BASE, T } from "./src/lib.mjs";
import home from "./src/pages/home.mjs";
import core from "./src/pages/core.mjs";
import areas from "./src/pages/areas.mjs";
import guides from "./src/pages/guides.mjs";
import calculator from "./src/pages/calculator.mjs";
import { AREAS } from "./src/pages/areas-data.mjs";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "dist");
const version = Date.now().toString(36);
const today = new Date().toISOString().slice(0, 10);

const pages = [home("ar"), home("en"), ...core(), ...areas(), ...guides(), ...calculator()];

// hreflang alternates: pages sharing a `key` are translations of each other
const byKey = {};
for (const p of pages) (byKey[p.key] ||= {})[p.lang] = p.path;

const footerAreas = {
  ar: AREAS.map((a) => ({ name: a.name.ar, path: `/areas/${a.slug}/` })),
  en: AREAS.map((a) => ({ name: a.name.en, path: `/en/areas/#${a.slug}` })),
};

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const seen = new Set();
for (const page of pages) {
  if (seen.has(page.path)) throw new Error(`Duplicate path ${page.path}`);
  seen.add(page.path);
  if (page.title.length > 70 && !page.noindex) console.warn(`  ! long title (${page.title.length}): ${page.path}`);
  if (page.description.length > 170) console.warn(`  ! long description (${page.description.length}): ${page.path}`);
  const html = layout(page, byKey[page.key], { version, areas: footerAreas[page.lang] });
  const file = page.file ? join(out, page.file) : join(out, page.path, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Static assets
cpSync(join(root, "src/assets"), join(out, "assets"), { recursive: true });

// sitemap.xml with hreflang annotations
const smPages = pages.filter((p) => p.sitemap !== false && !p.noindex);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${smPages
  .map((p) => {
    const alts = byKey[p.key];
    const altXml =
      Object.keys(alts).length > 1
        ? Object.entries(alts)
            .map(([l, ap]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(ap)}"/>`)
            .join("\n") + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(alts.ar || alts.en)}"/>\n`
        : "";
    return `  <url>\n    <loc>${abs(p.path)}</loc>\n    <lastmod>${p.lastmod || today}</lastmod>\n    <priority>${(p.priority ?? 0.5).toFixed(1)}</priority>\n${altXml}  </url>`;
  })
  .join("\n")}
</urlset>
`;
writeFileSync(join(out, "sitemap.xml"), sitemap);

writeFileSync(join(out, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${abs("/sitemap.xml")}\n`);

writeFileSync(
  join(out, "site.webmanifest"),
  JSON.stringify(
    {
      name: T("ar", cfg.brand),
      short_name: T("ar", cfg.name),
      lang: "ar",
      dir: "rtl",
      start_url: BASE + "/",
      display: "standalone",
      background_color: "#faf8f3",
      theme_color: "#0d3b2e",
      icons: [
        { src: BASE + "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
        { src: BASE + "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
    },
    null,
    2
  )
);

writeFileSync(join(out, ".nojekyll"), "");
if (cfg.customDomain) writeFileSync(join(out, "CNAME"), cfg.customDomain + "\n");

// Internal link check — fail the build on any broken internal link
let broken = 0;
for (const page of pages) {
  const file = page.file ? join(out, page.file) : join(out, page.path, "index.html");
  const html = readFileSync(file, "utf8");
  for (const [, href] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (!href.startsWith(BASE + "/") && !(BASE === "" && href.startsWith("/"))) continue;
    if (href.startsWith("//")) continue;
    let local = href.slice(BASE.length).split(/[?#]/)[0];
    if (local.endsWith("/")) local += "index.html";
    if (!existsSync(join(out, local))) {
      console.error(`  ✗ broken link in ${page.path}: ${href}`);
      broken++;
    }
  }
}
if (broken) {
  console.error(`\n${broken} broken internal link(s).`);
  process.exit(1);
}

console.log(`✓ Built ${pages.length} pages → ${out}`);
console.log(`  Site URL: ${abs("/")}`);
