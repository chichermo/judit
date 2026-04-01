(function () {
  "use strict";

  /** @typedef {{ id: number, name: string, image: string, price: string, currency: string, url: string }} Product */

  const I18N = window.TT_I18N;

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

  const products = /** @type {Product[]} */ (window.__TT_PRODUCTS__ || []);
  const enriched = products.map((p) => ({
    ...p,
    category: categorize(p.name),
  }));

  let activeFilter = "all";
  /** @type {typeof enriched} */
  let visibleItems = [];
  let lightboxIndex = 0;
  /** @type {HTMLElement | null} */
  let lastGalleryFocus = null;

  const galleryGrid = document.getElementById("gallery-grid");
  const countEl = document.getElementById("gallery-visible-count");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxPrice = document.getElementById("lightbox-price");
  const lightboxLink = document.getElementById("lightbox-link");
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const yearEl = document.getElementById("year");
  const heroImg = document.getElementById("hero-img");

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

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

  function setHeroFromCatalog() {
    if (!heroImg) return;
    const first = enriched[0];
    if (first?.image) {
      heroImg.src = first.image;
    }
    heroImg.alt = I18N.t("hero.imgAlt");
  }

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";
    const labels = categoryLabels();

    enriched.forEach((item, index) => {
      const show = activeFilter === "all" || item.category === activeFilter;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-item";
      if (index % 8 === 0) {
        btn.classList.add("gallery-item--featured");
      }
      btn.dataset.category = item.category;
      btn.dataset.index = String(index);
      if (!show) {
        btn.hidden = true;
      }

      const img = document.createElement("img");
      img.src = item.image;
      img.alt = item.name;
      img.loading = "lazy";
      img.decoding = "async";
      img.sizes = "(max-width: 600px) 50vw, 280px";

      const body = document.createElement("div");
      body.className = "gallery-item-body";

      const title = document.createElement("p");
      title.className = "gallery-item-title";
      title.textContent = item.name;

      const price = document.createElement("p");
      price.className = "gallery-item-price";
      price.textContent = formatPrice(item.price, item.currency);

      const tag = document.createElement("span");
      tag.className = "gallery-item-tag";
      tag.textContent = labels[item.category] || item.category;

      body.append(title, price, tag);
      btn.append(img, body);

      btn.addEventListener("click", () => {
        lastGalleryFocus = btn;
        openLightboxForFiltered(item);
      });
      galleryGrid.appendChild(btn);
    });

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
    document.querySelectorAll(".gallery-item").forEach((el) => {
      const cat = el.dataset.category;
      const show = filter === "all" || cat === filter;
      el.hidden = !show;
    });
    updateVisibleCount();
    if (!opts?.silent) {
      const first = document.querySelector(".gallery-item:not([hidden])");
      if (first) first.focus({ preventScroll: true });
    }
  }

  function filteredList() {
    return enriched.filter((p) => activeFilter === "all" || p.category === activeFilter);
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
    lightboxImg.alt = item.name;
    lightboxTitle.textContent = item.name;
    lightboxPrice.textContent = formatPrice(item.price, item.currency);
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

  const sectionIds = ["inicio", "sobre", "colecciones", "galeria", "contacto"];
  const navObservers = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (!id) return;
        document.querySelectorAll("[data-nav]").forEach((a) => {
          const href = a.getAttribute("href");
          if (href === `#${id}`) {
            a.setAttribute("aria-current", "page");
          } else {
            a.removeAttribute("aria-current");
          }
        });
      });
    },
    { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
  );

  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) navObservers.observe(el);
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

  function initHeroParallax() {
    const root = document.getElementById("hero-parallax-root");
    const visual = document.querySelector("[data-hero-visual]");
    if (!root || !visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    /** @param {number} mx */
    /** @param {number} my */
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

    root.addEventListener(
      "pointermove",
      (e) => {
        onMove(e.clientX, e.clientY);
      },
      { passive: true }
    );
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
    setHeroFromCatalog();
    renderGallery();
    if (lightbox && !lightbox.hidden && visibleItems.length) {
      openLightbox();
    }
  });

  setHeroFromCatalog();
  renderGallery();
  initReveal();
  initHeroParallax();
  initCursorGlow();
  initGalleryTilt();
})();
