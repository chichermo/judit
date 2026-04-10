const fs = require("fs");
const path = require("path");

/** Listados de Etsy excluidos de la web (no mostrar en Obra / productos). */
const BLOCK_LISTING_IDS = new Set([
  "4477483282",
  "4477480752",
  "4477469729",
  "4477474830",
  "4477469854",
  "4477467426",
  "4477438970",
]);

const htmlPath = path.join(
  __dirname,
  "..",
  "old",
  "JuditLarae - Etsy Bélgica.html"
);
const h = fs.readFileSync(htmlPath, "utf8");
const scripts = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
  (m) => m[1]
);
let items = [];
for (const raw of scripts) {
  try {
    const j = JSON.parse(raw);
    if (j["@type"] === "ItemList" && Array.isArray(j.itemListElement)) {
      items = j.itemListElement
        .map((x) => ({
          name: x.item.name,
          image: x.item.image,
          price: x.item.offers?.price,
          currency: x.item.offers?.priceCurrency,
          url: x.item.url,
        }))
        .filter((row) => {
          const m = String(row.url || "").match(/listing\/(\d+)/);
          return !m || !BLOCK_LISTING_IDS.has(m[1]);
        })
        .map((row, i) => ({ ...row, id: i + 1 }));
      break;
    }
  } catch (_) {}
}
const dir = path.join(__dirname, "..", "js");
fs.mkdirSync(dir, { recursive: true });
const jsonPath = path.join(dir, "products-data.json");
fs.writeFileSync(jsonPath, JSON.stringify(items, null, 2), "utf8");
const jsPath = path.join(dir, "products-data.js");
fs.writeFileSync(
  jsPath,
  `window.__TT_PRODUCTS__ = ${JSON.stringify(items)};\n`,
  "utf8"
);
console.log("wrote", items.length, "items to", jsonPath, "and", jsPath);
