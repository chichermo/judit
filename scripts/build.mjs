/**
 * Ensambla las páginas HTML desde src/build/* (cabecera, pie y metadatos compartidos).
 * Ejecutar antes de desplegar: npm run build
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const buildDir = path.join(root, "src", "build");

function read(relFromRoot) {
  return fs.readFileSync(path.join(root, ...relFromRoot.split("/")), "utf8");
}

function readB(rel) {
  return fs.readFileSync(path.join(buildDir, rel), "utf8");
}

function escAttr(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;");
}

function siteOrigin() {
  if (process.env.SITE_ORIGIN) return process.env.SITE_ORIGIN.replace(/\/$/, "");
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) {
    const u = prod.replace(/\/$/, "");
    return u.startsWith("http") ? u : `https://${u}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  try {
    const pkg = JSON.parse(read("package.json"));
    if (pkg.homepage) return String(pkg.homepage).replace(/\/$/, "");
  } catch {
    /* noop */
  }
  return "";
}

const ORIGIN = siteOrigin();

function absUrl(pathname) {
  if (!ORIGIN) return pathname;
  return `${ORIGIN}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

function headBlock({ title, description, path: pathname, ogImage }) {
  const canonical = absUrl(pathname);
  const imagePath = ogImage || "/Logos/logo-marca.png";
  const ogImageUrl = absUrl(imagePath);
  const lines = [
    `    <title>${escAttr(title)}</title>`,
    `    <meta name="description" content="${escAttr(description)}" />`,
  ];
  if (ORIGIN) lines.push(`    <link rel="canonical" href="${escAttr(canonical)}" />`);
  lines.push(`    <meta property="og:type" content="website" />`);
  if (ORIGIN) lines.push(`    <meta property="og:url" content="${escAttr(canonical)}" />`);
  lines.push(`    <meta property="og:title" id="meta-og-title" content="${escAttr(title)}" />`);
  lines.push(`    <meta property="og:description" id="meta-og-desc" content="${escAttr(description)}" />`);
  lines.push(`    <meta property="og:image" content="${escAttr(ogImageUrl)}" />`);
  lines.push(`    <meta property="og:locale" content="es_ES" />`);
  lines.push(`    <meta name="twitter:card" content="summary_large_image" />`);
  lines.push(`    <meta name="twitter:title" id="meta-tw-title" content="${escAttr(title)}" />`);
  lines.push(`    <meta name="twitter:description" id="meta-tw-desc" content="${escAttr(description)}" />`);
  lines.push(`    <meta name="twitter:image" content="${escAttr(ogImageUrl)}" />`);

  const graph = [
    {
      "@type": "WebSite",
      name: "Tormenta Telar",
      description: description.slice(0, 280),
      inLanguage: ["es", "en", "nl", "fr", "de"],
    },
    {
      "@type": "Person",
      name: "Judit Lara",
      jobTitle: "Artista textil",
      sameAs: [
        "https://www.instagram.com/tormentatelar/",
        "https://www.etsy.com/shop/juditlarae/",
      ],
    },
  ];
  if (ORIGIN) {
    graph[0].url = `${ORIGIN}/`;
    graph[1].url = ORIGIN;
  }
  const jsonLd = { "@context": "https://schema.org", "@graph": graph };
  lines.push(`    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`);
  return lines.join("\n");
}

const fabBlock = `    <a
      class="fab-wa"
      href="https://wa.me/32470530362"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
    >
      <svg class="fab-wa-icon" viewBox="0 0 24 24" aria-hidden="true" width="28" height="28">
        <path
          fill="currentColor"
          d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.718 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.882 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
        />
      </svg>
      <span class="fab-wa-label" data-i18n="wa.label">WhatsApp</span>
    </a>
`;

function navPlaceholders(active) {
  const keys = ["HOME", "STUDIO", "LINES", "WORK", "CONTACT"];
  const map = Object.fromEntries(keys.map((k) => [`__NAV_${k}__`, ""]));
  const up = active.toUpperCase();
  if (map[`__NAV_${up}__`] !== undefined) map[`__NAV_${up}__`] = ' aria-current="page"';
  return map;
}

function applyNav(template, active) {
  let out = template;
  const ph = navPlaceholders(active);
  for (const [k, v] of Object.entries(ph)) {
    out = out.split(k).join(v);
  }
  return out;
}

function breadcrumb(slug) {
  const map = {
    studio: { i18n: "nav.studio", label: "Taller" },
    lines: { i18n: "nav.lines", label: "Líneas" },
    work: { i18n: "nav.work", label: "Obra" },
    contact: { i18n: "nav.contact", label: "Contacto" },
  };
  if (!slug || !map[slug]) return "";
  const { i18n, label } = map[slug];
  return `    <div class="container breadcrumb-wrap">
      <nav class="breadcrumb" aria-label="Miga de pan">
        <ol class="breadcrumb-list">
          <li><a href="index.html" data-i18n="nav.home">Inicio</a></li>
          <li aria-current="page"><span data-i18n="${i18n}">${label}</span></li>
        </ol>
      </nav>
    </div>
`;
}

function pageHtml(opts) {
  const {
    outfile,
    bodyAttrs,
    headTitle,
    headDesc,
    path: pathname,
    navActive,
    footerName,
    mainFile,
    preMainDecor,
    afterMain,
    scripts,
  } = opts;

  const headMeta = headBlock({ title: headTitle, description: headDesc, path: pathname });
  const headAssets = readB("head-assets.html");
  let header = applyNav(readB("header.html"), navActive);
  const footer = readB(footerName === "home" ? "footer-home.html" : "footer-sub.html");
  const main = readB(mainFile);
  const crumbSlug = { HOME: "", STUDIO: "studio", LINES: "lines", WORK: "work", CONTACT: "contact" }[navActive];
  const crumb = breadcrumb(crumbSlug || "");

  let scriptsHtml;
  if (scripts === "gallery") {
    scriptsHtml = `    <script src="js/studio-bio.js"></script>
    <script src="js/products-data.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/main.js"></script>`;
  } else if (scripts === "home") {
    scriptsHtml = `    <script src="js/studio-bio.js"></script>
    <script src="js/products-data.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/main.js"></script>`;
  } else {
    scriptsHtml = `    <script src="js/studio-bio.js"></script>
    <script src="js/i18n.js"></script>
    <script src="js/main.js"></script>`;
  }

  const extra = afterMain || "";

  return `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#f7f5f1" />
${headMeta}
${headAssets}
  </head>
  <body${bodyAttrs}>
    <a class="skip-link" href="#main">Saltar al contenido</a>

${preMainDecor}
${header}
    <main id="main" class="main-content">
${crumb}${main}
    </main>

${footer}

${fabBlock}
${extra}
${scriptsHtml}
  </body>
</html>
`;
}

/** Metadatos por defecto (es); i18n actualiza título y descripción en cliente. */
const pages = [
  {
    outfile: "index.html",
    bodyAttrs: ' data-page="home"',
    headTitle: "Tormenta Telar — Arte textil y dibujo · Judit Lara",
    headDesc:
      "Taller de Judit Lara en Lovaina: bordado, telar, dibujo e ilustración. Arte textil entre Chile y Europa.",
    path: "/",
    navActive: "HOME",
    footerName: "home",
    mainFile: "main-index.html",
    preMainDecor: `    <div class="grain" aria-hidden="true"></div>
    <div class="cursor-glow" id="cursor-glow" aria-hidden="true"></div>
`,
    afterMain: "",
    scripts: "home",
  },
  {
    outfile: "taller.html",
    bodyAttrs: ' class="page-sub" data-page="taller"',
    headTitle: "Taller · Tormenta Telar",
    headDesc:
      "El atelier de Judit Lara en Lovaina: bordado, telar, dibujo en papel y piezas de volumen. Raíces chilenas, mirada europea.",
    path: "/taller.html",
    navActive: "STUDIO",
    footerName: "sub",
    mainFile: "main-taller.html",
    preMainDecor: `    <div class="grain" aria-hidden="true"></div>
`,
    afterMain: "",
    scripts: "sub",
  },
  {
    outfile: "lineas.html",
    bodyAttrs: ' class="page-sub" data-page="lineas"',
    headTitle: "Líneas de trabajo · Tormenta Telar",
    headDesc:
      "Explora el archivo por líneas: bordado, telar, papel y arcilla. Acceso directo a la galería filtrada.",
    path: "/lineas.html",
    navActive: "LINES",
    footerName: "sub",
    mainFile: "main-lineas.html",
    preMainDecor: `    <div class="grain" aria-hidden="true"></div>
`,
    afterMain: "",
    scripts: "sub",
  },
  {
    outfile: "obra.html",
    bodyAttrs: ' class="page-sub" data-page="obra"',
    headTitle: "Obra · Tormenta Telar",
    headDesc:
      "Galería de piezas únicas: bordado, tejido, dibujo y volumen. Envíos desde la tienda Etsy de Judit Lara.",
    path: "/obra.html",
    navActive: "WORK",
    footerName: "sub",
    mainFile: "main-obra.html",
    preMainDecor: `    <div class="grain" aria-hidden="true"></div>
`,
    afterMain: readB("obra-lightbox.html"),
    scripts: "gallery",
  },
  {
    outfile: "contacto.html",
    bodyAttrs: ' class="page-sub" data-page="contact"',
    headTitle: "Contacto · Tormenta Telar",
    headDesc:
      "Contacto, Instagram y WhatsApp. Tormenta Telar — Judit Lara, taller textil en Lovaina, Bélgica.",
    path: "/contacto.html",
    navActive: "CONTACT",
    footerName: "sub",
    mainFile: "main-contacto.html",
    preMainDecor: `    <div class="grain" aria-hidden="true"></div>
`,
    afterMain: "",
    scripts: "sub",
  },
];

/** Salida para Vercel (outputDirectory: public) + raíz del repo para desarrollo local. */
const publicDir = path.join(root, "public");
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(publicDir, { recursive: true });

for (const dir of ["css", "js", "Logos", "Fotos", "assets"]) {
  const srcPath = path.join(root, dir);
  if (fs.existsSync(srcPath)) {
    fs.cpSync(srcPath, path.join(publicDir, dir), { recursive: true });
  }
}

for (const p of pages) {
  const html = pageHtml(p);
  fs.writeFileSync(path.join(root, p.outfile), html, "utf8");
  fs.writeFileSync(path.join(publicDir, p.outfile), html, "utf8");
  console.log("written", p.outfile, "(raíz + public/)");
}

console.log("Activos estáticos copiados en public/");

if (!ORIGIN) {
  console.warn(
    "[build] Sin SITE_ORIGIN / VERCEL_URL / package.json homepage: canonical y og:url omiten URL absoluta. Configura «homepage» en package.json."
  );
}
