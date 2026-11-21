import { TURANT_SLUGS } from "@/modules/scams";

// offline में खुलने वाले पन्ने: /turant, उसके सारे प्रकार (data से बनते हैं) और अपने बैंक को बताने का पन्ना
export const OFFLINE_URLS: readonly string[] = ["/turant", ...TURANT_SLUGS.map((s) => `/turant/${s}`), "/gyan/bank"];

// service worker का code (string)। नियम:
// - install पर /turant के पन्ने cache में; activate पर पुराने version के cache हटाना
// - URLS वाले पन्ने (और उनके नीचे के, जैसे /gyan/bank/sbi): पहले network (ताज़ा content), न मिले तो cache
// - /_next/static (CSS/JS): पहले cache, न हो तो network से लाकर रखना
// - बाकी सब: बिना छुए network
export function buildServiceWorker({ version, urls }: { version: string; urls: readonly string[] }): string {
  return `
const VERSION = ${JSON.stringify(version)};
const URLS = ${JSON.stringify(urls)};

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(URLS)).then(() => self.skipWaiting()));
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
