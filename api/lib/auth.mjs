import { SignJWT, jwtVerify } from "jose";

const COOKIE = "tt_admin_session";

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
export async function verifyAuth(req) {
  const token = getCookie(req, COOKIE);
  if (!token) return null;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) return null;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.sub !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
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

/**
 * @param {import('http').ServerResponse} res
 * @param {string} secret
 */
export async function signSessionToken(secret) {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(new TextEncoder().encode(secret));
}

export { COOKIE };
