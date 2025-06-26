import { test, expect } from '@playwright/test';

test('Валідація: порожній email', async ({ page }) => {
  await page.goto(process.env.BASE_URL!);

  await page.getByPlaceholder('Your email').fill(process.env.EDU_EMAIL!);
  await page.getByPlaceholder('Password').fill(process.env.EDU_PASSWORD!);
  await page.getByRole('button', { name: /Sign in/i }).click();

  // Переходимо в "Організація" -> "Викладачі"
  await page.click('text=Організація');
  await page.click('text=Викладачі');
  await page.click('text=Додати викладача');

  await page.fill('#name', 'Тест Помилка');
  await page.fill('#email', ''); // порожній email
  await page.selectOption('#group', 'ІТ-101');
  await page.click('button:text("Зберегти")');

  await expect(page.locator('.error')).toContainText('Email обов\'язковий');
});
