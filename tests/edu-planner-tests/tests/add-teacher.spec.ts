import { test, expect } from '@playwright/test';

test('Додавання викладача до групи — позитивний сценарій', async ({ page }) => {
  await page.goto('https://dash.edu-planner.com/');

  // Логін
  await page.getByLabel('Your email').fill('info+sleba@edu-planner.com');
  await page.getByLabel('Password').fill('ZYz8tEW9FgISdC');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Далі приклад переходу і дій
  await page.click('text=Організація');
  await page.click('text=Groups');
  await page.click('text=Create Group');
  await page.fill('#groupName', 'Test Group');
  await page.click('button:has-text("Save")');

  await page.click('text=Teachers');
  await page.click('text=Add Teacher');
  await page.fill('#teacherName', 'Тест Викладач');
  await page.fill('#teacherEmail', 'teacher@test.com');
  await page.selectOption('#teacherGroup', { label: 'Test Group' });
  await page.click('button:has-text("Save")');

  await expect(page.locator('table')).toContainText('Тест Викладач');
});
