import { test, expect } from '@playwright/test';
import { selectors } from './lab2selectors';
import { sortableData } from './lab2data';

test('Перевірка списку сортування', async ({ page }) => {
  await page.goto(selectors.sortablePage, { timeout: 60000, waitUntil: 'domcontentloaded' });

  const listItems = page.locator(selectors.sortableListItems);

  // Чекаємо, поки елементи з'являться
  await expect(listItems.first()).toBeVisible();

  // Перевіряємо кількість елементів
  const itemCount = await listItems.count();
  expect(itemCount).toBe(sortableData.expectedCount);

  // Перевіряємо текст першого і останнього елементів
  const firstText = await listItems.nth(0).innerText();
  const lastText = await listItems.nth(itemCount - 1).innerText();

  expect(firstText).toBe(sortableData.firstItem);
  expect(lastText).toBe(sortableData.lastItem);
});
