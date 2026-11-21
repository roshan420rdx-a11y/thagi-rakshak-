import { OFFLINE_URLS, buildServiceWorker, swVersion } from "@/modules/offline";

// /sw.js: build के समय एक बार बनता है (static)
export const dynamic = "force-static";

export function GET() {
  return new Response(buildServiceWorker({ version: swVersion(), urls: OFFLINE_URLS }), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
