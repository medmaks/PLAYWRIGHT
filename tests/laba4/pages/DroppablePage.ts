import { Page, expect } from '@playwright/test';

export class DroppablePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://demoqa.com/droppable', {
      waitUntil: 'networkidle',
    });
    await this.page.waitForSelector('#droppableExample-tab-simple');
    await this.page.locator('#droppableExample-tab-simple').click();
  }

  async dragSimple() {
    const source = this.page.locator('#draggable');
    const target = this.page.locator('#simpleDropContainer #droppable');

    // Перевірка початкового стану
    await expect(source).toBeVisible();
    await expect(target).toHaveText('Drop here');

    // Вимірювання часу перетягування
    const start = Date.now();
    await source.dragTo(target);
    const duration = Date.now() - start;

    // Перевірка результату
    await expect(target).toHaveText('Dropped!');
    await expect(target).toHaveCSS('background-color', 'rgba(70, 130, 180, 1)');
    expect(duration).toBeLessThan(3000);
  }
}