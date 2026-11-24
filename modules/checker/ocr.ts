// photo/screenshot से text (TR-36): tesseract.js browser में ही (WebAssembly), हिंदी + English। सारी files हमारी अपनी साइट से
// (/ocr, scripts/ocr-assets.mjs), और सिर्फ़ बटन दबाने पर आती हैं। photo कभी फ़ोन से बाहर नहीं जाती।
import { cleanOcrText } from "./ocr-text";

export type OcrProgress = { stageHi: string; pct: number };

function stageHi(status: string): string {
  if (status.includes("recogniz")) return "photo के अक्षर पढ़ रहे हैं";
  if (status.includes("loading")) return "पढ़ने का सामान आ रहा है (पहली बार करीब 6 MB, फिर फ़ोन में रहता है)";
  return "तैयारी हो रही है";
}

export async function readImageText(image: Blob, onProgress?: (p: OcrProgress) => void): Promise<string> {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker(["hin", "eng"], 1, {
    workerPath: "/ocr/worker.min.js",
    corePath: "/ocr",
    langPath: "/ocr/lang",
    workerBlobURL: false,
    gzip: true,
    logger: (m: { status: string; progress: number }) =>
      onProgress?.({ stageHi: stageHi(m.status), pct: Math.max(0, Math.min(100, Math.round((m.progress ?? 0) * 100))) }),
  });
  try {
    const { data } = await worker.recognize(image);
    return cleanOcrText(data.text ?? "");
  } finally {
    await worker.terminate();
  }
}
