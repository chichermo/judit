(function () {
  "use strict";

  if (
    typeof window !== "undefined" &&
    location.protocol === "file:" &&
    window.parent !== window.self
  ) {
    console.warn(
      "[Tormenta Telar] Esta página está en un marco con file://. Chrome suele bloquear orígenes file en iframes. Abre el sitio con HTTP: en la carpeta del proyecto ejecuta «npm start» y entra en http://localhost:3000, o abre index.html en una pestaña normal (no en vista previa embebida)."
    );
  }

  /** @typedef {{ id: number, name: string, image: string, price: string, currency: string, url: string }} Product */

  const I18N = window.TT_I18N;
  const page = document.body.getAttribute("data-page") || "home";

  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const yearEl = document.getElementById("year");
  const galleryGrid = document.getElementById("gallery-grid");

  const pageGalleryLocal = page === "obra" ? window.__TT_GALLERY_LOCAL__ || [] : [];
  const products = /** @type {Product[]} */ ([...(window.__TT_PRODUCTS__ || []), ...pageGalleryLocal]);

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  if (page === "contact") {
    document.querySelector("a.footer-contact-link")?.setAttribute("aria-current", "page");
  }

  navToggle?.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav?.classList.toggle("is-open", !expanded);
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle?.setAttribute("aria-expanded", "false");
      siteNav?.classList.remove("is-open");
    });
  });

  function initReveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((el) => {
        el.classList.add("reveal-visible");
      });
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  }

  /** @param {string} name */
  function categorize(name) {
    if (/hand embroidered|embroidered.*wall|embroidery|fiber art.*framed.*20x20/i.test(name)) {
      return "bordado";
    }
    if (/polymer clay/i.test(name)) {
      return "arcilla";
    }
    if (
      /handwoven|mapuche|loom weaving|woven table|table runner with led|framed contemporary weaving|multicolor handwoven/i.test(
        name
      )
    ) {
      return "telar";
    }
    return "dibujo";
  }

  const GALLERY_SECTION_KEYS = ["bordados", "dibujos", "instalacion", "plasticina", "telar", "volumen"];

  /** @param {{ category: string, name: string }} p */
  function normalizeObraCategory(p) {
    const c = p.category;
    if (GALLERY_SECTION_KEYS.includes(c)) return c;
    if (c === "bordado" || c === "bordados") return "bordados";
    if (c === "obras") return "telar";
    if (c === "telar") return "telar";
    if (c === "dibujo" || c === "dibujos") return "dibujos";
    if (c === "arcilla" || c === "plasticina") return "plasticina";
    if (c === "volumen") return "volumen";
    if (c === "instalacion") return "instalacion";
    if (c === "monstruos" || c === "dibujo-sin-marco" || c === "piedras") return "dibujos";
    const legacy = categorize(p.name);
    if (legacy === "bordado") return "bordados";
    if (legacy === "telar") return "telar";
    if (legacy === "arcilla") return "plasticina";
    return "dibujos";
  }

  const baseEnriched = products.map((p) => ({
    ...p,
    category: /** @type {string} */ (p.category || categorize(p.name)),
  }));

  const enriched =
    page === "obra"
      ? baseEnriched.map((p) => ({
          ...p,
          category: normalizeObraCategory(p),
        }))
      : baseEnriched;

  function categoryLabels() {
    return I18N.getCategories();
  }

  function formatPrice(p, currency) {
    const n = Number.parseFloat(p);
    if (Number.isNaN(n)) return "";
    const loc = I18N.getNumberLocale();
    try {
      return new Intl.NumberFormat(loc, {
        style: "currency",
        currency: currency || "EUR",
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return `${n} €`;
    }
  }

  /**
   * @param {{ image: string, url: string }[]} slides
   */
  function initHeroCarouselFromSlides(slides) {
    const track = document.getElementById("hero-carousel-track");
    const root = document.getElementById("hero-carousel");
    const prevBtn = document.getElementById("hero-carousel-prev");
    const nextBtn = document.getElementById("hero-carousel-next");
    const dotsEl = document.getElementById("hero-carousel-dots");
    const counterEl = document.getElementById("hero-carousel-counter");
    if (!track || !slides.length) return;

    track.innerHTML = "";
    slides.forEach((p, i) => {
      const a = document.createElement("a");
      a.className = "hero-carousel-slide";
      a.href = p.url || "https://www.etsy.com/shop/juditlarae/";
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = "";
      if (i === 0) {
        img.loading = "eager";
        if ("fetchPriority" in img) img.fetchPriority = "high";
      } else {
        img.loading = "lazy";
      }
      img.decoding = "async";
      a.appendChild(img);
      track.appendChild(a);
    });

    const slideEls = track.querySelectorAll(".hero-carousel-slide");
    const n = slideEls.length;
    let index = 0;
    const maxDots = 12;
    const autoplayMs = 5500;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prevBtn) prevBtn.removeAttribute("hidden");
    if (nextBtn) nextBtn.removeAttribute("hidden");

    if (n <= 1) {
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      if (dotsEl) dotsEl.hidden = true;
      if (counterEl) counterEl.hidden = true;
    }

    function updateHeroCarouselA11yLabels() {
      root?.setAttribute("role", "region");
      root?.setAttribute("aria-label", I18N.t("hero.carouselAria"));
      prevBtn?.setAttribute("aria-label", I18N.t("a11y.prev"));
      nextBtn?.setAttribute("aria-label", I18N.t("a11y.next"));
    }

    function updateTrack() {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsEl && !dotsEl.hidden) {
        dotsEl.querySelectorAll(".hero-carousel-dot").forEach((d, i) => {
          d.classList.toggle("is-active", i === index);
          d.setAttribute("aria-current", i === index ? "true" : "false");
        });
      }
      if (counterEl && !counterEl.hidden) {
        counterEl.textContent = `${index + 1} / ${n}`;
      }
    }

    if (dotsEl && n > 1) {
      if (n <= maxDots) {
        dotsEl.hidden = false;
        dotsEl.innerHTML = "";
        for (let i = 0; i < n; i++) {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "hero-carousel-dot" + (i === 0 ? " is-active" : "");
          btn.setAttribute("aria-label", `${i + 1} / ${n}`);
          if (i === 0) btn.setAttribute("aria-current", "true");
          btn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            index = i;
            updateTrack();
            restartAutoplay();
          });
          dotsEl.appendChild(btn);
        }
      } else if (counterEl) {
        counterEl.hidden = false;
      }
    }

    function go(delta) {
      index = (index + delta + n) % n;
      updateTrack();
    }

    prevBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      go(-1);
      restartAutoplay();
    });
    nextBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      go(1);
      restartAutoplay();
    });

    let autoplayId = 0;
    function startAutoplay() {
      if (n <= 1 || reduceMotion) return;
      stopAutoplay();
      autoplayId = window.setInterval(() => go(1), autoplayMs);
    }
    function stopAutoplay() {
      if (autoplayId) {
        clearInterval(autoplayId);
        autoplayId = 0;
      }
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    root?.addEventListener("focusin", stopAutoplay);
    root?.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (root && !root.contains(document.activeElement) && !document.hidden) startAutoplay();
      });
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoplay();
      else if (n > 1) startAutoplay();
    });

    updateTrack();
    startAutoplay();
    updateHeroCarouselA11yLabels();
    window.addEventListener("tt-locale-change", updateHeroCarouselA11yLabels);
  }

  function initHeroMedia() {
    const video = document.getElementById("hero-master-video");
    const carouselRoot = document.getElementById("hero-carousel");
    const track = document.getElementById("hero-carousel-track");
    const prevBtn = document.getElementById("hero-carousel-prev");
    const nextBtn = document.getElementById("hero-carousel-next");
    const dotsEl = document.getElementById("hero-carousel-dots");
    const counterEl = document.getElementById("hero-carousel-counter");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function useCarousel() {
      if (video) video.pause();
      carouselRoot?.classList.add("hero-media--carousel");
      carouselRoot?.classList.remove("hero-media--video");
      const slides = window.__TT_HERO_CAROUSEL__ || [];
      if (slides.length) {
        initHeroCarouselFromSlides(slides);
      } else {
        const fallback = [...baseEnriched]
          .filter((p) => {
            if (p.id >= 2000) return false;
            if (p.id >= 25 && p.id <= 43) return false;
            return true;
          })
          .sort((a, b) => {
            const ta = a.category === "telar" ? 0 : 1;
            const tb = b.category === "telar" ? 0 : 1;
            if (ta !== tb) return ta - tb;
            return 0;
          })
          .map((p) => ({ image: p.image, url: p.url }));
        if (fallback.length) initHeroCarouselFromSlides(fallback);
      }
    }

    function useVideo() {
      carouselRoot?.classList.add("hero-media--video");
      carouselRoot?.classList.remove("hero-media--carousel");
      if (track) {
        track.innerHTML = "";
        track.style.transform = "";
      }
      if (prevBtn) {
        prevBtn.hidden = true;
        prevBtn.setAttribute("hidden", "");
      }
      if (nextBtn) {
        nextBtn.hidden = true;
        nextBtn.setAttribute("hidden", "");
      }
      if (dotsEl) {
        dotsEl.hidden = true;
        dotsEl.setAttribute("hidden", "");
      }
      if (counterEl) {
        counterEl.hidden = true;
        counterEl.setAttribute("hidden", "");
      }
      carouselRoot?.setAttribute("role", "region");
      carouselRoot?.setAttribute("aria-label", I18N.t("hero.videoAria"));
    }

    if (!video || reduceMotion) {
      useCarousel();
      return;
    }

    video.addEventListener("error", () => useCarousel(), { once: true });

    const tryPlay = () => {
      video
        .play()
        .then(() => {
          useVideo();
        })
        .catch(() => {
          useCarousel();
        });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    window.addEventListener("tt-locale-change", () => {
      if (carouselRoot?.classList.contains("hero-media--video")) {
        carouselRoot.setAttribute("aria-label", I18N.t("hero.videoAria"));
      }
    });
  }

  function initHeroParallax() {
    const root = document.getElementById("hero-parallax-root");
    const visual = document.querySelector("[data-hero-visual]");
    if (!root || !visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function onMove(mx, my) {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const cx = (mx - rect.left) / rect.width - 0.5;
        const cy = (my - rect.top) / rect.height - 0.5;
        const maxT = 14;
        visual.style.setProperty("--tilt-x", `${(-cy * maxT).toFixed(2)}deg`);
        visual.style.setProperty("--tilt-y", `${(cx * maxT).toFixed(2)}deg`);
        root.style.setProperty("--px", `${(cx * 18).toFixed(2)}px`);
        root.style.setProperty("--py", `${(cy * 14).toFixed(2)}px`);
      });
    }

    root.addEventListener("pointermove", (e) => onMove(e.clientX, e.clientY), { passive: true });
    root.addEventListener(
      "pointerleave",
      () => {
        visual.style.setProperty("--tilt-x", "0deg");
        visual.style.setProperty("--tilt-y", "0deg");
        root.style.setProperty("--px", "0px");
        root.style.setProperty("--py", "0px");
      },
      { passive: true }
    );
  }

  function initCursorGlow() {
    const el = document.getElementById("cursor-glow");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 900px)").matches) {
      el.style.display = "none";
      return;
    }
    let raf = 0;
    document.addEventListener(
      "pointermove",
      (e) => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          el.style.setProperty("--cx", `${e.clientX}px`);
          el.style.setProperty("--cy", `${e.clientY}px`);
        });
      },
      { passive: true }
    );
  }

  if (page === "home") {
    initHeroMedia();
    initHeroParallax();
    initCursorGlow();
  }

  initReveal();

  function injectStudioLikeGrid(containerSel, paths) {
    const grid = document.querySelector(containerSel);
    const list = paths || [];
    if (!grid || !list.length) return;
    grid.innerHTML = "";
    list.forEach((src) => {
      const fig = document.createElement("figure");
      fig.className = "studio-shot";
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.loading = "lazy";
      img.width = 800;
      img.height = 600;
      fig.appendChild(img);
      grid.appendChild(fig);
    });
  }

  if (page === "kit") {
    injectStudioLikeGrid("[data-kit-grid]", window.__TT_KIT_IMAGES__);
  }
  if (page === "taller") {
    injectStudioLikeGrid("[data-studio-grid]", window.__TT_STUDIO_IMAGES__);
  }

  if (!galleryGrid) {
    return;
  }

  const GALLERY_LEGACY_FILTERS = {
    bordado: "bordados",
    obras: "telar",
    telar: "telar",
    dibujo: "dibujos",
    arcilla: "plasticina",
    "dibujo-sin-marco": "dibujos",
    monstruos: "dibujos",
    piedras: "dibujos",
  };

  let activeFilter = (function readFilterFromURL() {
    const q = new URLSearchParams(location.search).get("f") || new URLSearchParams(location.search).get("filter");
    if (!q || q === "all") return "all";
    const mapped = GALLERY_LEGACY_FILTERS[q] || q;
    if (mapped === "all") return "all";
    return GALLERY_SECTION_KEYS.includes(mapped) ? mapped : "all";
  })();

  let visibleItems = [];
  let lightboxIndex = 0;
  /** @type {HTMLElement | null} */
  let lastGalleryFocus = null;

  const countEl = document.getElementById("gallery-visible-count");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxPrice = document.getElementById("lightbox-price");
  const lightboxLink = document.getElementById("lightbox-link");

  /** Orden fijo por carpeta del archivo; dentro de cada una, por id. */
  function sortForGallery(a, b) {
    const ia = GALLERY_SECTION_KEYS.indexOf(a.category);
    const ib = GALLERY_SECTION_KEYS.indexOf(b.category);
    if (ia !== ib) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
    return a.id - b.id;
  }

  function renderGallery() {
    galleryGrid.innerHTML = "";
    const labels = categoryLabels();
    const sorted = [...enriched].sort(sortForGallery);

    const bySection = new Map();
    GALLERY_SECTION_KEYS.forEach((k) => bySection.set(k, []));
    for (const item of sorted) {
      const list = bySection.get(item.category);
      if (list) list.push(item);
      else bySection.get("dibujos").push(item);
    }

    for (const sectionKey of GALLERY_SECTION_KEYS) {
      const items = bySection.get(sectionKey) || [];
      if (!items.length) continue;

      const sectionEl = document.createElement("section");
      sectionEl.className = "gallery-section";
      sectionEl.dataset.section = sectionKey;
      sectionEl.id = `galeria-${sectionKey}`;

      const h2 = document.createElement("h2");
      h2.className = "gallery-section-title";
      h2.textContent = labels[sectionKey] || sectionKey;

      const grid = document.createElement("div");
      grid.className = "gallery-grid gallery-grid--section";

      items.forEach((item, localIndex) => {
        const show = activeFilter === "all" || item.category === activeFilter;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "gallery-item";
        if (localIndex % 8 === 0) {
          btn.classList.add("gallery-item--featured");
        }
        btn.dataset.category = item.category;
        if (!show) btn.hidden = true;

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.sizes = "(max-width: 600px) 50vw, 280px";

        btn.append(img);

        btn.addEventListener("click", () => {
          lastGalleryFocus = btn;
          openLightboxForFiltered(item);
        });
        grid.appendChild(btn);
      });

      sectionEl.append(h2, grid);
      galleryGrid.appendChild(sectionEl);
    }

    applyFilter(activeFilter, { silent: true });
  }

  function updateVisibleCount() {
    const n = document.querySelectorAll(".gallery-item:not([hidden])").length;
    if (countEl) countEl.textContent = String(n);
  }

  /** @param {string} filter @param {{ silent?: boolean }} [opts] */
  function applyFilter(filter, opts) {
    activeFilter = filter;
    document.querySelectorAll("[data-filter]").forEach((el) => {
      el.classList.toggle("is-active", el.getAttribute("data-filter") === filter);
    });
    document.querySelectorAll(".gallery-section").forEach((sec) => {
      const key = sec.getAttribute("data-section");
      const showSec = filter === "all" || key === filter;
      sec.hidden = !showSec;
    });
    document.querySelectorAll(".gallery-item").forEach((el) => {
      const cat = el.dataset.category;
      const show = filter === "all" || cat === filter;
      el.hidden = !show;
    });
    updateVisibleCount();
    const q = filter === "all" ? "" : `?f=${filter}`;
    const base = `${location.pathname}`;
    if (history.replaceState) {
      history.replaceState(null, "", q ? `${base}${q}` : base);
    }
    if (!opts?.silent) {
      const first = document.querySelector(".gallery-item:not([hidden])");
      if (first) first.focus({ preventScroll: true });
    }
  }

  function filteredList() {
    return [...enriched].sort(sortForGallery).filter((p) => activeFilter === "all" || p.category === activeFilter);
  }

  function openLightboxForFiltered(product) {
    const list = filteredList();
    const idx = list.findIndex((p) => p.id === product.id);
    lightboxIndex = idx >= 0 ? idx : 0;
    visibleItems = list;
    openLightbox();
  }

  function openLightbox() {
    if (!lightbox || visibleItems.length === 0) return;
    const item = visibleItems[lightboxIndex];
    if (!item) return;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxImg.src = item.image;
    lightboxImg.alt = "";
    const isObra = page === "obra";
    if (isObra) {
      lightboxTitle.textContent = "";
      lightboxTitle.setAttribute("hidden", "");
      lightboxPrice.textContent = "";
      lightboxPrice.setAttribute("hidden", "");
    } else {
      lightboxTitle.removeAttribute("hidden");
      lightboxPrice.removeAttribute("hidden");
      lightboxTitle.textContent = item.name;
      lightboxPrice.textContent = formatPrice(item.price, item.currency);
    }
    lightboxLink.href = item.url;
    if (lightboxLink) lightboxLink.textContent = I18N.t("lightbox.detail");
    lightbox.querySelector("#lightbox-close")?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImg.src = "";
    lastGalleryFocus?.focus({ preventScroll: true });
    lastGalleryFocus = null;
  }

  function lightboxStep(delta) {
    if (visibleItems.length === 0) return;
    lightboxIndex = (lightboxIndex + delta + visibleItems.length) % visibleItems.length;
    openLightbox();
  }

  document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
  document.getElementById("lightbox-prev")?.addEventListener("click", () => lightboxStep(-1));
  document.getElementById("lightbox-next")?.addEventListener("click", () => lightboxStep(1));
  lightbox?.querySelectorAll("[data-close-lightbox]").forEach((el) => {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox || lightbox.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeLightbox();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      lightboxStep(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      lightboxStep(1);
    }
  });

  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-filter");
      if (f) applyFilter(f);
    });
  });

  function initGalleryTilt() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.addEventListener(
      "pointermove",
      (e) => {
        const t = /** @type {HTMLElement | null} */ (e.target.closest?.(".gallery-item"));
        document.querySelectorAll(".gallery-item.is-tilted").forEach((b) => {
          if (b !== t) {
            b.classList.remove("is-tilted");
            b.style.removeProperty("--gx");
            b.style.removeProperty("--gy");
          }
        });
        if (!t) return;
        const r = t.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        t.style.setProperty("--gx", `${(x * 8).toFixed(2)}deg`);
        t.style.setProperty("--gy", `${(-y * 8).toFixed(2)}deg`);
        t.classList.add("is-tilted");
      },
      { passive: true }
    );
  }

  window.addEventListener("tt-locale-change", () => {
    renderGallery();
    if (lightbox && !lightbox.hidden && visibleItems.length) {
      openLightbox();
    }
  });

  renderGallery();
  initGalleryTilt();
})();
