// "photo से जाँच" (TR-36) की files: node_modules से public/ocr/ में (git में नहीं; हर build से पहले, package.json "prebuild")।
// सब अपनी साइट से आती हैं, किसी CDN से नहीं। browser सिर्फ़ वही core file लेता है जो उसके फ़ोन पर चले।
import { copyFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const OCR_ASSETS = [
  { from: "node_modules/tesseract.js/dist/worker.min.js", to: "worker.min.js" },
  { from: "node_modules/tesseract.js-core/tesseract-core-lstm.wasm.js", to: "tesseract-core-lstm.wasm.js" },
  { from: "node_modules/tesseract.js-core/tesseract-core-simd-lstm.wasm.js", to: "tesseract-core-simd-lstm.wasm.js" },
  { from: "node_modules/tesseract.js-core/tesseract-core-relaxedsimd-lstm.wasm.js", to: "tesseract-core-relaxedsimd-lstm.wasm.js" },
  { from: "node_modules/@tesseract.js-data/hin/4.0.0_best_int/hin.traineddata.gz", to: "lang/hin.traineddata.gz" },
  { from: "node_modules/@tesseract.js-data/eng/4.0.0_best_int/eng.traineddata.gz", to: "lang/eng.traineddata.gz" },
];

export function copyOcrAssets(root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")) {
  const out = path.join(root, "public", "ocr");
  for (const a of OCR_ASSETS) {
    const to = path.join(out, a.to);
    mkdirSync(path.dirname(to), { recursive: true });
    copyFileSync(path.join(root, a.from), to);
  }
  return OCR_ASSETS.length;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  console.log(`photo से जाँच की ${copyOcrAssets()} files public/ocr/ में`);
}
