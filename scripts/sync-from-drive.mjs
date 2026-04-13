/**
 * Copia activos desde Fotos/drive (carpeta «Drive» del proyecto):
 * - Vídeo hero → Fotos/hero/master-telar.mp4
 * - Carrusel fallback → Fotos/hero-carousel/ + js/hero-carousel-data.js
 * - Galería Obra (6 carpetas) → Fotos/galeria/ + js/gallery-local-data.js
 * - Kit de telar → Fotos/kit-telar/ + js/kit-images-data.js
 * - Studio (Taller) → Fotos/studio/ + js/studio-images-data.js
 *
 * TT_DRIVE_ROOT para otra ruta.
 *
 * Tras cambiar la galería, revisa src/build/main-lineas.html: las miniaturas
 * de Líneas (salvo bordados en Fotos/lineas/bordados) usan rutas bajo Fotos/galeria/.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const DRIVE = process.env.TT_DRIVE_ROOT || path.join(root, "Fotos", "drive");
const EXTS_IMG = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif"]);

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

/** @param {string} dir */
function listSubdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/** Carpeta en drive por nombre tolerante a mayúsculas */
function resolveDriveFolder(want) {
  const subs = listSubdirs(DRIVE);
  const found = subs.find((n) => n.toLowerCase() === want.toLowerCase());
  return found ? path.join(DRIVE, found) : null;
}

function copyVideoMaster() {
  const outDir = path.join(root, "Fotos", "hero");
  if (!fs.existsSync(DRIVE)) {
    console.warn("[sync-drive] No existe:", DRIVE);
    return false;
  }
  const files = fs.readdirSync(DRIVE, { withFileTypes: true });
  const vid = files.find(
    (d) =>
      d.isFile() && /\.mp4$/i.test(d.name) && /^master\s*telar/i.test(d.name.replace(/\.mp4$/i, ""))
  );
  if (!vid) {
    console.warn("[sync-drive] No se encontró «master telar*.mp4» en la raíz de drive.");
    return false;
  }
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, "master-telar.mp4");
  fs.copyFileSync(path.join(DRIVE, vid.name), dest);
  console.log("[sync-drive] Vídeo hero →", path.relative(root, dest));
  return true;
}

