import formidable from "formidable";
import { put } from "@vercel/blob";
import { verifyAuth } from "./lib/auth.mjs";
import { json } from "./lib/http.mjs";
import { randomBytes } from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const auth = await verifyAuth(req);
  if (!auth) {
    json(res, 401, { ok: false, error: "unauthorized" });
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    json(res, 503, { ok: false, error: "blob_not_configured" });
    return;
  }

  const form = formidable({
    maxFileSize: 12 * 1024 * 1024,
    allowEmptyFiles: false,
  });

  let fields;
  let files;
  try {
    [fields, files] = await form.parse(req);
  } catch {
    json(res, 400, { ok: false, error: "parse_failed" });
    return;
  }

  let f = files.file;
  if (Array.isArray(f)) f = f[0];
  const file = f;
  if (!file || !file.filepath) {
    json(res, 400, { ok: false, error: "no_file" });
    return;
  }

  const orig = file.originalFilename || "upload.bin";
  const ext = orig.includes(".") ? orig.slice(orig.lastIndexOf(".")) : "";
  const safeExt = /^\.(png|jpe?g|gif|webp)$/i.test(ext) ? ext.toLowerCase() : ".png";
  const name = `tt-admin/uploads/${Date.now()}-${randomBytes(4).toString("hex")}${safeExt}`;

  const fs = await import("node:fs/promises");
  const buf = await fs.readFile(file.filepath);

  try {
    const blob = await put(name, buf, {
      access: "public",
      contentType: file.mimetype || "image/png",
      token,
      addRandomSuffix: false,
    });
    json(res, 200, { ok: true, url: blob.url, pathname: blob.pathname });
  } catch {
    json(res, 500, { ok: false, error: "upload_failed" });
  }
}
