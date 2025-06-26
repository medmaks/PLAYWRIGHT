import { test } from '@playwright/test';
import { DroppablePage } from './pages/DroppablePage';

test.describe('Lab4: Просте Drag-and-Drop', () => {
  test('Перетягування між зонами', async ({ page }) => {
    const droppable = new DroppablePage(page);
    await droppable.goto();
    await droppable.dragSimple();
  });
});