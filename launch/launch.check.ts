// npm run launch-check: launch से पहले की सूची छापता है। कुछ भी बाकी हो तो fail (यह CI में नहीं चलता)।
import { expect, test } from "vitest";
import { launchChecks } from "@/modules/site/launch";

test("launch से पहले की सूची", () => {
  const checks = launchChecks(process.env);
  console.log("\n" + checks.map((c) => `${c.ok ? "✅" : "❌"} ${c.labelHi}${c.ok ? "" : `\n    → ${c.fixHi}`}`).join("\n") + "\n");
  expect(checks.filter((c) => !c.ok).map((c) => c.id)).toEqual([]);
});
