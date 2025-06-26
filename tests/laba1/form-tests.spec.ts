// form-tests.spec.ts

import { test, expect } from '@playwright/test';
import { selectors } from './lab1selectors';
import { userData } from './lab1data';

// Тест форми реєстрації
test('Реєстрація користувача', async ({ page }) => {
  await page.goto(selectors.registerPage);

  await page.fill(selectors.firstNameInput, userData.firstName);
  await page.fill(selectors.lastNameInput, userData.lastName);
  await page.fill(selectors.userNameInput, userData.userName);
  await page.fill(selectors.passwordInput, userData.password);

  await page.click(selectors.registerButton);

  // Очікуємо залишитись на сторінці реєстрації (бо капча)
  await expect(page).toHaveURL(/register/);
});

// Тест форми Text Box
test('Заповнення форми Text Box', async ({ page }) => {
  await page.goto(selectors.textBoxPage);

  await page.fill(selectors.textBoxNameInput, userData.firstName + ' ' + userData.lastName);
  await page.fill(selectors.textBoxEmailInput, userData.email);
  await page.fill(selectors.textBoxCurrentAddress, userData.currentAddress);
  await page.fill(selectors.textBoxPermanentAddress, userData.permanentAddress);

  await page.click(selectors.textBoxSubmitButton);

  const nameOutput = page.locator(selectors.textBoxNameOutput);
  await expect(nameOutput).toHaveText(`Name:${userData.firstName} ${userData.lastName}`);
});

// Тест кнопок
test('Кліки по кнопках', async ({ page }) => {
  await page.goto(selectors.buttonsPage);

  await page.dblclick(selectors.doubleClickButton);
  const doubleClickMsg = page.locator(selectors.doubleClickMessage);
  await expect(doubleClickMsg).toHaveText(/You have done a double click/);

  await page.click(selectors.rightClickButton, { button: 'right' });
  const rightClickMsg = page.locator(selectors.rightClickMessage);
  await expect(rightClickMsg).toHaveText(/You have done a right click/);
});
