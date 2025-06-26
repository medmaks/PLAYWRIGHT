import { test, expect } from '@playwright/test';

test('Додавання викладача до групи — позитивний сценарій', async ({ page }) => {
  await page.goto('https://dash.edu-planner.com/');
  // Логін якщо треба
  await page.fill('#username', process.env.EDU_USERNAME);
  await page.fill('#password', process.env.EDU_PASSWORD);
  await page.click('button[type="submit"]');

  // Перехід у розділ Організація -> Groups
  await page.click('text=Організація');
  await page.click('text=Groups');

  // Створення групи якщо потрібно
  await page.click('text=Create Group');
  await page.fill('#groupName', 'Test Group');
  await page.click('button:has-text("Save")');

  // Додавання викладача
  await page.click('text=Teachers');
  await page.click('text=Add Teacher');
  await page.fill('#teacherName', 'Тестовий Викладач');
  await page.fill('#teacherEmail', 'test.teacher@example.com');
  await page.selectOption('#teacherGroup', { label: 'Test Group' });
  await page.click('button:has-text("Save")');

  // Перевірка, що викладач з’явився в таблиці
  await expect(page.locator('table')).toContainText('Тестовий Викладач');
});
