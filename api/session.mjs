import { verifyAuth } from "./lib/auth.mjs";
import { json } from "./lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const user = verifyAuth(req);
  json(res, 200, { ok: !!user });
}
