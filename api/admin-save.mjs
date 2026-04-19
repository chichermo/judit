import { verifyAuth } from "./lib/auth.mjs";
import { loadSiteData, saveSiteData } from "./lib/site-data-blob.mjs";
import { json, readJsonBody } from "./lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const auth = verifyAuth(req);
  if (!auth) {
    json(res, 401, { ok: false, error: "unauthorized" });
    return;
  }

  const body = await readJsonBody(req);
  const cur = await loadSiteData();

  const merged = {
    i18n: body.i18n && typeof body.i18n === "object" ? body.i18n : cur.i18n,
    gallery: {
      add: Array.isArray(body.gallery?.add) ? body.gallery.add : cur.gallery.add,
      removeIds: Array.isArray(body.gallery?.removeIds)
        ? body.gallery.removeIds.map(Number).filter((n) => !Number.isNaN(n))
        : cur.gallery.removeIds,
    },
  };

  try {
    await saveSiteData(merged);
    json(res, 200, { ok: true });
  } catch (e) {
    if (e && e.code === "BLOB_NOT_CONFIGURED") {
      json(res, 503, { ok: false, error: "blob_not_configured" });
      return;
    }
    json(res, 500, { ok: false, error: "save_failed" });
  }
}
