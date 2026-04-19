/**
 * Carga textos e imágenes extra guardados en el servidor (Vercel Blob).
 * Debe ir antes de i18n.js y main.js.
 */
(function () {
  window.__TT_I18N_OVERRIDES__ = {};
  window.__TT_GALLERY_REMOTE__ = { add: [], removeIds: [] };
  window.__TT_OVERRIDES_READY__ = false;

  fetch("/api/site-data")
    .then(function (r) {
      return r.ok ? r.json() : {};
    })
    .then(function (data) {
      if (data && data.i18n) window.__TT_I18N_OVERRIDES__ = data.i18n;
      if (data && data.gallery) window.__TT_GALLERY_REMOTE__ = data.gallery;
    })
    .catch(function () {})
    .finally(function () {
      window.__TT_OVERRIDES_READY__ = true;
      window.dispatchEvent(new Event("tt-site-overrides"));
    });
})();
