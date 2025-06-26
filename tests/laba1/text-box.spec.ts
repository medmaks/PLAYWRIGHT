import { test, expect } from '@playwright/test';
import { selectors } from './lab1selectors';
import { formData } from './lab1data';

test.describe('Лабораторна 1: Базові тести для demoqa.com', () => {
  test('Тестування текстових полів та їх виводу', async ({ page }) => {
    await page.goto('https://demoqa.com/text-box');

    // Заповнення полів
    await page.fill(selectors.userNameInput, formData.name);
    await page.fill(selectors.userEmailInput, formData.email);
    await page.fill(selectors.currentAddressInput, formData.currentAddress);
    await page.fill(selectors.permanentAddressInput, formData.permanentAddress);

    // Сабміт форми
    await page.click(selectors.submitButton);

    // Перевірка результатів
    await expect(page.locator(selectors.outputBox)).toContainText(formData.name);
    await expect(page.locator(selectors.outputBox)).toContainText(formData.email);
    await expect(page.locator(selectors.outputBox)).toContainText(formData.currentAddress);
    await expect(page.locator(selectors.outputBox)).toContainText(formData.permanentAddress);
  });
});
