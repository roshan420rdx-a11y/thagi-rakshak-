import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { FORBIDDEN_PHRASES, findForbidden } from "@/modules/i18n";
import allow from "./copy-lint-allow.json";

// पूरे repo की user-facing फ़ाइलों में मना किए शब्द न हों ("100% सुरक्षित", "गारंटी", सरकारी नाम…)
const ROOT = path.resolve(__dirname, "../..");
const DIRS = ["app", "components", "modules", "content"];
const EXT = /\.(ts|tsx|json|mdx)$/;
const SKIP = new Set(["modules/i18n/forbidden.ts", "modules/i18n/copy-lint-allow.json"]);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

test("repo में कोई मना किया शब्द नहीं (allow-सूची को छोड़कर)", () => {
  const allowed = new Set((allow as { file: string; phrase: string }[]).map((a) => `${a.file}::${a.phrase}`));
  const problems: string[] = [];
  for (const dir of DIRS) {
    for (const full of walk(path.join(ROOT, dir))) {
      const rel = path.relative(ROOT, full).split(path.sep).join("/");
      if (!EXT.test(rel) || /\.test\.tsx?$/.test(rel) || SKIP.has(rel)) continue;
      for (const hit of findForbidden(readFileSync(full, "utf8"), FORBIDDEN_PHRASES)) {
        if (!allowed.has(`${rel}::${hit.phrase}`)) problems.push(`${rel}: "${hit.phrase}"`);
      }
    }
  }
  expect(problems).toEqual([]);
});
