import { list, put } from "@vercel/blob";

const PATH = "tt-admin/site-data.json";

export function defaultSiteData() {
  return {
    i18n: {},
    gallery: { add: [], removeIds: [] },
  };
}

/** @returns {Promise<{ i18n: Record<string, Record<string, string>>, gallery: { add: unknown[], removeIds: number[] } }>} */
export async function loadSiteData() {
  const base = defaultSiteData();
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return base;
  try {
    const { blobs } = await list({ prefix: "tt-admin/", token, limit: 20 });
    const blob = blobs.find((b) => b.pathname === PATH);
    if (!blob) return base;
    const r = await fetch(blob.url);
    if (!r.ok) return base;
    const data = await r.json();
    return {
      i18n: { ...base.i18n, ...(data.i18n || {}) },
      gallery: {
        add: Array.isArray(data.gallery?.add) ? data.gallery.add : [],
        removeIds: Array.isArray(data.gallery?.removeIds) ? data.gallery.removeIds : [],
      },
    };
  } catch {
    return base;
  }
}

/** @param {ReturnType<typeof defaultSiteData>} data */
export async function saveSiteData(data) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    const err = new Error("BLOB_NOT_CONFIGURED");
    err.code = "BLOB_NOT_CONFIGURED";
    throw err;
  }
  await put(PATH, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    token,
    addRandomSuffix: false,
  });
}
