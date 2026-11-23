import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import manifest from "@/app/manifest";

test("manifest: नाम, हिंदी, रंग, icon", () => {
  const m = manifest();
  expect(m).toMatchObject({ name: "ठगी रक्षक", short_name: "ठगी रक्षक", start_url: "/", display: "standalone", lang: "hi", theme_color: "#1D3A6B", background_color: "#F7F6F3" });
  expect(m.icons?.map((i) => `${i.src} ${i.sizes} ${i.purpose ?? ""}`.trim())).toEqual([
    "/icons/icon-192.png 192x192 any",
    "/icons/icon-512.png 512x512 any",
    "/icons/icon-maskable-512.png 512x512 maskable",
    "/icon.svg any",
  ]);
});

test("manifest के PNG icons सच में मौजूद और सही नाप के (Android install के लिए)", () => {
  for (const [file, size] of [["public/icons/icon-192.png", 192], ["public/icons/icon-512.png", 512], ["public/icons/icon-maskable-512.png", 512], ["app/apple-icon.png", 180]] as const) {
    const buf = readFileSync(path.resolve(__dirname, "../..", file));
    expect(buf.subarray(1, 4).toString("ascii"), file).toBe("PNG");
    expect(buf.readUInt32BE(16), file).toBe(size); // IHDR width
    expect(buf.readUInt32BE(20), file).toBe(size); // IHDR height
  }
});

test("icon.svg मौजूद, brand रंग में", () => {
  const svg = readFileSync(path.resolve(__dirname, "../../app/icon.svg"), "utf8");
  expect(svg).toContain("<svg");
  expect(svg).toContain("#1D3A6B");
});

test("manifest: Share से सीधे 'पहले पूछो' (share_target, POST ताकि message URL में न जाए)", () => {
  expect(manifest().share_target).toEqual({
    action: "/pucho/share",
    method: "POST",
    enctype: "multipart/form-data",
    params: { title: "title", text: "text", url: "url" },
  });
});
