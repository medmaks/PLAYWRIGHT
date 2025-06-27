import { defineConfig, devices } from '@playwright/test';

// Це найпростіша можлива конфігурація.
// Вона не містить складних проєктів і залежностей.
export default defineConfig({
  // Головна папка, де лежать тести
  testDir: './tests',

  // Загальний таймаут для кожного тесту
  timeout: 90000, // 90 секунд

  reporter: 'html',

  use: {
    baseURL: 'https://dash.edu-planner.com',
    trace: 'on-first-retry',

    // Залишаємо цю опцію, бо вона допомогла завантажити сторінку
    channel: 'chrome',
  },

  // Зверни увагу: секції projects тут більше НЕМАЄ.
  // Це означає, що більше ніякий 'setup' не буде автоматично запускатись.
});