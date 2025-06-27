import { test, expect } from '@playwright/test';
import { TeachersPage } from '../pages/TeachersPage';

// Унікальні дані для кожного запуску, щоб тести не заважали один одному
const timestamp = Date.now();
const uniqueLastName = `Слеба-${timestamp}`;
const uniqueEmail = `maksym.sleba.${timestamp}@test.com`;

test.describe('Модуль "Організація": Тестування Викладачів (Teachers)', () => {

  // Використовуємо збережену сесію для всіх тестів у цьому файлі.
  // Playwright сам запустить setup перед цими тестами.
  test.use({ storageState: 'playwright/.auth/user.json' });

  let teachersPage: TeachersPage;

  // Цей блок виконується перед кожним тестом
  test.beforeEach(async ({ page }) => {
    teachersPage = new TeachersPage(page);
    await teachersPage.goto();
  });

  // Основний сценарій: Створення та видалення
  test('Повний сценарій CRUD для сутності "Викладач"', async ({ page }) => {
    
    await test.step('1. CREATE: Створення нового викладача', async () => {
      await teachersPage.createTeacher(
        'Максим',
        uniqueLastName,
        uniqueEmail,
        `+38099${String(timestamp).slice(-7)}`
      );
    });

    await test.step('2. READ: Пошук та перевірка створеного викладача', async () => {
      const teacherRow = await teachersPage.findTeacherInTable(uniqueEmail);
      await expect(teacherRow).toContainText('Максим');
      await expect(teacherRow).toContainText(uniqueLastName);
    });

    await test.step('3. DELETE: Видалення створеного викладача', async () => {
      const teacherRow = await teachersPage.findTeacherInTable(uniqueEmail);
      await teachersPage.deleteTeacher(teacherRow);
    });

    await test.step('4. VERIFY: Перевірка, що викладач був видалений', async () => {
      await teachersPage.searchInput.fill(uniqueEmail);
      // Чекаємо, що з'явиться повідомлення "No data available"
      await expect(page.getByText('No data available')).toBeVisible();
    });
  });

  // Тест на валідацію
  test('Перевірка валідації: неможливо створити викладача з порожніми полями', async ({ page }) => {
    await test.step('1. ACTION: Спроба створити викладача з порожніми даними', async () => {
      await teachersPage.createNewButton.click();
      await teachersPage.saveButton.click();
    });

    await test.step('2. ASSERT: Перевірка повідомлень про помилки', async () => {
      // Шукаємо текст помилки, який з'являється під полем вводу
      const emailError = page.locator('p').filter({ hasText: 'email is a required field' });
      const firstNameError = page.locator('p').filter({ hasText: 'firstName is a required field' });

      await expect(emailError).toBeVisible();
      await expect(firstNameError).toBeVisible();
    });
  });
});