import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://dash.edu-planner.com/',
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  timeout: 30000,
});
