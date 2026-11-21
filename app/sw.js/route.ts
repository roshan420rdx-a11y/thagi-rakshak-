import { OFFLINE_URLS, buildServiceWorker } from "@/modules/offline";
import { TURANT_CONTENT_VERSION } from "@/modules/scams";

// /sw.js: build के समय एक बार बनता है (static)
export const dynamic = "force-static";

export function GET() {
  return new Response(buildServiceWorker({ version: `turant-${TURANT_CONTENT_VERSION}`, urls: OFFLINE_URLS }), {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
