import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 4,
  reporter: [
    ['html', { open: 'never' }],
    ['./tests/reporters/issue-reporter.js'],
  ],
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npx http-server . -p 8080 -s',
    port: 8080,
    reuseExistingServer: true,
  },
});
