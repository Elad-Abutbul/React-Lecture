import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  workers: 2,
  timeout: 30000,
  expect: { timeout: 7000 },
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:5176',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'qa-report',
      testMatch: '**/qa-report.spec.ts',
      use: {
        browserName: 'chromium',
        viewport: { width: 1789, height: 819 },
        deviceScaleFactor: 1.5,
      },
    },
    {
      name: 'webkit',
      testMatch: ['**/gesture-regression.spec.ts', '**/qa-report.spec.ts'],
      use: { browserName: 'webkit', viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: 'mobile',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'reduced-motion',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 900 },
        reducedMotion: 'reduce',
      },
    },
  ],
  webServer: {
    command: 'pnpm preview --host 127.0.0.1 --port 5176 --strictPort',
    url: 'http://127.0.0.1:5176',
    reuseExistingServer: false,
  },
})
