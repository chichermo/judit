/**
 * Copia imágenes del archivo local (Drive) a Fotos/galeria/<sección>/
 * y genera js/gallery-local-data.js (una categoría por carpeta del archivo).
 *
 * Solo se sincronizan las carpetas listadas en MAP (las del Drive acordadas).
 * Origen: Fotos/Archivo de arte-20260408T085331Z-3-001/Archivo de arte
 * o TT_ARCHIVE_ROOT.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const ARCHIVE_ROOT =
  process.env.TT_ARCHIVE_ROOT ||
  path.join(root, "Fotos", "Archivo de arte-20260408T085331Z-3-001", "Archivo de arte");

const OUT = path.join(root, "Fotos", "galeria");
const EXTS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

/** Carpeta en Drive → id de sección (carpeta destino + category en datos) */
const MAP = [
  { src: "Bordado", section: "bordado" },
  { src: "Dibujos", section: "dibujos" },
  { src: "Dibujo sin marco", section: "dibujo-sin-marco" },
  { src: "monstruos", section: "monstruos" },
  { src: "Obras", section: "obras" },
  { src: "Piedras", section: "piedras" },
  { src: "Plasticina", section: "plasticina" },
];

function slug(s) {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9._-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function collect() {
  if (!fs.existsSync(ARCHIVE_ROOT)) {
    console.warn("[sync-gallery] No existe el archivo en:", ARCHIVE_ROOT);
    console.warn("  Exporta TT_ARCHIVE_ROOT o descomprime el Drive en la ruta esperada.");
    return [];
  }

  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }

  /** @type {{ id: number, name: string, image: string, price: string, currency: string, url: string, category: string }[]} */
  const rows = [];
  let id = 2000;

  for (const { src, section } of MAP) {
    const from = path.join(ARCHIVE_ROOT, src);
    if (!fs.existsSync(from)) {
      console.warn("[sync-gallery] Omite (no existe):", from);
      continue;
    }
    const toDir = path.join(OUT, section);
    fs.mkdirSync(toDir, { recursive: true });

    const files = fs.readdirSync(from, { withFileTypes: true });
    for (const d of files) {
      if (!d.isFile()) continue;
      const ext = path.extname(d.name).toLowerCase();
      if (!EXTS.has(ext)) continue;

      const base = slug(path.basename(d.name, ext)).slice(0, 80) || "piece";
      const destName = `${id}-${base}${ext}`;
      const srcPath = path.join(from, d.name);
      const destPath = path.join(toDir, destName);
      fs.copyFileSync(srcPath, destPath);

      const webPath = `Fotos/galeria/${section}/${destName}`;
      const title = path.basename(d.name, ext).replace(/[_]/g, " ");
      rows.push({
        id: id++,
        name: `${title} · Tormenta Telar`,
        image: webPath.replace(/\\/g, "/"),
        price: "",
        currency: "EUR",
        url: "https://www.etsy.com/shop/juditlarae/",
        category: section,
      });
    }
  }

  return rows;
}

const data = collect();
const outJs = path.join(root, "js", "gallery-local-data.js");
const body = `/* Generado por scripts/sync-gallery-fotos.mjs — no editar a mano */
window.__TT_GALLERY_LOCAL__ = ${JSON.stringify(data, null, 2)};
`;
fs.writeFileSync(outJs, body, "utf8");
console.log("[sync-gallery] Entradas:", data.length, "→", path.relative(root, outJs));
if (data.length) console.log("[sync-gallery] Imágenes en:", path.relative(root, OUT));
