import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure' //  тут не вистачало закриваючої дужки!
  },
  reporter: [['html', { outputFolder: 'reports', open: 'never' }]]
});
