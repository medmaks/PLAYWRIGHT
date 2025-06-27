import { test, expect } from '@playwright/test';

// Аварійний тест, якщо нічого іншого не працює
test('Аварійний сценарій: CRUD для Викладача', async ({ page }) => {
  // --- Етап 1: Логін ---
  await page.goto('https://dash.edu-planner.com/');
  await expect(page.getByRole('heading', { name: 'Sign in to your account' })).toBeVisible({ timeout: 20000 });
  await page.locator('input[name="email"]').fill('info+sleba@edu-planner.com');
  await page.locator('input[name="password"]').fill('ZYz8tEW9FgISdC');
  await page.locator('button[type="submit"]').click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  console.log('Успішно залогінився!');

  // --- Етап 2: Робота з викладачами ---
  await page.goto('/teachers');
  await expect(page.getByRole('heading', { name: 'Teachers' })).toBeVisible();
  console.log('Перейшов на сторінку викладачів.');

  const timestamp = Date.now();
  const uniqueEmail = `emergency.${timestamp}@test.com`;

  // --- Створення ---
  await page.getByRole('button', { name: 'Create new' }).click();
  await page.locator('input[name="firstName"]').fill('Аварійний');
  await page.locator('input[name="lastName"]').fill(`Тест-${timestamp}`);
  await page.locator('input[name="email"]').fill(uniqueEmail);
  await page.locator('input[name="phone"]').fill('+380000000000');
  await page.getByRole('button', { name: 'Save' }).click();
  console.log('Створив нового викладача.');

  // --- Перевірка ---
  await page.getByPlaceholder('Search').fill(uniqueEmail);
  const teacherRow = page.locator(`tr:has-text("${uniqueEmail}")`);
  await expect(teacherRow).toBeVisible();
  console.log('Знайшов викладача в таблиці.');

  // --- Видалення ---
  await teacherRow.getByRole('button', { name: 'delete' }).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  console.log('Видалив викладача.');

  // --- Фінальна перевірка ---
  await page.getByPlaceholder('Search').fill(uniqueEmail);
  await expect(page.getByText('No data available')).toBeVisible();
  console.log('Переконався, що викладача видалено. Тест успішний!');
});