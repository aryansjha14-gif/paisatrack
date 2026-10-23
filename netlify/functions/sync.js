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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Netlify Blobs is eventually consistent by default and can throw transient
 * "internal error (403)" responses. Both are handled here:
 *   - the store is opened with strong consistency so a read right after a
 *     write on another device returns the newest value;
 *   - every store call is retried a few times with a small backoff.
 */
function makeStore() {
  try {
    return getStore({ name: "paisatrack", consistency: "strong" });
  } catch (e) {
    return getStore("paisatrack");
  }
}

async function withRetry(fn, tries = 3) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      await sleep(120 * (i + 1));
    }
  }
  throw last;
}

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

  const url = new URL(req.url);

  if (method === "GET") {
    const key = url.searchParams.get("key") || "";
    if (key.length < 16 || key.length > 200) return json({ error: "bad key" }, 400);
    let rec = null;
    try {
      rec = await withRetry(() => makeStore().get(key, { type: "json" }));
    } catch (e) {
      return json({ error: "read failed" }, 503);
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
      await withRetry(() => makeStore().setJSON(body.key, rec));
    } catch (e) {
      return json({ error: "write failed" }, 503);
    }
    return json({ ok: true, updatedAt: rec.updatedAt });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/sync" };
