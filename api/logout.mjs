import { clearSessionCookie } from "./lib/auth.mjs";
import { json } from "./lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  clearSessionCookie(res);
  json(res, 200, { ok: true });
}
