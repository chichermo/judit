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

  const products = /** @type {Product[]} */ (window.__TT_PRODUCTS__ || []);

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
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

  const enriched = products.map((p) => ({
    ...p,
    category: categorize(p.name),
  }));

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

  function initHeroCarousel() {
    const track = document.getElementById("hero-carousel-track");
    const root = document.getElementById("hero-carousel");
    const prevBtn = document.getElementById("hero-carousel-prev");
    const nextBtn = document.getElementById("hero-carousel-next");
    const dotsEl = document.getElementById("hero-carousel-dots");
    const counterEl = document.getElementById("hero-carousel-counter");
    if (!track || !enriched.length) return;

    enriched.forEach((p, i) => {
      const a = document.createElement("a");
      a.className = "hero-carousel-slide";
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.name;
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

    const slides = track.querySelectorAll(".hero-carousel-slide");
    const n = slides.length;
    let index = 0;
    const maxDots = 12;
    const autoplayMs = 5000;

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
      if (n <= 1) return;
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

    root?.addEventListener("mouseenter", stopAutoplay);
    root?.addEventListener("mouseleave", startAutoplay);
    root?.addEventListener("focusin", stopAutoplay);
    root?.addEventListener("focusout", () => {
      if (root && !root.contains(document.activeElement)) startAutoplay();
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
    initHeroCarousel();
    initHeroParallax();
    initCursorGlow();
  }

  initReveal();

  if (!galleryGrid) {
    return;
  }

  let activeFilter = (function readFilterFromURL() {
    const q = new URLSearchParams(location.search).get("f") || new URLSearchParams(location.search).get("filter");
    if (!q || q === "all") return "all";
    const allowed = ["bordado", "telar", "dibujo", "arcilla"];
    return allowed.includes(q) ? q : "all";
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

  function renderGallery() {
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
