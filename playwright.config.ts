import { defineConfig, devices } from "@playwright/test";

/**
 * Critical authentication E2E (Phase 2). Deterministic by design: mail
 * is captured by the env-gated test adapter (`E2E_TEST_MAIL=stub` +
 * `/api/test/mail`), so no production Resend credentials are used.
 * Requires a migrated test database via DATABASE_URL.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:1988",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- -p 1988",
    url: "http://localhost:1988/auth",
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
