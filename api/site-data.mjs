import { loadSiteData } from "./lib/site-data-blob.mjs";
import { json } from "./lib/http.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    json(res, 405, { ok: false, error: "method" });
    return;
  }
  const data = await loadSiteData();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  res.end(JSON.stringify(data));
}
