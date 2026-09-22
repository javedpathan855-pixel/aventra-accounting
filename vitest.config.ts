import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "node",
    // Playwright E2E lives in ./e2e and runs via `npm run test:e2e`.
    exclude: ["e2e/**", "node_modules/**"],
  },
});
