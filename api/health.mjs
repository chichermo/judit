import { json } from "./lib/http.mjs";

/** Diagnóstico: comprueba que las variables de entorno del admin estén definidas (sin revelar valores). */
export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const hasSecret = !!(process.env.AUTH_SECRET && process.env.AUTH_SECRET.length >= 16);
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
