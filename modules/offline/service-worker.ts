import { TURANT_CONTENT_VERSION, TURANT_SLUGS } from "@/modules/scams";

// offline में खुलने वाले पन्ने: /turant, उसके सारे प्रकार (data से बनते हैं) और अपने बैंक को बताने का पन्ना
// "/pucho" भी: उसकी जाँच पूरी तरह फ़ोन में होती है, इसलिए internet के बिना भी message जाँचा जा सके
export const OFFLINE_URLS: readonly string[] = ["/turant", ...TURANT_SLUGS.map((s) => `/turant/${s}`), "/gyan/bank", "/pucho", "/shikayat-rasta", "/case", "/arzi", "/abhyas", "/nambar"];

// cache का version: content version + git commit। हर deploy पर नया version, और activate पर पुराने caches
// (पुरानी build की JS/CSS समेत) अपने आप हटते हैं।
export function swVersion(env: Record<string, string | undefined> = process.env): string {
  const commit = (env.RENDER_GIT_COMMIT || env.GITHUB_SHA || "local").slice(0, 7);
  return `turant-${TURANT_CONTENT_VERSION}-${commit}`;
}

// HTML में लिखी Next.js की static files (CSS/JS) के पते निकालना: <script src>/<link href> से, और RSC flight data
// ("static/chunks/…js") से। offline पन्ना तभी पूरा चलता है जब उसकी JS भी cache में हो, वरना React पन्ना तोड़ देता है।
// यह function service worker के अंदर भी जाता है। production build function के नाम छोटे (minify) कर देता है, इसलिए
// इसका स्रोत एक string है (एक ही स्रोत: TypeScript वाला रूप भी इसी string से बनता है)।
const EXTRACT_ASSETS_SRC = String.raw`function extractNextAssets(html) {
  const found = new Set();
  const re = /(?:\/_next\/)?static\/(?:chunks|css)\/[^"'\\\s]+?\.(?:js|css)/g;
  for (const m of html.match(re) || []) found.add(m.startsWith("/_next/") ? m : "/_next/" + m);
  return Array.from(found);
}`;

export const extractNextAssets = new Function(`${EXTRACT_ASSETS_SRC}; return extractNextAssets;`)() as (html: string) => string[];

// service worker का code (string)। नियम:
// - install पर हर offline पन्ना और उसकी static files (CSS/JS) cache में; activate पर पुराने version के cache हटाना
// - URLS वाले पन्ने (और उनके नीचे के, जैसे /gyan/bank/sbi): पहले network (ताज़ा content), न मिले तो cache
// - /_next/static (CSS/JS): पहले cache, न हो तो network से लाकर रखना
// - बाकी सब: बिना छुए network
export function buildServiceWorker({ version, urls }: { version: string; urls: readonly string[] }): string {
  return `
const VERSION = ${JSON.stringify(version)};
const URLS = ${JSON.stringify(urls)};
${EXTRACT_ASSETS_SRC}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(VERSION);
      for (const u of URLS) {
        const res = await fetch(u, { cache: "no-store" });
        if (!res.ok) throw new Error("precache failed: " + u);
        const html = await res.clone().text();
        await cache.put(u, res);
        for (const a of extractNextAssets(html)) {
          if (await cache.match(a)) continue;
          try {
            const r = await fetch(a);
            if (r.ok) await cache.put(a, r);
          } catch (e) {
            // एक file न मिले तो भी बाकी offline तैयारी चलती रहे
          }
        }
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isOfflinePage = URLS.some((u) => url.pathname === u || url.pathname.startsWith(u + "/"));
  if (req.mode === "navigate" && isOfflinePage) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match(url.pathname))),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(VERSION).then((cache) => cache.put(req, copy));
            }
            return res;
          }),
      ),
    );
  }
});
`;
}
