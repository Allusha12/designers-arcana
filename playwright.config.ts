import { defineConfig, devices } from "@playwright/test";

// E2E test config — runs against the local dev server on :3000 by default,
// or any URL from PLAYWRIGHT_BASE_URL (e.g. the live Vercel deploy in CI).
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  // Each test gets ~30s — generous because card-flip + shuffle anims take time.
  timeout: 30_000,
  expect: { timeout: 5_000 },
  // Force serial in CI so flaky animations don't clash; parallel locally.
  fullyParallel: !process.env.CI,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "iphone-se",
      use: { ...devices["iPhone SE"] },
    },
  ],
  // Spin up `next dev` automatically when running locally; in CI you should
  // build + start once and reuse, controlled via PLAYWRIGHT_BASE_URL.
  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
