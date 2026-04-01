/**
 * Tormenta Telar — i18n (es, en, nl, fr, de)
 */
(function () {
  "use strict";

  const STORAGE_KEY = "tt-lang";
  const DEFAULT = "es";
  const SUPPORTED = ["es", "en", "nl", "fr", "de"];

  const LOCALE_NUMBER = {
    es: "es-ES",
    en: "en-GB",
    nl: "nl-BE",
    fr: "fr-BE",
    de: "de-BE",
  };

  /** @type {Record<string, Record<string, string>>} */
  const STRINGS = {
    es: {
      "meta.title": "Tormenta Telar — Arte textil y dibujo · Judit Lara",
      "meta.description":
        "Taller de Judit Lara en Lovaina: bordado, telar, dibujo e ilustración. Arte textil entre Chile y Europa.",
      "meta.titleTaller": "Taller · Tormenta Telar",
      "meta.titleLineas": "Líneas de trabajo · Tormenta Telar",
      "meta.titleObra": "Obra · Tormenta Telar",
      "meta.titleContact": "Contacto · Tormenta Telar",
      "meta.descInner":
        "Tormenta Telar — Judit Lara. Bordado, telar y dibujo. Lovaina, Bélgica.",
      "footer.home": "Inicio",
      "lineas.hint": "Entra en la galería ya filtrada por cada línea.",
      "a11y.skip": "Saltar al contenido",
      "a11y.menu": "Menú",
      "a11y.brandHome": "Tormenta Telar, inicio",
      "a11y.navMain": "Principal",
      "a11y.filterGroup": "Filtrar por línea",
      "a11y.lightbox": "Vista ampliada de obra",
      "a11y.close": "Cerrar",
      "a11y.prev": "Anterior",
      "a11y.next": "Siguiente",
      "a11y.lang": "Idioma del sitio",
      "a11y.wa": "Contactar por WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Inicio",
      "nav.studio": "Taller",
      "nav.lines": "Líneas",
      "nav.work": "Obra",
      "nav.contact": "Contacto",
      "shop.online": "Tienda online",
      "brand.tag": "taller textil",
      "hero.kicker": "Judit Lara · Lovaina, Bélgica",
      "hero.lead":
        "Hilo, trama y papel: piezas únicas donde conviven el bordado, el telar y el dibujo — raíces chilenas y mirada europea.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.ctaWork": "Ver obra",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textil · bordado · telar · papel",
      "hero.imgAlt": "Obra del taller Tormenta Telar",
      "marquee.a": "Bordado manual",
      "marquee.b": "Tejido mapuche contemporáneo",
      "marquee.c": "Dibujo e ilustración",
      "marquee.d": "Lovaina",
      "about.rail": "taller · obra",
      "about.title": "Un taller entre <em>dos orillas</em>",
      "about.lead":
        "<strong>Tormenta Telar</strong> es el espacio de Judit Lara: artista textil chilena en <strong>Lovaina</strong>. Disciplinas lentas —puntada, telar, trazo— que piden tacto y tiempo.",
      "about.p2":
        "Un nombre que imagina fuerza y trama: tradición y experimentación en el mismo lienzo. Piezas para contemplar y vivir en casa.",
      "pillar1.title": "Bordado",
      "pillar1.desc": "Motivos cercanos al dibujo infantil, marcos cuadrados y textura densa.",
      "pillar2.title": "Telar",
      "pillar2.desc": "Runners y tapices actuales con ecos mapuche y color audaz.",
      "pillar3.title": "Papel",
      "pillar3.desc": "Geometría, línea y color; piezas en varios formatos, incluido A4.",
      "pillar4.title": "Volumen",
      "pillar4.desc": "Arcilla polimérica y piezas mixtas en formato reducido.",
      "collections.title": "Líneas de trabajo",
      "collections.intro":
        "Filtra la galería. En la ficha ampliada encontrarás enlace a detalle, medidas y envío.",
      "cat.all": "Todo",
      "cat.bordado": "Bordado",
      "cat.telar": "Telar",
      "cat.dibujo": "Papel",
      "cat.arcilla": "Volumen",
      "gallery.title": "Obra",
      "gallery.hintHtml":
        "Pulsa para ampliar. Teclado: <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> <span class=\"kbd\">Esc</span>",
      "gallery.pieces": "piezas",
      "contact.title": "Contacto",
      "contact.lead":
        "Encargos y dudas: escribe por Instagram; allí se comparte el día a día del taller.",
      "contact.shopNote":
        "Para disponibilidad y compra con envío, usa el botón <strong>Tienda online</strong> de la cabecera.",
      "contact.location": "Taller · Lovaina, Bélgica",
      "contact.cardLabel": "Seguir el taller",
      "contact.instagramBtn": "@tormentatelar",
      "footer.top": "Arriba",
      "footer.ig": "Instagram",
      "lightbox.detail": "Ficha completa →",
    },
    en: {
      "meta.title": "Tormenta Telar — Textile art & drawing · Judit Lara",
      "meta.description":
        "Judit Lara’s studio in Leuven: embroidery, weaving, drawing and illustration. Contemporary textile work between Chile and Europe.",
      "meta.titleTaller": "Studio · Tormenta Telar",
      "meta.titleLineas": "Lines of work · Tormenta Telar",
      "meta.titleObra": "Work · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Embroidery, loom, drawing. Leuven, Belgium.",
      "footer.home": "Home",
      "lineas.hint": "Open the gallery filtered for each line.",
      "a11y.skip": "Skip to content",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, home",
      "a11y.navMain": "Main",
      "a11y.filterGroup": "Filter by line",
      "a11y.lightbox": "Enlarged artwork view",
      "a11y.close": "Close",
      "a11y.prev": "Previous",
      "a11y.next": "Next",
      "a11y.lang": "Site language",
      "a11y.wa": "Contact on WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Home",
      "nav.studio": "Studio",
      "nav.lines": "Lines",
      "nav.work": "Work",
      "nav.contact": "Contact",
      "shop.online": "Online shop",
      "brand.tag": "textile studio",
      "hero.kicker": "Judit Lara · Leuven, Belgium",
      "hero.lead":
        "Thread, weave and paper: one-off pieces where embroidery, loom work and drawing meet — Chilean roots, European eye.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.ctaWork": "View work",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textile · embroidery · loom · paper",
      "hero.imgAlt": "Work from the Tormenta Telar studio",
      "marquee.a": "Hand embroidery",
      "marquee.b": "Contemporary Mapuche weaving",
      "marquee.c": "Drawing & illustration",
      "marquee.d": "Leuven",
      "about.rail": "studio · work",
      "about.title": "A studio between <em>two shores</em>",
      "about.lead":
        "<strong>Tormenta Telar</strong> is Judit Lara’s space: a Chilean textile artist based in <strong>Leuven</strong>. Slow crafts — stitch, loom, line — that ask for touch and time.",
      "about.p2":
        "A name that imagines force and weave: tradition and experiment sharing the same cloth. Pieces to live with.",
      "pillar1.title": "Embroidery",
      "pillar1.desc": "Motifs close to childlike drawing, square frames, rich texture.",
      "pillar2.title": "Weaving",
      "pillar2.desc": "Contemporary runners and tapestries with Mapuche echoes and bold colour.",
      "pillar3.title": "Paper",
      "pillar3.desc": "Geometry, line and colour across formats, including A4.",
      "pillar4.title": "Volume",
      "pillar4.desc": "Polymer clay and mixed media in small scale.",
      "collections.title": "Bodies of work",
      "collections.intro":
        "Filter the gallery. The enlarged view links to full details, sizing and shipping.",
      "cat.all": "All",
      "cat.bordado": "Embroidery",
      "cat.telar": "Weave",
      "cat.dibujo": "Paper",
      "cat.arcilla": "Volume",
      "gallery.title": "Work",
      "gallery.hintHtml":
        "Tap to enlarge. Keyboard: <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> <span class=\"kbd\">Esc</span>",
      "gallery.pieces": "pieces",
      "contact.title": "Contact",
      "contact.lead":
        "Commissions and questions: message on Instagram — that’s where daily studio life lives.",
      "contact.shopNote":
        "For availability and shipped orders, use the <strong>Online shop</strong> button in the header.",
      "contact.location": "Studio · Leuven, Belgium",
      "contact.cardLabel": "Follow the studio",
      "contact.instagramBtn": "@tormentatelar",
      "footer.top": "Top",
      "footer.ig": "Instagram",
      "lightbox.detail": "Full details →",
    },
    nl: {
      "meta.title": "Tormenta Telar — Textielkunst en tekening · Judit Lara",
      "meta.description":
        "Atelier van Judit Lara in Leuven: borduurwerk, weven, tekening en illustratie. Hedendaagse textiel tussen Chili en Europa.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleLineas": "Werklijnen · Tormenta Telar",
      "meta.titleObra": "Werk · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Leuven, België.",
      "footer.home": "Home",
      "lineas.hint": "Open de galerij gefilterd per lijn.",
      "a11y.skip": "Naar inhoud",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, home",
      "a11y.navMain": "Hoofdnavigatie",
      "a11y.filterGroup": "Filter op lijn",
      "a11y.lightbox": "Vergrote weergave",
      "a11y.close": "Sluiten",
      "a11y.prev": "Vorige",
      "a11y.next": "Volgende",
      "a11y.lang": "Taal van de site",
      "a11y.wa": "Contact via WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Home",
      "nav.studio": "Atelier",
      "nav.lines": "Lijnen",
      "nav.work": "Werk",
      "nav.contact": "Contact",
      "shop.online": "Webwinkel",
      "brand.tag": "textielatelier",
      "hero.kicker": "Judit Lara · Leuven, België",
      "hero.lead":
        "Draad, binding en papier: unieke stukken waarin borduurwerk, weefgetouw en tekening samenkomen — wortels in Chili, blik in Europa.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.ctaWork": "Bekijk werk",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textiel · borduur · weefsel · papier",
      "hero.imgAlt": "Werk uit atelier Tormenta Telar",
      "marquee.a": "Handborduur",
      "marquee.b": "Hedendaags Mapuche-weefsel",
      "marquee.c": "Tekening en illustratie",
      "marquee.d": "Leuven",
      "about.rail": "atelier · werk",
      "about.title": "Een atelier tussen <em>twee oevers</em>",
      "about.lead":
        "<strong>Tormenta Telar</strong> is de werkplek van Judit Lara: Chileens textielkunstenares in <strong>Leuven</strong>. Trage ambachten — steek, weefgetouw, lijn — die tijd en aanraking vragen.",
      "about.p2":
        "Een naam die kracht en weefsel voor ogen roept: traditie en experiment op hetzelfde vlak. Stukken om mee te leven.",
      "pillar1.title": "Borduurwerk",
      "pillar1.desc": "Motieven dicht bij kinderlijke tekening, vierkante kaders, rijke textuur.",
      "pillar2.title": "Weven",
      "pillar2.desc": "Tafellopers en wandtapijten met een echo van Mapuche en een gedurfde kleur.",
      "pillar3.title": "Papier",
      "pillar3.desc": "Geometrie, lijn en kleur in verschillende formaten, waaronder A4.",
      "pillar4.title": "Volume",
      "pillar4.desc": "Polymeerklei en gemengde technieken op kleine schaal.",
      "collections.title": "Werklijnen",
      "collections.intro":
        "Filter de galerij. In de vergrote weergave staat een link naar details, formaten en verzending.",
      "cat.all": "Alles",
      "cat.bordado": "Borduur",
      "cat.telar": "Weefsel",
      "cat.dibujo": "Papier",
      "cat.arcilla": "Volume",
      "gallery.title": "Werk",
      "gallery.hintHtml":
        "Tik om te vergroten. Toetsenbord: <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> <span class=\"kbd\">Esc</span>",
      "gallery.pieces": "werken",
      "contact.title": "Contact",
      "contact.lead":
        "Opdrachten en vragen: schrijf via Instagram — daar wordt het atelierdagelijks gedeeld.",
      "contact.shopNote":
        "Voor beschikbaarheid en verzending gebruik je de knop <strong>Webwinkel</strong> in de header.",
      "contact.location": "Atelier · Leuven, België",
      "contact.cardLabel": "Volg het atelier",
      "contact.instagramBtn": "@tormentatelar",
      "footer.top": "Boven",
      "footer.ig": "Instagram",
      "lightbox.detail": "Volledige fiche →",
    },
    fr: {
      "meta.title": "Tormenta Telar — Art textile et dessin · Judit Lara",
      "meta.description":
        "Atelier de Judit Lara à Louvain : broderie, tissage, dessin et illustration. Textile contemporain entre le Chili et l’Europe.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleLineas": "Lignes de travail · Tormenta Telar",
      "meta.titleObra": "Œuvres · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Louvain, Belgique.",
      "footer.home": "Accueil",
      "lineas.hint": "Ouvrir la galerie filtrée pour chaque ligne.",
      "a11y.skip": "Aller au contenu",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, accueil",
      "a11y.navMain": "Principal",
      "a11y.filterGroup": "Filtrer par ligne",
      "a11y.lightbox": "Vue agrandie",
      "a11y.close": "Fermer",
      "a11y.prev": "Précédent",
      "a11y.next": "Suivant",
      "a11y.lang": "Langue du site",
      "a11y.wa": "Contacter sur WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Accueil",
      "nav.studio": "Atelier",
      "nav.lines": "Lignes",
      "nav.work": "Œuvres",
      "nav.contact": "Contact",
      "shop.online": "Boutique en ligne",
      "brand.tag": "atelier textile",
      "hero.kicker": "Judit Lara · Louvain, Belgique",
      "hero.lead":
        "Fil, chaîne et papier : pièces uniques où se rencontrent broderie, métier à tisser et dessin — racines chiliennes, regard européen.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.ctaWork": "Voir les œuvres",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textile · broderie · tissage · papier",
      "hero.imgAlt": "Œuvre de l’atelier Tormenta Telar",
      "marquee.a": "Broderie main",
      "marquee.b": "Tissage mapuche contemporain",
      "marquee.c": "Dessin et illustration",
      "marquee.d": "Louvain",
      "about.rail": "atelier · œuvre",
      "about.title": "Un atelier entre <em>deux rives</em>",
      "about.lead":
        "<strong>Tormenta Telar</strong> est l’espace de Judit Lara : artiste textile chilienne à <strong>Louvain</strong>. Des gestes lents — point, métier, trait — qui demandent le toucher et le temps.",
      "about.p2":
        "Un nom qui imagine la force et la trame : tradition et expérimentation sur la même toile. Des pièces pour habiter le quotidien.",
      "pillar1.title": "Broderie",
      "pillar1.desc": "Motifs proches du dessin enfantin, cadres carrés, matière dense.",
      "pillar2.title": "Tissage",
      "pillar2.desc": "Chemins de table et tapisseries actuels avec échos mapuche et couleurs osées.",
      "pillar3.title": "Papier",
      "pillar3.desc": "Géométrie, ligne et couleur, plusieurs formats dont A4.",
      "pillar4.title": "Volume",
      "pillar4.desc": "Pâte polymère et pièces mixtes au petit format.",
      "collections.title": "Lignes de travail",
      "collections.intro":
        "Filtrez la galerie. La vue agrandie mène vers la fiche complète, dimensions et envoi.",
      "cat.all": "Tout",
      "cat.bordado": "Broderie",
      "cat.telar": "Tissage",
      "cat.dibujo": "Papier",
      "cat.arcilla": "Volume",
      "gallery.title": "Œuvres",
      "gallery.hintHtml":
        "Appuyez pour agrandir. Clavier : <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> <span class=\"kbd\">Échap</span>",
      "gallery.pieces": "pièces",
      "contact.title": "Contact",
      "contact.lead":
        "Commandes et questions : écrivez sur Instagram — c’est là que le quotidien de l’atelier est partagé.",
      "contact.shopNote":
        "Pour disponibilité et achat avec envoi, utilisez le bouton <strong>Boutique en ligne</strong> dans l’en-tête.",
      "contact.location": "Atelier · Louvain, Belgique",
      "contact.cardLabel": "Suivre l’atelier",
      "contact.instagramBtn": "@tormentatelar",
      "footer.top": "Haut",
      "footer.ig": "Instagram",
      "lightbox.detail": "Fiche complète →",
    },
    de: {
      "meta.title": "Tormenta Telar — Textilkunst und Zeichnung · Judit Lara",
      "meta.description":
        "Atelier von Judit Lara in Löwen: Stickerei, Weben, Zeichnung und Illustration. Zeitgenössische Textilkunst zwischen Chile und Europa.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleLineas": "Arbeitslinien · Tormenta Telar",
      "meta.titleObra": "Werk · Tormenta Telar",
      "meta.titleContact": "Kontakt · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Löwen, Belgien.",
      "footer.home": "Start",
      "lineas.hint": "Galerie pro Linie gefiltert öffnen.",
      "a11y.skip": "Zum Inhalt",
      "a11y.menu": "Menü",
      "a11y.brandHome": "Tormenta Telar, Start",
      "a11y.navMain": "Hauptnavigation",
      "a11y.filterGroup": "Nach Linie filtern",
      "a11y.lightbox": "Vergrößerte Ansicht",
      "a11y.close": "Schließen",
      "a11y.prev": "Zurück",
      "a11y.next": "Weiter",
      "a11y.lang": "Sprache der Website",
      "a11y.wa": "Kontakt über WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Start",
      "nav.studio": "Atelier",
      "nav.lines": "Linien",
      "nav.work": "Werk",
      "nav.contact": "Kontakt",
      "shop.online": "Onlineshop",
      "brand.tag": "textilatelier",
      "hero.kicker": "Judit Lara · Löwen, Belgien",
      "hero.lead":
        "Faden, Bindung und Papier: Unikate, in denen Stickerei, Webstuhl und Zeichnung zusammentreffen — chilenische Wurzeln, europäischer Blick.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.ctaWork": "Werk ansehen",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textil · Stickerei · Weben · Papier",
      "hero.imgAlt": "Werk aus dem Atelier Tormenta Telar",
      "marquee.a": "Handstickerei",
      "marquee.b": "Zeitgenössisches Mapuche-Weben",
      "marquee.c": "Zeichnung und Illustration",
      "marquee.d": "Löwen",
      "about.rail": "atelier · werk",
      "about.title": "Ein Atelier zwischen <em>zwei Ufern</em>",
      "about.lead":
        "<strong>Tormenta Telar</strong> ist Judit Laras Raum: chilenische Textilkünstlerin in <strong>Löwen</strong>. Langsame Handwerke — Stich, Webstuhl, Linie — die Berührung und Zeit brauchen.",
      "about.p2":
        "Ein Name, der Kraft und Gewebe vor Augen führt: Tradition und Experiment auf derselben Fläche. Stücke zum Wohnen.",
      "pillar1.title": "Stickerei",
      "pillar1.desc": "Motive nahe kindlicher Zeichnung, quadratische Rahmen, dichte Textur.",
      "pillar2.title": "Weben",
      "pillar2.desc": "Tischläufer und Wandbehänge mit Mapuche-Echo und kräftiger Farbe.",
      "pillar3.title": "Papier",
      "pillar3.desc": "Geometrie, Linie und Farbe in mehreren Formaten, inklusive A4.",
      "pillar4.title": "Volumen",
      "pillar4.desc": "Polymer-Ton und Mischtechniken im kleinen Format.",
      "collections.title": "Arbeitslinien",
      "collections.intro":
        "Galerie filtern. In der vergrößerten Ansicht Link zu Details, Maßen und Versand.",
      "cat.all": "Alle",
      "cat.bordado": "Stickerei",
      "cat.telar": "Weben",
      "cat.dibujo": "Papier",
      "cat.arcilla": "Volumen",
      "gallery.title": "Werk",
      "gallery.hintHtml":
        "Tippen zum Vergrößern. Tastatur: <span class=\"kbd\">←</span> <span class=\"kbd\">→</span> <span class=\"kbd\">Esc</span>",
      "gallery.pieces": "Stücke",
      "contact.title": "Kontakt",
      "contact.lead":
        "Aufträge und Fragen: schreiben Sie auf Instagram — dort teilt das Atelier den Alltag.",
      "contact.shopNote":
        "Für verfügbare Stücke und Versand nutzen Sie den Button <strong>Onlineshop</strong> in der Kopfzeile.",
      "contact.location": "Atelier · Löwen, Belgien",
      "contact.cardLabel": "Atelier folgen",
      "contact.instagramBtn": "@tormentatelar",
      "footer.top": "Nach oben",
      "footer.ig": "Instagram",
      "lightbox.detail": "Details & Kauf →",
    },
  };

  function normalizeLang(code) {
    const c = (code || "").split("-")[0].toLowerCase();
    return SUPPORTED.includes(c) ? c : DEFAULT;
  }

  function getLocale() {
    return normalizeLang(localStorage.getItem(STORAGE_KEY) || navigator.language || DEFAULT);
  }

  function t(key) {
    const lang = getLocale();
    const table = STRINGS[lang] || STRINGS[DEFAULT];
    return table[key] ?? STRINGS[DEFAULT][key] ?? key;
  }

  function getCategories() {
    return {
      all: t("cat.all"),
      bordado: t("cat.bordado"),
      telar: t("cat.telar"),
      dibujo: t("cat.dibujo"),
      arcilla: t("cat.arcilla"),
    };
  }

  function getNumberLocale() {
    return LOCALE_NUMBER[getLocale()] || "es-ES";
  }

  function buildMarquee() {
    const inner = document.querySelector(".marquee-inner");
    if (!inner) return;
    const parts = [t("marquee.a"), t("marquee.b"), t("marquee.c"), t("marquee.d")];
    const loop = [...parts, ...parts];
    const frag = document.createDocumentFragment();
    loop.forEach((text, i) => {
      const s = document.createElement("span");
      s.textContent = text;
      frag.appendChild(s);
      const dot = document.createElement("span");
      dot.textContent = "·";
      dot.setAttribute("aria-hidden", "true");
      frag.appendChild(dot);
    });
    inner.innerHTML = "";
    inner.appendChild(frag);
  }

  function applyStaticCopy() {
    document.documentElement.lang = getLocale();

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      el.innerHTML = t(key);
    });

    const page = document.body.getAttribute("data-page") || "home";
    const titleKey =
      page === "taller"
        ? "meta.titleTaller"
        : page === "lineas"
          ? "meta.titleLineas"
          : page === "obra"
            ? "meta.titleObra"
            : page === "contact"
              ? "meta.titleContact"
              : "meta.title";
    const descKey = page === "home" ? "meta.description" : "meta.descInner";

    const titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = t(titleKey);

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(descKey));

    const skip = document.querySelector(".skip-link");
    if (skip) skip.textContent = t("a11y.skip");

    const navHidden = document.querySelector("#nav-toggle .visually-hidden");
    if (navHidden) navHidden.textContent = t("a11y.menu");

    const brand = document.querySelector(".brand");
    if (brand) brand.setAttribute("aria-label", t("a11y.brandHome"));

    const nav = document.getElementById("site-nav");
    if (nav) nav.setAttribute("aria-label", t("a11y.navMain"));

    const filterGroup = document.querySelector(".filter-chips");
    if (filterGroup) filterGroup.setAttribute("aria-label", t("a11y.filterGroup"));

    const lb = document.getElementById("lightbox");
    if (lb) lb.setAttribute("aria-label", t("a11y.lightbox"));

    document.getElementById("lightbox-close")?.setAttribute("aria-label", t("a11y.close"));
    document.getElementById("lightbox-prev")?.setAttribute("aria-label", t("a11y.prev"));
    document.getElementById("lightbox-next")?.setAttribute("aria-label", t("a11y.next"));

    const wa = document.querySelector(".fab-wa");
    if (wa) wa.setAttribute("aria-label", t("a11y.wa"));

    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.setAttribute("aria-label", t("a11y.lang"));
      langSelect.value = getLocale();
    }

    const gh = document.getElementById("gallery-hint");
    if (gh) gh.innerHTML = t("gallery.hintHtml");

    const gp = document.getElementById("gallery-pieces-label");
    if (gp) gp.textContent = t("gallery.pieces");

    const lbLink = document.getElementById("lightbox-link");
    if (lbLink) lbLink.textContent = t("lightbox.detail");

    buildMarquee();

    window.dispatchEvent(new CustomEvent("tt-locale-change", { detail: { lang: getLocale() } }));
  }

  function setLocale(code) {
    const lang = normalizeLang(code);
    localStorage.setItem(STORAGE_KEY, lang);
    applyStaticCopy();
  }

  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, normalizeLang(navigator.language || DEFAULT));
    }
    applyStaticCopy();
    const sel = document.getElementById("lang-select");
    if (sel && !sel.dataset.ttBound) {
      sel.dataset.ttBound = "1";
      sel.addEventListener("change", (e) => {
        setLocale(/** @type {HTMLSelectElement} */ (e.target).value);
      });
    }
  }

  window.TT_I18N = {
    init,
    setLocale,
    getLocale,
    t,
    getCategories,
    getNumberLocale,
    applyStaticCopy,
    SUPPORTED,
  };

  init();
})();
