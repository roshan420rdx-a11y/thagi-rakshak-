import { existsSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { OCR_ASSETS } from "./ocr-assets.mjs";

test("photo से जाँच की files: हर एक node_modules में मौजूद (version बदलने पर भी पता चले)", () => {
  expect(OCR_ASSETS.length).toBeGreaterThanOrEqual(6);
  for (const a of OCR_ASSETS) expect(existsSync(path.resolve(__dirname, "..", a.from)), a.from).toBe(true);
  expect(OCR_ASSETS.map((a) => a.to)).toEqual(
    expect.arrayContaining(["worker.min.js", "tesseract-core-simd-lstm.wasm.js", "tesseract-core-lstm.wasm.js", "lang/hin.traineddata.gz", "lang/eng.traineddata.gz"]),
  );
});
