import path from "node:path";
import { defineConfig } from "vitest/config";

// सिर्फ़ launch-जाँच के लिए (npm run launch-check); आम npm test में शामिल नहीं
export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname) } },
  test: { environment: "node", include: ["launch/**/*.check.ts"] },
});
