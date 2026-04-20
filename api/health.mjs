import { getAuthSecret } from "./lib/auth.mjs";
import { json } from "./lib/http.mjs";

function norm(s) {
  return String(s ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\u200b/g, "")
    .trim();
}

/** Diagnóstico: comprueba que las variables de entorno del admin estén definidas (sin revelar valores). */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const hasPassword = norm(process.env.ADMIN_PASSWORD || "").length > 0;
  const hasSecret = getAuthSecret().length >= 16;
  const hasBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
  json(res, 200, {
    ok: true,
    auth: hasPassword && hasSecret,
    blob: hasBlob,
    checks: {
      ADMIN_PASSWORD: hasPassword,
      AUTH_SECRET_min16: hasSecret,
      BLOB_READ_WRITE_TOKEN: hasBlob,
    },
  });
}
