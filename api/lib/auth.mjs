import { createHmac, timingSafeEqual } from "node:crypto";

const COOKIE = "tt_admin_session";

function normSecret(s) {
  return String(s ?? "")
    .replace(/^\uFEFF/, "")
    .replace(/\u200b/g, "")
    .trim();
}

/** Misma normalización que en login (espacios/BOM al pegar en Vercel). */
export function getAuthSecret() {
  return normSecret(process.env.AUTH_SECRET || "");
}

/**
 * Token firmado con HMAC-SHA256 (sin dependencias externas).
 * Formato: base64url(payloadJson).base64url(hmac)
 */
export function signSessionToken(secret) {
  const key = normSecret(secret);
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const body = JSON.stringify({ sub: "admin", exp });
  const payload = Buffer.from(body, "utf8").toString("base64url");
  const sig = createHmac("sha256", key).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/**
 * @param {string} token
 * @param {string} secret
 */
function verifyTokenString(token, secret) {
  const key = normSecret(secret);
  const parts = String(token).split(".");
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", key).update(payload).digest("base64url");
  try {
    const a = Buffer.from(sig, "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length) return null;
    if (!timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  let data;
  try {
    const json = Buffer.from(payload, "base64url").toString("utf8");
    data = JSON.parse(json);
  } catch {
    return null;
  }
  if (data.sub !== "admin") return null;
  if (typeof data.exp !== "number" || data.exp < Math.floor(Date.now() / 1000)) return null;
  return data;
}

/** @param {import('http').IncomingMessage} req */
export function getCookie(req, name) {
  const h = req.headers.cookie || "";
  const parts = h.split(";").map((s) => s.trim());
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i === -1) continue;
    if (p.slice(0, i) === name) return decodeURIComponent(p.slice(i + 1));
  }
  return "";
}

/** @param {import('http').IncomingMessage} req */
export function verifyAuth(req) {
  const token = getCookie(req, COOKIE);
  if (!token) return null;
  const secret = getAuthSecret();
  if (secret.length < 16) return null;
  return verifyTokenString(token, secret);
}

export function setSessionCookie(res, token, maxAgeSec = 60 * 60 * 24 * 7) {
  const secure = process.env.VERCEL === "1" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec}${secure}`
  );
}

export function clearSessionCookie(res) {
  const secure = process.env.VERCEL === "1" ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

export { COOKIE };
