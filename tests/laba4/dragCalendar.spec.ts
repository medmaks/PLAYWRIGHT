import { test, expect } from '@playwright/test';
import path from 'path';

const calendarPath = 'file://' + path.resolve(__dirname, 'mocks/mockCalendar.html');

test.describe('Lab4: Календарні події', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(calendarPath);
    await page.waitForSelector('#event1');
  });

  test('Перетягування події у вільний слот', async ({ page }) => {
    const event = page.locator('#event1');
    const slot = page.locator('.slot').first();

    await event.dragTo(slot);
    await expect(slot.locator('#event1')).toBeVisible();
  });

  test('Конфлікт при перетягуванні', async ({ page }) => {
    const event = page.locator('#event1');
    const slot = page.locator('.slot').first();

    // Перше перетягування
    await event.dragTo(slot);

    // Друге перетягування (конфлікт)
    await page.evaluate(() => {
      const newEvent = document.createElement('div');
      newEvent.className = 'event';
      newEvent.id = 'event2';
      newEvent.textContent = 'New Meeting';
      newEvent.draggable = true;
      document.body.appendChild(newEvent);
    });

    const newEvent = page.locator('#event2');
    await newEvent.dragTo(slot);

    await expect(slot).toHaveClass(/conflict/);
  });

  test('Час перетягування', async ({ page }) => {
    const event = page.locator('#event1');
    const slot = page.locator('.slot').first();

    const start = Date.now();
    await event.dragTo(slot);
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(3000);
  });
});