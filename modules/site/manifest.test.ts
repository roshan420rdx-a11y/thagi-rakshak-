import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import manifest from "@/app/manifest";

test("manifest: नाम, हिंदी, रंग, icon", () => {
  const m = manifest();
  expect(m).toMatchObject({ name: "ठगी रक्षक", short_name: "ठगी रक्षक", start_url: "/", display: "standalone", lang: "hi", theme_color: "#1D3A6B", background_color: "#F7F6F3" });
  expect(m.icons?.[0]).toMatchObject({ src: "/icon.svg", type: "image/svg+xml" });
});

test("icon.svg मौजूद, brand रंग में", () => {
  const svg = readFileSync(path.resolve(__dirname, "../../app/icon.svg"), "utf8");
  expect(svg).toContain("<svg");
  expect(svg).toContain("#1D3A6B");
});
