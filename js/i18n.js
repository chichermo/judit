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
      "meta.titleKit": "Kit de telar · Tormenta Telar",
      "meta.titleAbout": "Acerca de mí · Tormenta Telar",
      "meta.titleLineas": "Líneas de trabajo · Tormenta Telar",
      "meta.titleObra": "Obra · Tormenta Telar",
      "meta.titleContact": "Contacto · Tormenta Telar",
      "meta.descInner":
        "Tormenta Telar — Judit Lara. Bordado, telar y dibujo. Lovaina, Bélgica.",
      "meta.descTaller":
        "Presentación del taller Tormenta Telar en Lovaina: líneas de trabajo y el espacio donde tejo, bordo y dibujo.",
      "meta.descKit":
        "Kit para empezar con telar de peine: materiales esenciales, fotos del contenido y nota sobre el manual de uso.",
      "meta.descAbout":
        "Biografía y trayectoria de Judit Lara — artista textil entre Chile y Europa. CV y retrato descargables.",
      "meta.descLineas":
        "Explora el archivo por líneas: bordado, telar, papel y arcilla. Acceso directo a la galería filtrada.",
      "meta.descObra":
        "Galería de piezas únicas: bordado, tejido, dibujo y volumen. Envíos desde la tienda Etsy de Judit Lara.",
      "meta.descContact":
        "Contacto, Instagram y WhatsApp. Tormenta Telar — Judit Lara, taller textil en Lovaina, Bélgica.",
      "footer.home": "Inicio",
      "lineas.hint": "Entra en la galería ya filtrada por cada línea.",
      "a11y.skip": "Saltar al contenido",
      "a11y.breadcrumb": "Ruta de navegación",
      "a11y.menu": "Menú",
      "a11y.brandHome": "Tormenta Telar, inicio",
      "a11y.navMain": "Principal",
      "a11y.filterGroup": "Filtrar por línea",
      "a11y.lightbox": "Vista ampliada de obra",
      "a11y.close": "Cerrar",
      "a11y.prev": "Anterior",
      "a11y.next": "Siguiente",
      "a11y.lang": "Idioma del sitio",
      "a11y.tallerSubnav": "Secciones de esta página",
      "a11y.wa": "Contactar por WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Inicio",
      "nav.studio": "Taller",
      "nav.kit": "Kit de telar",
      "nav.about": "Acerca de mí",
      "nav.lines": "Líneas",
      "nav.work": "Obra",
      "nav.contact": "Contacto",
      "shop.online": "Tienda online",
      "brand.tag": "taller textil",
      "hero.kicker": "Judit Lara · Lovaina, Bélgica",
      "hero.lead":
        "textil, dibujo y color para conectar la memoria ancestral, con el imaginario pop contemporáneo.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.titleBrand": "TormentaTelar:",
      "hero.titleRest": "un estudio cromático",
      "hero.ctaWork": "Ver obra",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textil · bordado · telar · papel",
      "hero.imgAlt": "Obra del taller Tormenta Telar",
      "hero.carouselAria": "Carrusel de piezas de la tienda; cada imagen abre la ficha en Etsy",
      "marquee.a": "Bordado manual",
      "marquee.b": "Tejido mapuche contemporáneo",
      "marquee.c": "Dibujo e ilustración",
      "marquee.d": "Lovaina",
      "about.rail": "atelier",
      "about.title": "TormentaTelar: un estudio cromático",
      "about.lead":
        "<strong>Tormenta Telar</strong> es el espacio de Judit Lara en <strong>Lovaina</strong>: bordado, telar, dibujo y piezas de volumen. Raíces chilenas y una mirada abierta al color.",
      "about.p2":
        "Puntada, telar y trazo — gestos lentos que piden tacto y tiempo. Piezas para contemplar y vivir en casa.",
      "studio.subnavIntro": "Presentación",
      "studio.photosTitle": "El estudio",
      "studio.photosIntro": "Un vistazo al espacio donde tejo, bordo y dibujo.",
      "studio.kitTitle": "Kit de telar",
      "studio.kitLead": "Ofrezco un kit para comenzar a tejer con telar de peine.",
      "studio.kitBody":
        "Incluye materiales y herramientas esenciales. El manual de uso está en preparación; pronto compartiré la versión definitiva.",
      "studio.kitManualNote": "Manual de uso: próximamente.",
      "studio.aboutTitle": "Acerca de mí",
      "studio.bio":
        "<p>Judit Lara es artista textil entre Chile y Bélgica. Aquí puedes escribir una biografía breve en primera o tercera persona.</p><p>Añade otro párrafo con formación, residencias o líneas de investigación cuando quieras.</p>",
      "studio.cvLink": "Descargar CV (PDF)",
      "studio.cvPhotoLink": "Descargar retrato (JPG · para CV o prensa)",
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
      "contact.waBtn": "WhatsApp",
      "footer.top": "Arriba",
      "footer.ig": "Instagram",
      "footer.visits": "Visitas",
      "lightbox.detail": "Ficha completa →",
    },
    en: {
      "meta.title": "Tormenta Telar — Textile art & drawing · Judit Lara",
      "meta.description":
        "Judit Lara’s studio in Leuven: embroidery, weaving, drawing and illustration. Contemporary textile work between Chile and Europe.",
      "meta.titleTaller": "Studio · Tormenta Telar",
      "meta.titleKit": "Loom kit · Tormenta Telar",
      "meta.titleAbout": "About me · Tormenta Telar",
      "meta.titleLineas": "Lines of work · Tormenta Telar",
      "meta.titleObra": "Work · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Embroidery, loom, drawing. Leuven, Belgium.",
      "meta.descTaller":
        "Introducing the Tormenta Telar studio in Leuven: lines of work and the space where I weave, embroider and draw.",
      "meta.descKit":
        "Comb-loom starter kit: essential materials, photos of what’s inside, and a note on the user manual.",
      "meta.descAbout":
        "Biography and path of Judit Lara — textile artist between Chile and Europe. Downloadable CV and portrait.",
      "meta.descLineas":
        "Browse the archive by line: embroidery, loom, paper and clay. Jump straight to the filtered gallery.",
      "meta.descObra":
        "Gallery of unique pieces: embroidery, weave, drawing and volume. Shipping via Judit Lara’s Etsy shop.",
      "meta.descContact":
        "Contact via Instagram and WhatsApp. Tormenta Telar — Judit Lara, textile studio in Leuven, Belgium.",
      "footer.home": "Home",
      "lineas.hint": "Open the gallery filtered for each line.",
      "a11y.skip": "Skip to content",
      "a11y.breadcrumb": "Breadcrumb",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, home",
      "a11y.navMain": "Main",
      "a11y.filterGroup": "Filter by line",
      "a11y.lightbox": "Enlarged artwork view",
      "a11y.close": "Close",
      "a11y.prev": "Previous",
      "a11y.next": "Next",
      "a11y.lang": "Site language",
      "a11y.tallerSubnav": "Sections on this page",
      "a11y.wa": "Contact on WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Home",
      "nav.studio": "Studio",
      "nav.kit": "Loom kit",
      "nav.about": "About me",
      "nav.lines": "Lines",
      "nav.work": "Work",
      "nav.contact": "Contact",
      "shop.online": "Online shop",
      "brand.tag": "textile studio",
      "hero.kicker": "Judit Lara · Leuven, Belgium",
      "hero.lead":
        "Interweaving textiles, drawing, and color to connect ancestral memory with contemporary pop imagery.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.titleBrand": "TormentaTelar:",
      "hero.titleRest": "a chromatic studio",
      "hero.ctaWork": "View work",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textile · embroidery · loom · paper",
      "hero.imgAlt": "Work from the Tormenta Telar studio",
      "hero.carouselAria": "Shop carousel; each image opens the Etsy listing",
      "marquee.a": "Hand embroidery",
      "marquee.b": "Contemporary Mapuche weaving",
      "marquee.c": "Drawing & illustration",
      "marquee.d": "Leuven",
      "about.rail": "atelier",
      "about.title": "TormentaTelar: a chromatic studio",
      "about.lead":
        "<strong>Tormenta Telar</strong> is Judit Lara’s studio in <strong>Leuven</strong>: embroidery, weaving, drawing and small sculptural pieces. Chilean roots and an open, colour-driven practice.",
      "about.p2":
        "Stitch, loom and line — slow crafts that ask for touch and time. Pieces to live with.",
      "studio.subnavIntro": "Overview",
      "studio.photosTitle": "The studio",
      "studio.photosIntro": "A glimpse of the space where I weave, embroider and draw.",
      "studio.kitTitle": "Loom kit",
      "studio.kitLead": "I offer a kit to get started with a comb loom.",
      "studio.kitBody":
        "It includes essential materials and tools. The how-to manual is still being finished; the final version will be shared soon.",
      "studio.kitManualNote": "User manual: coming soon.",
      "studio.aboutTitle": "About me",
      "studio.bio":
        "<p>Judit Lara is a textile artist working between Chile and Belgium. Add your short bio here (first or third person).</p><p>You can add training, residencies or research lines in a second paragraph.</p>",
      "studio.cvLink": "Download CV (PDF)",
      "studio.cvPhotoLink": "Download portrait (JPG · for CV or press)",
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
      "contact.waBtn": "WhatsApp",
      "footer.top": "Top",
      "footer.ig": "Instagram",
      "footer.visits": "Visits",
      "lightbox.detail": "Full details →",
    },
    nl: {
      "meta.title": "Tormenta Telar — Textielkunst en tekening · Judit Lara",
      "meta.description":
        "Atelier van Judit Lara in Leuven: borduurwerk, weven, tekening en illustratie. Hedendaagse textiel tussen Chili en Europa.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleKit": "Weefkit · Tormenta Telar",
      "meta.titleAbout": "Over mij · Tormenta Telar",
      "meta.titleLineas": "Werklijnen · Tormenta Telar",
      "meta.titleObra": "Werk · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Leuven, België.",
      "meta.descTaller":
        "Voorstelling van het atelier Tormenta Telar in Leuven: werklijnen en de plek waar ik weef, borduur en teken.",
      "meta.descKit":
        "Startset voor een kam-weeftoestel: essentiële materialen, foto’s van de inhoud en een woord over de handleiding.",
      "meta.descAbout":
        "Biografie en loopbaan van Judit Lara — textielkunstenares tussen Chili en Europa. CV en portret om te downloaden.",
      "meta.descLineas":
        "Blader per lijn: borduur, weefsel, papier en klei. Meteen naar de gefilterde galerij.",
      "meta.descObra":
        "Galerij met unieke stukken. Verzending via de Etsy-winkel van Judit Lara.",
      "meta.descContact":
        "Contact via Instagram en WhatsApp. Tormenta Telar — Judit Lara, textielatelier in Leuven.",
      "footer.home": "Home",
      "lineas.hint": "Open de galerij gefilterd per lijn.",
      "a11y.skip": "Naar inhoud",
      "a11y.breadcrumb": "Kruimelpad",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, home",
      "a11y.navMain": "Hoofdnavigatie",
      "a11y.filterGroup": "Filter op lijn",
      "a11y.lightbox": "Vergrote weergave",
      "a11y.close": "Sluiten",
      "a11y.prev": "Vorige",
      "a11y.next": "Volgende",
      "a11y.lang": "Taal van de site",
      "a11y.tallerSubnav": "Secties op deze pagina",
      "a11y.wa": "Contact via WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Home",
      "nav.studio": "Atelier",
      "nav.kit": "Weefkit",
      "nav.about": "Over mij",
      "nav.lines": "Lijnen",
      "nav.work": "Werk",
      "nav.contact": "Contact",
      "shop.online": "Webwinkel",
      "brand.tag": "textielatelier",
      "hero.kicker": "Judit Lara · Leuven, België",
      "hero.lead":
        "Textiel, tekening en kleur om voorouderlijke herinnering te verweven met eigentijdse popbeelden.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.titleBrand": "TormentaTelar:",
      "hero.titleRest": "een chromatische studio",
      "hero.ctaWork": "Bekijk werk",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textiel · borduur · weefsel · papier",
      "hero.imgAlt": "Werk uit atelier Tormenta Telar",
      "hero.carouselAria": "Carrousel met winkelstukken; elke afbeelding opent Etsy",
      "marquee.a": "Handborduur",
      "marquee.b": "Hedendaags Mapuche-weefsel",
      "marquee.c": "Tekening en illustratie",
      "marquee.d": "Leuven",
      "about.rail": "atelier",
      "about.title": "TormentaTelar: een chromatische studio",
      "about.lead":
        "<strong>Tormenta Telar</strong> is het atelier van Judit Lara in <strong>Leuven</strong>: borduurwerk, weven, tekening en kleine volumewerken. Chileense wortels en een kleurrijke blik.",
      "about.p2":
        "Steek, weefgetouw en lijn — trage ambachten die tijd en aanraking vragen. Stukken om mee te leven.",
      "studio.subnavIntro": "Inleiding",
      "studio.photosTitle": "Het atelier",
      "studio.photosIntro": "Een blik op de plek waar ik weef, borduur en teken.",
      "studio.kitTitle": "Weefkit",
      "studio.kitLead": "Ik bied een kit om te starten met een kam-weeftoestel.",
      "studio.kitBody":
        "Met essentiële materialen en gereedschap. De gebruiksaanwijzing is nog in voorbereiding; de definitieve versie volgt binnenkort.",
      "studio.kitManualNote": "Handleiding: binnenkort beschikbaar.",
      "studio.aboutTitle": "Over mij",
      "studio.bio":
        "<p>Judit Lara is textielkunstenares tussen Chili en België. Vul hier je korte bio aan.</p><p>Voeg desgewenst een tweede alinea toe over opleiding of focus.</p>",
      "studio.cvLink": "CV downloaden (PDF)",
      "studio.cvPhotoLink": "Portret downloaden (JPG · voor CV of pers)",
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
      "contact.waBtn": "WhatsApp",
      "footer.top": "Boven",
      "footer.ig": "Instagram",
      "footer.visits": "Bezoeken",
      "lightbox.detail": "Volledige fiche →",
    },
    fr: {
      "meta.title": "Tormenta Telar — Art textile et dessin · Judit Lara",
      "meta.description":
        "Atelier de Judit Lara à Louvain : broderie, tissage, dessin et illustration. Textile contemporain entre le Chili et l’Europe.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleKit": "Kit de tissage · Tormenta Telar",
      "meta.titleAbout": "À propos de moi · Tormenta Telar",
      "meta.titleLineas": "Lignes de travail · Tormenta Telar",
      "meta.titleObra": "Œuvres · Tormenta Telar",
      "meta.titleContact": "Contact · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Louvain, Belgique.",
      "meta.descTaller":
        "Présentation de l’atelier Tormenta Telar à Louvain : lignes de travail et l’espace où je tisse, brode et dessine.",
      "meta.descKit":
        "Kit pour débuter avec un métier à peigne : matériel essentiel, photos du contenu et note sur le mode d’emploi.",
      "meta.descAbout":
        "Biographie et parcours de Judit Lara — artiste textile entre le Chili et l’Europe. CV et portrait à télécharger.",
      "meta.descLineas":
        "Parcourez les lignes : broderie, tissage, papier et argile. Accès direct à la galerie filtrée.",
      "meta.descObra":
        "Galerie de pièces uniques. Expéditions via la boutique Etsy de Judit Lara.",
      "meta.descContact":
        "Contact par Instagram et WhatsApp. Tormenta Telar — Judit Lara, atelier textile à Louvain.",
      "footer.home": "Accueil",
      "lineas.hint": "Ouvrir la galerie filtrée pour chaque ligne.",
      "a11y.skip": "Aller au contenu",
      "a11y.breadcrumb": "Fil d’Ariane",
      "a11y.menu": "Menu",
      "a11y.brandHome": "Tormenta Telar, accueil",
      "a11y.navMain": "Principal",
      "a11y.filterGroup": "Filtrer par ligne",
      "a11y.lightbox": "Vue agrandie",
      "a11y.close": "Fermer",
      "a11y.prev": "Précédent",
      "a11y.next": "Suivant",
      "a11y.lang": "Langue du site",
      "a11y.tallerSubnav": "Sections de cette page",
      "a11y.wa": "Contacter sur WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Accueil",
      "nav.studio": "Atelier",
      "nav.kit": "Kit de tissage",
      "nav.about": "À propos de moi",
      "nav.lines": "Lignes",
      "nav.work": "Œuvres",
      "nav.contact": "Contact",
      "shop.online": "Boutique en ligne",
      "brand.tag": "atelier textile",
      "hero.kicker": "Judit Lara · Louvain, Belgique",
      "hero.lead":
        "Textile, dessin et couleur pour tisser la mémoire ancestrale avec l’imaginaire pop contemporain.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.titleBrand": "TormentaTelar :",
      "hero.titleRest": "un atelier chromatique",
      "hero.ctaWork": "Voir les œuvres",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textile · broderie · tissage · papier",
      "hero.imgAlt": "Œuvre de l’atelier Tormenta Telar",
      "hero.carouselAria": "Carrousel de la boutique ; chaque image ouvre Etsy",
      "marquee.a": "Broderie main",
      "marquee.b": "Tissage mapuche contemporain",
      "marquee.c": "Dessin et illustration",
      "marquee.d": "Louvain",
      "about.rail": "atelier",
      "about.title": "TormentaTelar : un atelier chromatique",
      "about.lead":
        "<strong>Tormenta Telar</strong> est l’atelier de Judit Lara à <strong>Louvain</strong> : broderie, tissage, dessin et petites pièces de volume. Racines chiliennes et regard tourné vers la couleur.",
      "about.p2":
        "Point, métier à tisser et trait — gestes lents qui demandent le toucher et le temps. Des pièces pour habiter le quotidien.",
      "studio.subnavIntro": "Présentation",
      "studio.photosTitle": "L’atelier",
      "studio.photosIntro": "Un aperçu de l’espace où je tisse, brode et dessine.",
      "studio.kitTitle": "Kit de tissage",
      "studio.kitLead": "Je propose un kit pour débuter avec un métier à peigne.",
      "studio.kitBody":
        "Il comprend le matériel et les outils essentiels. Le mode d’emploi est en cours de finalisation ; la version définitive arrive bientôt.",
      "studio.kitManualNote": "Mode d’emploi : bientôt disponible.",
      "studio.aboutTitle": "À propos de moi",
      "studio.bio":
        "<p>Judit Lara est artiste textile entre le Chili et la Belgique. Ajoutez ici votre courte biographie.</p><p>Un second paragraphe pour formation ou axes de travail, si vous le souhaitez.</p>",
      "studio.cvLink": "Télécharger le CV (PDF)",
      "studio.cvPhotoLink": "Télécharger le portrait (JPG · CV ou presse)",
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
      "contact.waBtn": "WhatsApp",
      "footer.top": "Haut",
      "footer.ig": "Instagram",
      "footer.visits": "Visites",
      "lightbox.detail": "Fiche complète →",
    },
    de: {
      "meta.title": "Tormenta Telar — Textilkunst und Zeichnung · Judit Lara",
      "meta.description":
        "Atelier von Judit Lara in Löwen: Stickerei, Weben, Zeichnung und Illustration. Zeitgenössische Textilkunst zwischen Chile und Europa.",
      "meta.titleTaller": "Atelier · Tormenta Telar",
      "meta.titleKit": "Webset · Tormenta Telar",
      "meta.titleAbout": "Über mich · Tormenta Telar",
      "meta.titleLineas": "Arbeitslinien · Tormenta Telar",
      "meta.titleObra": "Werk · Tormenta Telar",
      "meta.titleContact": "Kontakt · Tormenta Telar",
      "meta.descInner": "Tormenta Telar — Judit Lara. Löwen, Belgien.",
      "meta.descTaller":
        "Vorstellung des Ateliers Tormenta Telar in Löwen: Arbeitslinien und der Raum, in dem ich webe, stickere und zeichne.",
      "meta.descKit":
        "Einsteiger-Set mit Kammwebstuhl: wichtiges Material, Fotos vom Inhalt und ein Hinweis zur Bedienungsanleitung.",
      "meta.descAbout":
        "Biografie und Werdegang von Judit Lara — Textilkünstlerin zwischen Chile und Europa. CV und Porträt zum Download.",
      "meta.descLineas":
        "Nach Linien stöbern: Stickerei, Gewebe, Papier und Ton. Direkt zur gefilterten Galerie.",
      "meta.descObra":
        "Galerie mit Unikaten. Versand über Judit Laras Etsy-Shop.",
      "meta.descContact":
        "Kontakt über Instagram und WhatsApp. Tormenta Telar — Judit Lara, Textilatelier in Löwen.",
      "footer.home": "Start",
      "lineas.hint": "Galerie pro Linie gefiltert öffnen.",
      "a11y.skip": "Zum Inhalt",
      "a11y.breadcrumb": "Navigationspfad",
      "a11y.menu": "Menü",
      "a11y.brandHome": "Tormenta Telar, Start",
      "a11y.navMain": "Hauptnavigation",
      "a11y.filterGroup": "Nach Linie filtern",
      "a11y.lightbox": "Vergrößerte Ansicht",
      "a11y.close": "Schließen",
      "a11y.prev": "Zurück",
      "a11y.next": "Weiter",
      "a11y.lang": "Sprache der Website",
      "a11y.tallerSubnav": "Abschnitte auf dieser Seite",
      "a11y.wa": "Kontakt über WhatsApp",
      "wa.label": "WhatsApp",
      "nav.home": "Start",
      "nav.studio": "Atelier",
      "nav.kit": "Webset",
      "nav.about": "Über mich",
      "nav.lines": "Linien",
      "nav.work": "Werk",
      "nav.contact": "Kontakt",
      "shop.online": "Onlineshop",
      "brand.tag": "textilatelier",
      "hero.kicker": "Judit Lara · Löwen, Belgien",
      "hero.lead":
        "Textil, Zeichnung und Farbe, um kulturelles Gedächtnis mit zeitgenössischer Pop-Imagery zu verweben.",
      "hero.title1": "Tormenta",
      "hero.title2": "Telar",
      "hero.titleBrand": "TormentaTelar:",
      "hero.titleRest": "ein chromatisches Atelier",
      "hero.ctaWork": "Werk ansehen",
      "hero.ctaIg": "Instagram",
      "hero.caption": "Textil · Stickerei · Weben · Papier",
      "hero.imgAlt": "Werk aus dem Atelier Tormenta Telar",
      "hero.carouselAria": "Karussell der Shop-Stücke; jedes Bild öffnet Etsy",
      "marquee.a": "Handstickerei",
      "marquee.b": "Zeitgenössisches Mapuche-Weben",
      "marquee.c": "Zeichnung und Illustration",
      "marquee.d": "Löwen",
      "about.rail": "atelier",
      "about.title": "TormentaTelar: ein chromatisches Atelier",
      "about.lead":
        "<strong>Tormenta Telar</strong> ist Judit Laras Atelier in <strong>Löwen</strong>: Stickerei, Weben, Zeichnung und kleine Volumenarbeiten. Chilenische Wurzeln und eine offene, farbige Praxis.",
      "about.p2":
        "Stich, Webstuhl und Linie — langsame Handwerke, die Berührung und Zeit brauchen. Stücke zum Wohnen.",
      "studio.subnavIntro": "Überblick",
      "studio.photosTitle": "Das Atelier",
      "studio.photosIntro": "Ein Einblick in den Raum, in dem ich webe, stickere und zeichne.",
      "studio.kitTitle": "Webset",
      "studio.kitLead": "Ich biete ein Set an, um mit einem Kammwebstuhl einzusteigen.",
      "studio.kitBody":
        "Mit wichtigem Material und Werkzeug. Die Bedienungsanleitung ist in Arbeit; die endgültige Version folgt in Kürze.",
      "studio.kitManualNote": "Bedienungsanleitung: demnächst.",
      "studio.aboutTitle": "Über mich",
      "studio.bio":
        "<p>Judit Lara ist Textilkünstlerin zwischen Chile und Belgien. Hier können Sie eine kurze Biografie einfügen.</p><p>Optional ein zweiter Absatz zu Ausbildung oder Schwerpunkten.</p>",
      "studio.cvLink": "CV herunterladen (PDF)",
      "studio.cvPhotoLink": "Porträt herunterladen (JPG · für CV oder Presse)",
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
      "contact.waBtn": "WhatsApp",
      "footer.top": "Nach oben",
      "footer.ig": "Instagram",
      "footer.visits": "Aufrufe",
      "lightbox.detail": "Details & Kauf →",
    },
  };

  const BIO =
    typeof window !== "undefined" && window.TT_STUDIO_BIO ? window.TT_STUDIO_BIO : null;
  if (BIO) {
    if (BIO.es) STRINGS.es["studio.bio"] = BIO.es;
    if (BIO.en) STRINGS.en["studio.bio"] = BIO.en;
    if (BIO.nl) STRINGS.nl["studio.bio"] = BIO.nl;
    if (BIO.fr) STRINGS.fr["studio.bio"] = BIO.fr;
    if (BIO.de) STRINGS.de["studio.bio"] = BIO.de;
  }

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
        : page === "kit"
          ? "meta.titleKit"
          : page === "sobre-mi"
            ? "meta.titleAbout"
            : page === "lineas"
              ? "meta.titleLineas"
              : page === "obra"
                ? "meta.titleObra"
                : page === "contact"
                  ? "meta.titleContact"
                  : "meta.title";
    const descKey =
      page === "home"
        ? "meta.description"
        : page === "taller"
          ? "meta.descTaller"
          : page === "kit"
            ? "meta.descKit"
            : page === "sobre-mi"
              ? "meta.descAbout"
              : page === "lineas"
                ? "meta.descLineas"
                : page === "obra"
                  ? "meta.descObra"
                  : page === "contact"
                    ? "meta.descContact"
                    : "meta.descInner";

    const titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = t(titleKey);

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(descKey));

    const titleStr = t(titleKey);
    const descStr = t(descKey);
    document.getElementById("meta-og-title")?.setAttribute("content", titleStr);
    document.getElementById("meta-og-desc")?.setAttribute("content", descStr);
    document.getElementById("meta-tw-title")?.setAttribute("content", titleStr);
    document.getElementById("meta-tw-desc")?.setAttribute("content", descStr);

    document.querySelector(".breadcrumb")?.setAttribute("aria-label", t("a11y.breadcrumb"));

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

    document.querySelectorAll(".btn-wa-contact").forEach((el) => {
      el.setAttribute("aria-label", t("a11y.wa"));
    });

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
