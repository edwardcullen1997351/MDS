import fs from 'node:fs';
import { defineConfig } from '@playwright/test';

const windowsChrome = 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe';
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ||
  (process.platform === 'win32' && fs.existsSync(windowsChrome) ? windowsChrome : undefined);

export default defineConfig({
  testDir: './tests/a11y',
  timeout: 120_000,
  expect: { timeout: 20_000 },
  fullyParallel: true,
  // CI runs independent stories in parallel; local baseline updates stay sequential.
  workers: process.env.CI ? 2 : 1,
  reporter: [['list']],
  use: {
    browserName: 'chromium',
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: executablePath ? { executablePath } : {},
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: 'node tests/serve-storybook.mjs',
    url: 'http://127.0.0.1:4173/index.json',
    // Always own the Storybook server for deterministic accessibility runs.
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
