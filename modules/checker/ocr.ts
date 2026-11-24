// photo/screenshot से text (TR-36): tesseract.js browser में ही (WebAssembly), हिंदी + English। सारी files हमारी अपनी साइट से
// (/ocr, scripts/ocr-assets.mjs), और सिर्फ़ बटन दबाने पर आती हैं। photo कभी फ़ोन से बाहर नहीं जाती।
import type { Worker as TessWorker } from "tesseract.js";
import { cleanOcrText } from "./ocr-text";
import { StallError, withStallGuard } from "./stall";

export type OcrProgress = { stageHi: string; pct: number };

function stageHi(status: string): string {
  if (status.includes("recogniz")) return "photo के अक्षर पढ़ रहे हैं";
  if (status.includes("loading")) return "पढ़ने का सामान आ रहा है (पहली बार करीब 6 MB, फिर फ़ोन में रहता है)";
  return "तैयारी हो रही है";
}

export async function readImageText(image: Blob, onProgress?: (p: OcrProgress) => void): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const held: { worker?: TessWorker; abandoned?: boolean } = {};
  try {
    // अटके नहीं (stall.ts): हलचल रुक जाए तो साफ़ ग़लती, और पन्ना "photo पढ़ी नहीं जा सकी" कहता है
    return await withStallGuard(
      async (tick) => {
        const worker = await createWorker(["hin", "eng"], 1, {
          workerPath: "/ocr/worker.min.js",
          corePath: "/ocr",
          langPath: "/ocr/lang",
          workerBlobURL: false,
          gzip: true,
          logger: (m: { status: string; progress: number }) => {
            tick();
            onProgress?.({ stageHi: stageHi(m.status), pct: Math.max(0, Math.min(100, Math.round((m.progress ?? 0) * 100))) });
          },
        });
        if (held.abandoned) {
          void worker.terminate();
          throw new StallError();
        }
        held.worker = worker;
        const { data } = await worker.recognize(image);
        return cleanOcrText(data.text ?? "");
      },
      { stallMs: 120_000, offlineStallMs: 10_000, isOnline: () => navigator.onLine !== false },
    );
  } finally {
    held.abandoned = true;
    await held.worker?.terminate().catch(() => undefined);
  }
}
