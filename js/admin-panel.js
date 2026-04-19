(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const elLogin = $("admin-login");
  const elPanel = $("admin-panel");
  const loginMsg = $("login-msg");
  const saveMsg = $("save-msg");
  const taI18n = $("admin-i18n-json");
  const taGallery = $("admin-gallery-json");
  const uploadResult = $("upload-result");

  function showMsg(el, text, kind) {
    el.textContent = text;
    el.className = "admin-msg " + (kind || "");
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

  function renderEditor(data) {
    taI18n.value = JSON.stringify(data.i18n || {}, null, 2);
    taGallery.value = JSON.stringify(data.gallery || { add: [], removeIds: [] }, null, 2);
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
      renderEditor(data);
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
    let i18n;
    let gallery;
    try {
      i18n = JSON.parse(taI18n.value || "{}");
    } catch {
      showMsg(saveMsg, "JSON de textos no válido.", "error");
      return;
    }
    try {
      gallery = JSON.parse(taGallery.value || "{}");
    } catch {
      showMsg(saveMsg, "JSON de galería no válido.", "error");
      return;
    }
    const r = await fetch("/api/admin-save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ i18n, gallery }),
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
    showMsg(saveMsg, "Guardado correctamente.", "ok");
  });

  $("btn-upload")?.addEventListener("click", async () => {
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
      uploadResult.textContent += " (copiada al portapapeles)";
    } catch {
      /* noop */
    }
  });

  refreshPanel();
})();