/** @returns {{ id: number, name: string, image: string, price: string, currency: string, url: string, category: string }[]} */
function buildGallery() {
  const MAP = [
    { want: "Bordados", section: "bordados" },
    { want: "Dibujos", section: "dibujos" },
    { want: "Instalacion", section: "instalacion" },
    { want: "Plasticina", section: "plasticina" },
    { want: "telar", section: "telar" },
    { want: "Volumen", section: "volumen" },
  ];

  const OUT = path.join(root, "Fotos", "galeria");
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });

  const rows = [];
  let id = 2000;

  for (const { want, section } of MAP) {
    const from = resolveDriveFolder(want) || path.join(DRIVE, want);
    if (!fs.existsSync(from)) {
      console.warn("[sync-drive] Galería: omite (no existe):", want);
      continue;
    }
    const toDir = path.join(OUT, section);
    fs.mkdirSync(toDir, { recursive: true });

    const fileList = fs.readdirSync(from, { withFileTypes: true }).filter((d) => d.isFile());
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

    for (const d of fileList) {
      const ext = path.extname(d.name).toLowerCase();
      if (!EXTS_IMG.has(ext)) continue;
      const base = slug(path.basename(d.name, ext)).slice(0, 80) || "piece";
      const destName = `${id}-${base}${ext}`;
      fs.copyFileSync(path.join(from, d.name), path.join(toDir, destName));
      const webPath = `Fotos/galeria/${section}/${destName}`;
      rows.push({
        id: id++,
        name: "",
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

function buildHeroCarousel() {
  const folders = [
    "Bordados",
    "Dibujos",
    "Instalacion",
    "Plasticina",
    "Seccion kit de telar",
    "Seccion Studio",
    "telar",
    "Volumen",
  ];

  const OUT = path.join(root, "Fotos", "hero-carousel");
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  /** @type {{ image: string, url: string }[]} */
  const slides = [];
  let n = 0;
  const etsy = "https://www.etsy.com/shop/juditlarae/";

  for (const want of folders) {
    const from = resolveDriveFolder(want) || path.join(DRIVE, want);
    if (!fs.existsSync(from)) {
      console.warn("[sync-drive] Hero carousel: omite carpeta:", want);
      continue;
    }
    const fileList = fs.readdirSync(from, { withFileTypes: true }).filter((d) => d.isFile());
    fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
    for (const d of fileList) {
      const ext = path.extname(d.name).toLowerCase();
      if (!EXTS_IMG.has(ext)) continue;
      const base = slug(`${want}-${d.name}`.replace(/\.[^.]+$/, "")).slice(0, 72) || `slide-${n}`;
      const destName = `hc-${2000 + n}-${base}${ext}`;
      fs.copyFileSync(path.join(from, d.name), path.join(OUT, destName));
      const webPath = `Fotos/hero-carousel/${destName}`;
      slides.push({ image: webPath.replace(/\\/g, "/"), url: etsy });
      n += 1;
    }
  }

  return slides;
}

function copyFlatFolder(wantFolder, outRel, jsVar, outJsName) {
  const from = resolveDriveFolder(wantFolder) || path.join(DRIVE, wantFolder);
  const OUT = path.join(root, ...outRel.split("/"));
  if (fs.existsSync(OUT)) fs.rmSync(OUT, { recursive: true, force: true });
  const paths = [];
  if (!fs.existsSync(from)) {
    console.warn("[sync-drive] No existe carpeta:", wantFolder);
    fs.mkdirSync(OUT, { recursive: true });
    const outJs = path.join(root, "js", outJsName);
    fs.writeFileSync(outJs, `/* vacío — añade fotos en Fotos/drive/${wantFolder} */\nwindow.${jsVar} = [];\n`, "utf8");
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const fileList = fs.readdirSync(from, { withFileTypes: true }).filter((d) => d.isFile());
  fileList.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  let i = 0;
  for (const d of fileList) {
    const ext = path.extname(d.name).toLowerCase();
    if (!EXTS_IMG.has(ext)) continue;
    const base = slug(path.basename(d.name, ext)).slice(0, 80) || "img";
    const destName = `${3000 + i}-${base}${ext}`;
    fs.copyFileSync(path.join(from, d.name), path.join(OUT, destName));
    paths.push(`${outRel}/${destName}`.replace(/\\/g, "/"));
    i += 1;
  }
  const outJs = path.join(root, "js", outJsName);
  fs.writeFileSync(
    outJs,
    `/* Generado por scripts/sync-from-drive.mjs */\nwindow.${jsVar} = ${JSON.stringify(paths, null, 2)};\n`,
    "utf8"
  );
  console.log("[sync-drive]", wantFolder, "→", paths.length, "imágenes");
}

function main() {
  if (!fs.existsSync(DRIVE)) {
    console.warn("[sync-drive] No existe:", DRIVE);
    process.exitCode = 1;
    return;
  }

  copyVideoMaster();

  const heroSlides = buildHeroCarousel();
  const heroJs = path.join(root, "js", "hero-carousel-data.js");
  fs.writeFileSync(
    heroJs,
    `/* Generado por scripts/sync-from-drive.mjs — imágenes fallback del carrusel */\nwindow.__TT_HERO_CAROUSEL__ = ${JSON.stringify(heroSlides, null, 2)};\n`,
    "utf8"
  );
  console.log("[sync-drive] Hero carousel (fallback):", heroSlides.length, "slides");

  const galleryRows = buildGallery();
  fs.writeFileSync(
    path.join(root, "js", "gallery-local-data.js"),
    `/* Generado por scripts/sync-from-drive.mjs */\nwindow.__TT_GALLERY_LOCAL__ = ${JSON.stringify(galleryRows, null, 2)};\n`,
    "utf8"
  );
  console.log("[sync-drive] Galería Obra:", galleryRows.length, "piezas");

  copyFlatFolder("Seccion kit de telar", "Fotos/kit-telar", "__TT_KIT_IMAGES__", "kit-images-data.js");
  copyFlatFolder("Seccion Studio", "Fotos/studio", "__TT_STUDIO_IMAGES__", "studio-images-data.js");
}

main();
