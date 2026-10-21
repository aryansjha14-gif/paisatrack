import { getStore } from "@netlify/blobs";

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

/**
 * Encrypted cross-device sync endpoint.
 *
 * The client derives an opaque storage key (SHA-256 of email + passphrase) and
 * encrypts the payload with AES-GCM before sending it, so the server only ever
 * sees a random-looking key and ciphertext — never the plaintext data.
 *
 *   GET  /api/sync?key=<hex>   -> { payload, updatedAt } or 404
 *   POST /api/sync             -> body { key, payload } ; stores it
 */
export default async (req) => {
  const method = (req.method || "GET").toUpperCase();

  if (method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }

  const store = getStore("paisatrack");
  const url = new URL(req.url);

  if (method === "GET") {
    const key = url.searchParams.get("key") || "";
    if (key.length < 16 || key.length > 200) return json({ error: "bad key" }, 400);
    let rec = null;
    try {
      rec = await store.get(key, { type: "json" });
    } catch (e) {
      return json({ error: "read failed" }, 500);
    }
    if (!rec) return json({ error: "not found" }, 404);
    return json(rec);
  }

  if (method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return json({ error: "bad body" }, 400);
    }
    if (!body || typeof body.key !== "string" || body.key.length < 16 || body.key.length > 200) {
      return json({ error: "bad key" }, 400);
    }
    const payload = body.payload;
    if (!payload || typeof payload !== "object" || typeof payload.iv !== "string" || typeof payload.data !== "string") {
      return json({ error: "bad payload" }, 400);
    }
    if (payload.data.length > 4000000) {
      return json({ error: "payload too large" }, 413);
    }
    const rec = { payload, updatedAt: Date.now() };
    try {
      await store.setJSON(body.key, rec);
    } catch (e) {
      return json({ error: "write failed" }, 500);
    }
    return json({ ok: true, updatedAt: rec.updatedAt });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/sync" };
