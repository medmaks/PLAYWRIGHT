import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('Authentication', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const email = process.env.LOGIN_EMAIL;
  const password = process.env.LOGIN_PASSWORD;

  if (!email || !password) {
    throw new Error('LOGIN_EMAIL or LOGIN_PASSWORD are not set in the root .env file');
  }

  await page.goto('/');

  // Використовуємо наш надійний метод логіну з очікуванням заголовка
  await loginPage.login(email, password);

  // === НАЙНАДІЙНІША ПЕРЕВІРКА УСПІШНОГО ВХОДУ ===
  
  // 1. Чекаємо, поки URL сторінки буде містити слово 'dashboard'.
  // Це перша ознака того, що перехід відбувся.
  await page.waitForURL('**/dashboard', { timeout: 15000 });

  // 2. Тепер, коли ми на правильній сторінці, шукаємо текст "Dashboard".
  // Використовуємо getByText, бо це надійніше, ніж шукати за роллю.
  await expect(page.getByText('Dashboard', { exact: true })).toBeVisible();
  
  // =================================================

  // Якщо попередні кроки успішні, зберігаємо сесію
  await page.context().storageState({ path: authFile });
});