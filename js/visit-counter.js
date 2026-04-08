/**
 * Contador de visitas global vía Abacus (https://abacus.jasoncameron.dev).
 * Namespace/clave acotados al sitio; sin cookies. Si la petición falla, se muestra "—".
 */
(function () {
  "use strict";

  var BASE = "https://abacus.jasoncameron.dev/hit";
  var NAMESPACE = "tormentatelar-site";
  var KEY = "total_visits_v1";

  function fmt(n) {
    try {
      return new Intl.NumberFormat(document.documentElement.lang || "es", {
        maximumFractionDigits: 0,
      }).format(n);
    } catch {
      return String(n);
    }
  }

  function run() {
    var el = document.getElementById("footer-visit-count");
    if (!el) return;

    var url = BASE + "/" + encodeURIComponent(NAMESPACE) + "/" + encodeURIComponent(KEY);
    fetch(url)
      .then(function (r) {
        return r.ok ? r.json() : Promise.reject(new Error("abacus"));
      })
      .then(function (data) {
        if (data && typeof data.value === "number" && Number.isFinite(data.value)) {
          el.textContent = fmt(data.value);
        }
      })
      .catch(function () {
        el.textContent = "—";
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
