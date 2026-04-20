import { timingSafeEqual } from "node:crypto";
import { getAuthSecret, signSessionToken, setSessionCookie } from "./lib/auth.mjs";
import { json, readJsonBody } from "./lib/http.mjs";

/** Quita BOM/espacios que suelen colarse al pegar en Vercel. */
function norm(s) {
  return String(s ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\u200b/g, "")
    .trim();
}

function safePassMatch(a, b) {
  const x = Buffer.from(norm(a), "utf8");
  const y = Buffer.from(norm(b), "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

function usernameMatch(a, b) {
  return norm(a).toLowerCase() === norm(b).toLowerCase();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const body = await readJsonBody(req);
  const username = body.username;
  const password = body.password;
  const expectUser = norm(process.env.ADMIN_USERNAME || "Judit");
  const expectPass = process.env.ADMIN_PASSWORD;
  const secret = getAuthSecret();

  if (!norm(expectPass) || secret.length < 16) {
    json(res, 503, {
      ok: false,
      error: "server_not_configured",
      hint:
        "En Vercel → Settings → Environment Variables añade ADMIN_PASSWORD y AUTH_SECRET (mínimo 16 caracteres). Aplica a Production y Preview, y vuelve a desplegar.",
    });
    return;
  }

  if (!usernameMatch(username, expectUser) || !safePassMatch(password, expectPass)) {
    json(res, 401, { ok: false, error: "invalid_credentials" });
    return;
  }

  const token = signSessionToken(secret);
  setSessionCookie(res, token);
  json(res, 200, { ok: true });
}
