// @ts-check
const { defineConfig, devices } = require("@playwright/test");
const isCI = Boolean(process.env.CI);

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  timeout: 60000,
  snapshotPathTemplate:
    "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }]
  ],
  expect: {
    timeout: 10000
  },
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry"
  },
  projects: isCI
    ? [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"], browserName: "chromium" }
        }
      ]
    : [
        {
          name: "chromium",
          use: { ...devices["Desktop Chrome"], browserName: "chromium" }
        },
        {
          name: "msedge",
          use: { ...devices["Desktop Edge"], channel: "msedge", browserName: "chromium" }
        }
      ]
});
