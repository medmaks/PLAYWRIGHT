import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('Фінальний надійний тест: Повний CRUD-сценарій для Викладачів', async ({ page }) => {

  // --- ЕТАП 1: АВТОРИЗАЦІЯ ---
  await test.step('Крок 1: Авторизація в системі', async () => {
    await page.goto('https://dash.edu-planner.com/auth/login');
    await page.getByPlaceholder('Your email').fill('info+sleba@edu-planner.com');
    await page.getByPlaceholder('••••••••').fill('ZYz8tEW9FgISdC');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/(\?|&)startDate=/, { timeout: 30000 });
    await expect(page.getByRole('button', { name: 'Create Event' })).toBeVisible();
    console.log('УСПІХ: Авторизація пройшла.');
  });

  // --- ЕТАП 2: РОБОТА З ВИКЛАДАЧАМИ ---
  await test.step('Крок 2: Робота з сутністю "Викладач"', async () => {
    await page.goto('/teachers');
    const teachersHeading = page.getByRole('heading', { name: 'Teachers' });
    await expect(teachersHeading).toBeVisible({ timeout: 15000 });
    console.log('УСПІХ: Перейшов на сторінку викладачів.');

    const timestamp = Date.now();
    const uniqueName = `Maksym Sleba ${timestamp}`;
    const uniqueEmail = `maksym.final.${timestamp}@test.com`;

    // Створення нового викладача
    const createIconButton = teachersHeading.locator('..').getByRole('button');
    await expect(createIconButton).toBeVisible();
    await createIconButton.click();
    
    await page.getByPlaceholder('Enter Name').fill(uniqueName);
    await page.getByPlaceholder('Enter Email').fill(uniqueEmail);
    await page.getByRole('dialog').getByRole('button', { name: 'Create' }).click();
    console.log('УСПІХ: Нового викладача створено.');

    // Пошук створеного викладача
    const searchInput = page.getByPlaceholder('Search');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(uniqueEmail);
    const teacherRow = page.locator(`tr:has-text("${uniqueEmail}")`);
    await expect(teacherRow).toBeVisible();
    console.log('УСПІХ: Створений викладач знайдений у таблиці.');

    // Видалення викладача
    await test.step('Крок 2.4: Видалення викладача', async () => {
      // Натискаємо на другу кнопку (іконку кошика) в рядку
      const deleteButton = teacherRow.getByRole('button').nth(1);
      await expect(deleteButton).toBeVisible();
      await deleteButton.click();
      console.log('УСПІХ: Кнопку (іконку) видалення натиснуто.');

      // Чекаємо на модальне вікно
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog).toContainText('Are you sure?');
      console.log('УСПІХ: Вікно підтвердження з\'явилося.');

      // === ФІНАЛЬНЕ ВИПРАВЛЕННЯ ===
      // Натискаємо на кнопку з правильним текстом "Yes, do it!".
      const confirmDeleteButton = dialog.getByRole('button', { name: 'Yes, do it!' });
      await expect(confirmDeleteButton).toBeVisible();
      await confirmDeleteButton.click();
      console.log('УСПІХ: Видалення підтверджено.');
    });

    await test.step('Крок 2.5: Перевірка, що викладач зник', async () => {
      await searchInput.fill(uniqueEmail);
      await expect(page.getByText('No data available')).toBeVisible();
      console.log('УСПІХ: Перевірка на видалення пройшла. Тест повністю успішний!');
    });
  });
});