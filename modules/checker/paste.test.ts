import { expect, test } from "vitest";
import { MAX_CHECK_CHARS } from "./check";
import { PASTE_HINT_HI, readPastedText } from "./paste";

test("browser में clipboard पढ़ने की सुविधा ही नहीं: unsupported", async () => {
  expect(await readPastedText(undefined)).toEqual({ ok: false, reason: "unsupported" });
  expect(await readPastedText({})).toEqual({ ok: false, reason: "unsupported" });
});

test("अनुमति नहीं मिली (readText फेंके): denied", async () => {
  expect(await readPastedText({ readText: () => Promise.reject(new Error("NotAllowedError")) })).toEqual({ ok: false, reason: "denied" });
});

test("clipboard ख़ाली या सिर्फ़ space: empty", async () => {
  expect(await readPastedText({ readText: async () => "  \n " })).toEqual({ ok: false, reason: "empty" });
});

test("text मिला: आगे-पीछे की ख़ाली जगह हटे, और जाँच की हद से लंबा न हो", async () => {
  expect(await readPastedText({ readText: async () => "  OTP बताइए \n" })).toEqual({ ok: true, text: "OTP बताइए" });
  const r = await readPastedText({ readText: async () => "क".repeat(MAX_CHECK_CHARS + 50) });
  expect(r.ok && r.text.length).toBe(MAX_CHECK_CHARS);
});

test("readText उसी clipboard object पर चले (this न टूटे)", async () => {
  const clip = {
    v: "message",
    readText() {
      return Promise.resolve(this.v);
    },
  };
  expect(await readPastedText(clip)).toEqual({ ok: true, text: "message" });
});

test("हर नाकामी पर हिंदी में अगला रास्ता (उँगली दबाकर Paste)", () => {
  for (const r of ["unsupported", "denied", "empty"] as const) expect(PASTE_HINT_HI[r].length).toBeGreaterThan(20);
  expect(PASTE_HINT_HI.denied).toContain("Paste");
  expect(PASTE_HINT_HI.empty).toContain("copy");
});
