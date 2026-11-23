import { readFileSync } from "node:fs";
import path from "node:path";
import { expect, test } from "vitest";
import { TOKENS, type TokenName } from "@/modules/design";

// globals.css और tokens.ts एक-दूसरे से अलग न हो जाएँ
const css = readFileSync(path.resolve(__dirname, "../../app/globals.css"), "utf8");

function readVars(block: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) out[m[1]] = m[2].toUpperCase();
  return out;
}

const lightBlock = css.match(/(?:^|\n):root\s*\{([^}]*)\}/)?.[1] ?? "";
const darkBlock = css.match(/@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}/)?.[1] ?? "";

test.each(["light", "dark"] as const)("%s: globals.css के मान tokens.ts से मिलें", (mode) => {
  const vars = readVars(mode === "light" ? lightBlock : darkBlock);
  for (const [name, value] of Object.entries(TOKENS[mode]) as [TokenName, string][]) {
    expect.soft(vars[name], `${mode} --${name}`).toBe(value.toUpperCase());
  }
});

test("print वाला पोस्टर: dark फ़ोन से छपे तो भी हल्के रंग, tokens.ts के light मानों जैसे", () => {
  const block = css.match(/\[data-print-area="poster"\]\s*\{([^}]*)\}/)?.[1] ?? "";
  const vars = readVars(block);
  expect(Object.keys(vars).length).toBeGreaterThanOrEqual(5);
  for (const [name, value] of Object.entries(vars)) expect(value, `--${name}`).toBe(TOKENS.light[name as TokenName].toUpperCase());
});
