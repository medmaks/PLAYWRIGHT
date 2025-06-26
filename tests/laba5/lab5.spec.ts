import { test, expect } from '@playwright/test';

test('Create faculty → group → teacher chain', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // === 1. Додаємо "Факультет"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Faculty');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'faculty@example.com');
  await page.fill('#age', '45');
  await page.fill('#salary', '10000');
  await page.fill('#department', 'Faculty of Physics');
  await page.click('#submit');

  // === 2. Додаємо "Групу"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Group');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'group@example.com');
  await page.fill('#age', '30');
  await page.fill('#salary', '5000');
  await page.fill('#department', 'Phys-101');
  await page.click('#submit');

  // === 3. Додаємо "Викладача"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Teacher');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'teacher@example.com');
  await page.fill('#age', '40');
  await page.fill('#salary', '8000');
  await page.fill('#department', 'Phys-101');
  await page.click('#submit');

  // === 4. Перевірка через пошук
  await page.fill('#searchBox', 'Teacher');

  const filteredRows = page.locator('.rt-tr-group', { hasText: 'Teacher' });
  await expect(filteredRows).toHaveCount(1);

  const row = filteredRows.first();
  await expect(row).toContainText('Teacher');
  await expect(row).toContainText('teacher@example.com');
  await expect(row).toContainText('Phys-101');
});