import { test, expect } from '@playwright/test';

test('Валідація: порожній email', async ({ page }) => {
  await page.goto('/');

  // Логін
  await page.getByLabel('Your email').fill(process.env.EDU_USERNAME || 'info+sleba@edu-planner.com');
  await page.getByLabel('Password').fill(process.env.EDU_PASSWORD || 'ZYz8tEW9FgISdC');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Перехід у розділ Teachers
  await page.click('text=Організація');
  await page.click('text=Teachers');
  await page.click('text=Add Teacher');

  // Валідація порожнього email
  await page.fill('#teacherName', 'Викладач Без Email');
  await page.fill('#teacherEmail', '');
  await page.click('button:has-text("Save")');

  // Перевірка помилки
  await expect(page.locator('.error-message')).toContainText('Email обов’язковий');
});
