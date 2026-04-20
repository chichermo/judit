(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const CATALOG = window.TT_ADMIN_CATALOG;
  if (!CATALOG) {
    console.error("[admin] Falta js/admin-catalog.js");
  }

  const elLogin = $("admin-login");
  const elPanel = $("admin-panel");
  const loginMsg = $("login-msg");
  const saveMsg = $("save-msg");
  const appRoot = $("admin-app-root");

  /** @type {Record<string, Record<string, string>>} */
  let stateI18n = {};
  /** @type {{ add: object[], removeIds: number[] }} */
  let stateGallery = { add: [], removeIds: [] };
  /** @type {{ slides: {image:string,url:string}[], mode: string, prepend: boolean }} */
  let stateHero = { slides: [], mode: "append", prepend: false };

  let activeTab = "texts";
  let textGroupId = CATALOG?.textGroups[0]?.id || "";
  let textFieldKey = "";
  let textLang = "es";

  function showMsg(el, text, kind) {
    el.textContent = text;
    el.className = "admin-msg " + (kind || "");
  }

  function deepClone(o) {
    return JSON.parse(JSON.stringify(o));
  }

  function pruneI18n(i18n) {
    const out = {};
    const langs = CATALOG?.langs || [];
    for (const { id: lang } of langs) {
      const block = i18n[lang];
      if (!block || typeof block !== "object") continue;
      out[lang] = {};
      for (const k of Object.keys(block)) {
        const v = block[k];
        if (v != null && String(v).trim() !== "") out[lang][k] = v;
      }
      if (Object.keys(out[lang]).length === 0) delete out[lang];
    }
    return out;
  }

  async function loadSession() {
    const r = await fetch("/api/session", { credentials: "same-origin" });
    const d = await r.json().catch(() => ({}));
    return !!d.ok;
  }

  async function loadSiteData() {
    const r = await fetch("/api/site-data", { credentials: "same-origin" });
    if (!r.ok) throw new Error("load");
    return r.json();
  }

  function syncStateFromServer(data) {
    stateI18n = deepClone(data.i18n || {});
    stateGallery = {
      add: Array.isArray(data.gallery?.add) ? deepClone(data.gallery.add) : [],
      removeIds: Array.isArray(data.gallery?.removeIds) ? data.gallery.removeIds.map(Number) : [],
    };
    const h = data.heroCarousel;
    stateHero = {
      slides: Array.isArray(h?.slides) ? deepClone(h.slides) : [],
      mode: h?.mode === "replace" ? "replace" : "append",
      prepend: !!h?.prepend,
    };
  }

  function nextPieceId() {
    const local = window.__TT_GALLERY_LOCAL__ || [];
    const ids = local.map((p) => Number(p.id)).filter((n) => Number.isFinite(n));
    for (const p of stateGallery.add) {
      const n = Number(p.id);
      if (Number.isFinite(n)) ids.push(n);
    }
    return ids.length ? Math.max(...ids) + 1 : 10001;
  }

  function getFieldMeta(groupId, key) {
    const g = CATALOG.textGroups.find((x) => x.id === groupId);
    if (!g) return null;
    return g.fields.find((f) => f.key === key) || null;
  }

  function renderTabsNav() {
    const nav = document.createElement("div");
    nav.className = "admin-tabs-nav";
    const tabs = [
      { id: "texts", label: "Textos" },
      { id: "gallery", label: "Galería Obra" },
      { id: "hero", label: "Carrusel inicio" },
      { id: "advanced", label: "Avanzado (JSON)" },
    ];
    for (const t of tabs) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "admin-tab-btn" + (activeTab === t.id ? " is-active" : "");
      b.textContent = t.label;
      b.addEventListener("click", () => {
        activeTab = t.id;
        renderAppBody();
      });
      nav.appendChild(b);
    }
    return nav;
  }

  function renderTextEditor() {
    const wrap = document.createElement("div");
    wrap.className = "admin-stack";

    const row1 = document.createElement("div");
    row1.className = "admin-field-row";
    const labG = document.createElement("label");
    labG.htmlFor = "admin-sel-group";
    labG.textContent = "1. Sección del sitio";
    const selG = document.createElement("select");
    selG.id = "admin-sel-group";
    for (const g of CATALOG.textGroups) {
      const o = document.createElement("option");
      o.value = g.id;
      o.textContent = g.label;
      selG.appendChild(o);
    }
    selG.value = textGroupId;
    selG.addEventListener("change", () => {
      textGroupId = selG.value;
      const g = CATALOG.textGroups.find((x) => x.id === textGroupId);
      textFieldKey = g?.fields[0]?.key || "";
      renderAppBody();
    });
    row1.append(labG, selG);

    const row2 = document.createElement("div");
    row2.className = "admin-field-row";
    const labF = document.createElement("label");
    labF.htmlFor = "admin-sel-field";
    labF.textContent = "2. Texto a editar";
    const selF = document.createElement("select");
    selF.id = "admin-sel-field";
    const grp = CATALOG.textGroups.find((x) => x.id === textGroupId);
    const fields = grp?.fields || [];
    for (const f of fields) {
      const o = document.createElement("option");
      o.value = f.key;
      o.textContent = f.label;
      selF.appendChild(o);
    }
    if (fields.length && !fields.some((f) => f.key === textFieldKey)) {
      textFieldKey = fields[0].key;
    }
    selF.value = textFieldKey;
    selF.addEventListener("change", () => {
      textFieldKey = selF.value;
      renderAppBody();
    });
    row2.append(labF, selF);

    const row3 = document.createElement("div");
    row3.className = "admin-field-row";
    const labL = document.createElement("label");
    labL.htmlFor = "admin-sel-lang";
    labL.textContent = "3. Idioma";
    const selL = document.createElement("select");
    selL.id = "admin-sel-lang";
    for (const L of CATALOG.langs) {
      const o = document.createElement("option");
      o.value = L.id;
      o.textContent = L.label;
      selL.appendChild(o);
    }
    selL.value = textLang;
    selL.addEventListener("change", () => {
      textLang = selL.value;
      renderAppBody();
    });
    row3.append(labL, selL);

    const meta = getFieldMeta(textGroupId, textFieldKey);
    const ta = document.createElement("textarea");
    ta.className = "admin-textarea-user";
    ta.rows = meta?.html ? 8 : 5;
    ta.spellcheck = true;
    if (!stateI18n[textLang]) stateI18n[textLang] = {};
    ta.value = stateI18n[textLang][textFieldKey] ?? "";
    ta.placeholder =
      meta?.html
        ? "Escribe el texto. Puedes usar etiquetas HTML simples (<p>, <strong>…)."
        : "Escribe el nuevo texto. Déjalo vacío y guarda para volver al texto original del sitio.";
    ta.addEventListener("input", () => {
      if (!stateI18n[textLang]) stateI18n[textLang] = {};
      stateI18n[textLang][textFieldKey] = ta.value;
    });

    const hint = document.createElement("p");
    hint.className = "admin-hint";
    hint.textContent = meta?.html
      ? "Este campo admite HTML básico (párrafos, negritas)."
      : "Texto plano. Sin código salvo que el campo indique HTML.";

    const actions = document.createElement("div");
    actions.className = "admin-inline-actions";
    const btnClear = document.createElement("button");
    btnClear.type = "button";
    btnClear.className = "btn-ghost";
    btnClear.textContent = "Quitar este cambio (volver al original)";
    btnClear.addEventListener("click", () => {
      if (stateI18n[textLang]) delete stateI18n[textLang][textFieldKey];
      renderAppBody();
    });
    actions.appendChild(btnClear);

    wrap.append(row1, row2, row3, hint, ta, actions);
    return wrap;
  }

  function renderGalleryTab() {
    const wrap = document.createElement("div");
    wrap.className = "admin-stack";

    const intro = document.createElement("p");
    intro.className = "admin-lead-in";
    intro.textContent =
      "Añade piezas nuevas a la galería Obra u oculta piezas del catálogo base sin borrarlas del proyecto.";

    const hAdd = document.createElement("h3");
    hAdd.className = "admin-subtitle";
    hAdd.textContent = "Añadir una pieza nueva";

    const form = document.createElement("div");
    form.className = "admin-card admin-card--inner";

    const fields = [
      ["Nombre visible (opcional)", "new-name", "text", ""],
      ["URL de la imagen", "new-image", "text", "https://…"],
      ["Enlace a la tienda (Etsy)", "new-url", "url", "https://www.etsy.com/…"],
      ["Precio (número)", "new-price", "text", ""],
      ["Moneda (EUR, USD…)", "new-currency", "text", "EUR"],
      ["Número ID único", "new-id", "number", String(nextPieceId())],
    ];

    const inputs = {};
    for (const [lab, id, type, ph] of fields) {
      const row = document.createElement("div");
      row.className = "admin-field-row";
      const l = document.createElement("label");
      l.htmlFor = id;
      l.textContent = lab;
      const inp = document.createElement("input");
      inp.id = id;
      inp.type = type;
      inp.placeholder = ph;
      if (id === "new-id") inp.value = String(nextPieceId());
      inputs[id] = inp;
      row.append(l, inp);
      form.appendChild(row);
    }

    const rowCat = document.createElement("div");
    rowCat.className = "admin-field-row";
    const lCat = document.createElement("label");
    lCat.htmlFor = "new-cat";
    lCat.textContent = "Sección (categoría) en la galería";
    const selCat = document.createElement("select");
    selCat.id = "new-cat";
    for (const c of CATALOG.galleryCategories) {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.label;
      selCat.appendChild(o);
    }
    rowCat.append(lCat, selCat);

    const rowOrd = document.createElement("div");
    rowOrd.className = "admin-field-row";
    const lOrd = document.createElement("label");
    lOrd.htmlFor = "new-order";
    lOrd.textContent = "Orden dentro de la sección (número menor = más arriba)";
    const inpOrd = document.createElement("input");
    inpOrd.id = "new-order";
    inpOrd.type = "number";
    inpOrd.placeholder = "Opcional (ej. 10 = antes que 20)";
    inpOrd.value = "";
    rowOrd.append(lOrd, inpOrd);
    const hintOrd = document.createElement("p");
    hintOrd.className = "admin-hint";
    hintOrd.textContent =
      "Si no lo rellenas, se usa el ID. Ajusta el número para colocar la pieza antes o después de otras en la misma categoría.";

    const btnAdd = document.createElement("button");
    btnAdd.type = "button";
    btnAdd.textContent = "Añadir pieza a la lista";
    btnAdd.addEventListener("click", () => {
      const image = inputs["new-image"].value.trim();
      if (!image) {
        alert("Indica la URL de la imagen (puedes subirla abajo y pegar la URL).");
        return;
      }
      const id = Number(inputs["new-id"].value);
      if (!Number.isFinite(id) || id < 1) {
        alert("El ID debe ser un número positivo y único.");
        return;
      }
      const orderRaw = inpOrd.value.trim();
      const piece = {
        id,
        name: inputs["new-name"].value.trim(),
        image,
        price: inputs["new-price"].value.trim(),
        currency: inputs["new-currency"].value.trim() || "EUR",
        url: inputs["new-url"].value.trim() || "https://www.etsy.com/shop/juditlarae/",
        category: selCat.value,
      };
      if (orderRaw !== "") {
        const o = Number(orderRaw);
        if (Number.isFinite(o)) piece.orderInSection = o;
      }
      stateGallery.add.push(piece);
      renderAppBody();
    });

    form.append(rowCat, rowOrd, hintOrd, btnAdd);
    wrap.append(intro, hAdd, form);

    const hList = document.createElement("h3");
    hList.className = "admin-subtitle";
    hList.textContent = "Piezas añadidas desde el panel";
    wrap.appendChild(hList);

    if (!stateGallery.add.length) {
      const p = document.createElement("p");
      p.className = "admin-hint";
      p.textContent = "Todavía no hay piezas extra. Usa el formulario de arriba.";
      wrap.appendChild(p);
    } else {
      const list = document.createElement("ul");
      list.className = "admin-gallery-list";
      stateGallery.add.forEach((p, idx) => {
        const li = document.createElement("li");
        li.className = "admin-gallery-li";
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = "";
        img.width = 72;
        img.height = 72;
        img.loading = "lazy";
        const info = document.createElement("div");
        info.className = "admin-gallery-li-info";
        const line1 = document.createElement("div");
        line1.textContent =
          "ID " +
          p.id +
          " · " +
          (CATALOG.galleryCategories.find((c) => c.id === p.category)?.label || p.category) +
          (p.orderInSection != null ? " · orden " + p.orderInSection : "");
        const line2 = document.createElement("div");
        line2.className = "muted";
        line2.textContent = p.name || "Sin nombre";
        info.append(line1, line2);
        const btnRm = document.createElement("button");
        btnRm.type = "button";
        btnRm.className = "btn-ghost btn-small";
        btnRm.textContent = "Eliminar";
        btnRm.addEventListener("click", () => {
          stateGallery.add.splice(idx, 1);
          renderAppBody();
        });
        li.append(img, info, btnRm);
        list.appendChild(li);
      });
      wrap.appendChild(list);
    }

    const local = window.__TT_GALLERY_LOCAL__ || [];
    if (local.length) {
      const hHide = document.createElement("h3");
      hHide.className = "admin-subtitle";
      hHide.textContent = "Ocultar piezas del catálogo original";
      const pHide = document.createElement("p");
      pHide.className = "admin-hint";
      pHide.textContent =
        "Marca las piezas que no quieres que se muestren (el archivo sigue en el sitio; solo se ocultan en la galería).";
      const grid = document.createElement("div");
      grid.className = "admin-hide-grid";
      const removeSet = new Set(stateGallery.removeIds);
      for (const item of local) {
        const id = Number(item.id);
        const lab = document.createElement("label");
        lab.className = "admin-hide-item";
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.checked = removeSet.has(id);
        cb.addEventListener("change", () => {
          const next = new Set(stateGallery.removeIds);
          if (cb.checked) next.add(id);
          else next.delete(id);
          stateGallery.removeIds = [...next].sort((a, b) => a - b);
        });
        const thumb = document.createElement("img");
        thumb.src = item.image;
        thumb.alt = "";
        const span = document.createElement("span");
        span.textContent = "ID " + id;
        lab.append(cb, thumb, span);
        grid.appendChild(lab);
      }
      wrap.append(hHide, pHide, grid);
    }

    return wrap;
  }

  function renderHeroTab() {
    const wrap = document.createElement("div");
    wrap.className = "admin-stack";

    const intro = document.createElement("p");
    intro.className = "admin-lead-in";
    intro.textContent =
      "El carrusel es la zona de imágenes grandes en la página de inicio. Puedes añadir fotos al final (o al inicio) o sustituir toda la lista por la que definas aquí.";

    const modeRow = document.createElement("div");
    modeRow.className = "admin-field-row admin-field-row--radio";
    const lab = document.createElement("span");
    lab.textContent = "Modo";
    const rAppend = document.createElement("input");
    rAppend.type = "radio";
    rAppend.name = "hero-mode";
    rAppend.id = "hero-append";
    rAppend.checked = stateHero.mode !== "replace";
    const lApp = document.createElement("label");
    lApp.htmlFor = "hero-append";
    lApp.textContent = "Añadir imágenes (recomendado)";
    const rRep = document.createElement("input");
    rRep.type = "radio";
    rRep.name = "hero-mode";
    rRep.id = "hero-replace";
    rRep.checked = stateHero.mode === "replace";
    const lRep = document.createElement("label");
    lRep.htmlFor = "hero-replace";
    lRep.textContent = "Reemplazar todo el carrusel (solo las que pongas aquí)";
    rAppend.addEventListener("change", () => {
      stateHero.mode = "append";
      renderAppBody();
    });
    rRep.addEventListener("change", () => {
      stateHero.mode = "replace";
      renderAppBody();
    });
    modeRow.append(lab, rAppend, lApp, rRep, lRep);

    const prepRow = document.createElement("div");
    prepRow.className = "admin-field-row";
    const prep = document.createElement("input");
    prep.type = "checkbox";
    prep.id = "hero-prepend";
    prep.checked = stateHero.prepend;
    prep.disabled = stateHero.mode === "replace";
    prep.addEventListener("change", () => {
      stateHero.prepend = prep.checked;
    });
    const lp = document.createElement("label");
    lp.htmlFor = "hero-prepend";
    lp.textContent = "Mostrar estas diapositivas antes que las del sitio (solo si «Añadir imágenes»)";
    prepRow.append(prep, lp);

    const hSlides = document.createElement("h3");
    hSlides.className = "admin-subtitle";
    hSlides.textContent = "Diapositivas extra";

    const slideList = document.createElement("div");
    slideList.className = "admin-hero-slides";
    stateHero.slides.forEach((s, i) => {
      const card = document.createElement("div");
      card.className = "admin-hero-slide";
      const img = document.createElement("img");
      img.src = s.image;
      img.alt = "";
      const urlInp = document.createElement("input");
      urlInp.type = "url";
      urlInp.value = s.url || "";
      urlInp.placeholder = "Enlace al hacer clic";
      urlInp.addEventListener("input", () => {
        stateHero.slides[i].url = urlInp.value.trim();
      });
      const imgInp = document.createElement("input");
      imgInp.type = "text";
      imgInp.value = s.image;
      imgInp.addEventListener("input", () => {
        stateHero.slides[i].image = imgInp.value.trim();
        img.src = imgInp.value.trim() || img.src;
      });
      const rowBtn = document.createElement("div");
      rowBtn.className = "admin-slide-btns";
      const up = document.createElement("button");
      up.type = "button";
      up.className = "btn-ghost btn-small";
      up.textContent = "↑";
      up.disabled = i === 0;
      up.addEventListener("click", () => {
        if (i <= 0) return;
        const t = stateHero.slides[i - 1];
        stateHero.slides[i - 1] = stateHero.slides[i];
        stateHero.slides[i] = t;
        renderAppBody();
      });
      const down = document.createElement("button");
      down.type = "button";
      down.className = "btn-ghost btn-small";
      down.textContent = "↓";
      down.disabled = i >= stateHero.slides.length - 1;
      down.addEventListener("click", () => {
        if (i >= stateHero.slides.length - 1) return;
        const t = stateHero.slides[i + 1];
        stateHero.slides[i + 1] = stateHero.slides[i];
        stateHero.slides[i] = t;
        renderAppBody();
      });
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "btn-ghost btn-small";
      rm.textContent = "Quitar";
      rm.addEventListener("click", () => {
        stateHero.slides.splice(i, 1);
        renderAppBody();
      });
      rowBtn.append(up, down, rm);
      card.append(img, imgInp, urlInp, rowBtn);
      slideList.appendChild(card);
    });

    const addRow = document.createElement("div");
    addRow.className = "admin-card admin-card--inner";
    const lImg = document.createElement("label");
    lImg.htmlFor = "hero-new-img";
    lImg.textContent = "URL de imagen nueva";
    const inImg = document.createElement("input");
    inImg.id = "hero-new-img";
    inImg.type = "text";
    inImg.placeholder = "https://…";
    const lUrl = document.createElement("label");
    lUrl.htmlFor = "hero-new-url";
    lUrl.textContent = "Enlace al hacer clic";
    const inUrl = document.createElement("input");
    inUrl.id = "hero-new-url";
    inUrl.type = "url";
    inUrl.value = "https://www.etsy.com/shop/juditlarae/";
    const btnAddS = document.createElement("button");
    btnAddS.type = "button";
    btnAddS.textContent = "Añadir diapositiva";
    btnAddS.addEventListener("click", () => {
      const image = inImg.value.trim();
      if (!image) {
        alert("Indica la URL de la imagen.");
        return;
      }
      stateHero.slides.push({
        image,
        url: inUrl.value.trim() || "https://www.etsy.com/shop/juditlarae/",
      });
      inImg.value = "";
      renderAppBody();
    });
    addRow.append(lImg, inImg, lUrl, inUrl, btnAddS);

    wrap.append(intro, modeRow, prepRow, hSlides, slideList, addRow);
    return wrap;
  }

  function renderAdvancedTab() {
    const wrap = document.createElement("div");
    wrap.className = "admin-stack";
    const p = document.createElement("p");
    p.className = "admin-hint";
    p.textContent =
      "Solo para uso experto. Puedes copiar un respaldo o editar a mano. «Guardar cambios» del pie aplica también esto.";

    const h1 = document.createElement("p");
    h1.className = "admin-adv-label";
    h1.innerHTML = "<strong>Textos (i18n)</strong>";
    const taI = document.createElement("textarea");
    taI.className = "admin-textarea";
    taI.spellcheck = false;
    taI.value = JSON.stringify(stateI18n, null, 2);

    const h2 = document.createElement("p");
    h2.className = "admin-adv-label";
    h2.innerHTML = "<strong>Galería</strong>";
    const taG = document.createElement("textarea");
    taG.className = "admin-textarea";
    taG.spellcheck = false;
    taG.value = JSON.stringify(stateGallery, null, 2);

    const h3 = document.createElement("p");
    h3.className = "admin-adv-label";
    h3.innerHTML = "<strong>Carrusel inicio</strong>";
    const taH = document.createElement("textarea");
    taH.className = "admin-textarea";
    taH.spellcheck = false;
    taH.value = JSON.stringify(stateHero, null, 2);

    wrap.append(p, h1, taI, h2, taG, h3, taH);
    return wrap;
  }

  function renderAppBody() {
    if (!appRoot || !CATALOG) return;
    appRoot.innerHTML = "";
    appRoot.appendChild(renderTabsNav());
    const panel = document.createElement("div");
    panel.className = "admin-tab-panel";
    if (activeTab === "texts") panel.appendChild(renderTextEditor());
    else if (activeTab === "gallery") panel.appendChild(renderGalleryTab());
    else if (activeTab === "hero") panel.appendChild(renderHeroTab());
    else panel.appendChild(renderAdvancedTab());
    appRoot.appendChild(panel);
  }

  async function refreshPanel() {
    const ok = await loadSession();
    if (!ok) {
      elLogin.classList.remove("admin-hidden");
      elPanel.classList.add("admin-hidden");
      return;
    }
    elLogin.classList.add("admin-hidden");
    elPanel.classList.remove("admin-hidden");
    try {
      const data = await loadSiteData();
      syncStateFromServer(data);
      if (!textFieldKey) {
        const g = CATALOG.textGroups[0];
        textGroupId = g?.id || "";
        textFieldKey = g?.fields[0]?.key || "";
      }
      renderAppBody();
      showMsg(saveMsg, "", "");
    } catch {
      showMsg(saveMsg, "No se pudieron cargar los datos.", "error");
    }
  }

  $("form-login")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginMsg.textContent = "";
    const username = $("admin-user").value.trim();
    const password = $("admin-pass").value;
    const r = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (d.error === "invalid_credentials") {
        showMsg(loginMsg, "Usuario o contraseña incorrectos.", "error");
      } else if (d.error === "server_not_configured" && d.hint) {
        showMsg(loginMsg, d.hint, "error");
      } else if (r.status === 503) {
        showMsg(
          loginMsg,
          "Servidor no listo (503). Abre /api/health en el mismo sitio: si auth es false, falta configurar ADMIN_PASSWORD y AUTH_SECRET en Vercel.",
          "error"
        );
      } else {
        showMsg(loginMsg, "No se pudo iniciar sesión.", "error");
      }
      return;
    }
    $("admin-pass").value = "";
    await refreshPanel();
  });

  $("btn-logout")?.addEventListener("click", async () => {
    await fetch("/api/logout", { method: "POST", credentials: "same-origin" });
    elPanel.classList.add("admin-hidden");
    elLogin.classList.remove("admin-hidden");
  });

  $("btn-save")?.addEventListener("click", async () => {
    saveMsg.textContent = "";
    if (activeTab === "advanced" && appRoot) {
      const tas = appRoot.querySelectorAll("textarea.admin-textarea");
      try {
        if (tas[0]) stateI18n = JSON.parse(tas[0].value || "{}");
        if (tas[1]) stateGallery = JSON.parse(tas[1].value || "{}");
        if (tas[2]) stateHero = JSON.parse(tas[2].value || "{}");
      } catch {
        showMsg(saveMsg, "Revisa el JSON en la pestaña Avanzado.", "error");
        return;
      }
    }

    const payload = {
      i18n: pruneI18n(stateI18n),
      gallery: {
        add: stateGallery.add || [],
        removeIds: (stateGallery.removeIds || []).map(Number).filter((n) => Number.isFinite(n)),
      },
      heroCarousel: {
        slides: (stateHero.slides || []).map((s) => ({
          image: String(s.image || "").trim(),
          url: String(s.url || "").trim() || "https://www.etsy.com/shop/juditlarae/",
        })),
        mode: stateHero.mode === "replace" ? "replace" : "append",
        prepend: !!stateHero.prepend,
      },
    };

    const r = await fetch("/api/admin-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify(payload),
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 503 && d.error === "blob_not_configured") {
      showMsg(saveMsg, "Falta configurar Vercel Blob (BLOB_READ_WRITE_TOKEN) en el proyecto.", "error");
      return;
    }
    if (!r.ok) {
      showMsg(saveMsg, d.error === "unauthorized" ? "Sesión caducada. Vuelve a entrar." : "Error al guardar.", "error");
      return;
    }
    showMsg(saveMsg, "Guardado correctamente. Recarga la página pública para ver los cambios.", "ok");
    await refreshPanel();
  });

  $("btn-upload")?.addEventListener("click", async () => {
    const uploadResult = $("upload-result");
    if (!uploadResult) return;
    uploadResult.textContent = "";
    const input = $("admin-file");
    const file = input?.files?.[0];
    if (!file) {
      uploadResult.textContent = "Elige un archivo.";
      uploadResult.className = "admin-msg error";
      return;
    }
    const fd = new FormData();
    fd.append("file", file);
    const r = await fetch("/api/admin-upload", { method: "POST", credentials: "same-origin", body: fd });
    const d = await r.json().catch(() => ({}));
    if (r.status === 503 && d.error === "blob_not_configured") {
      uploadResult.textContent = "Blob no configurado en el servidor.";
      uploadResult.className = "admin-msg error";
      return;
    }
    if (!r.ok || !d.url) {
      uploadResult.textContent = "Error al subir.";
      uploadResult.className = "admin-msg error";
      return;
    }
    uploadResult.textContent = "URL: " + d.url;
    uploadResult.className = "admin-msg ok";
    try {
      await navigator.clipboard.writeText(d.url);
      uploadResult.textContent += " (copiada al portapapeles). Pégala en «URL de la imagen» o en el carrusel.";
    } catch {
      /* noop */
    }
  });

  refreshPanel();
})();
