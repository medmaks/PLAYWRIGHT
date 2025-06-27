import { type Page, type Locator, expect } from '@playwright/test';

export class TeachersPage {
  readonly page: Page;
  // Кнопки
  readonly createNewButton: Locator;
  readonly saveButton: Locator;
  readonly confirmDeleteButton: Locator;
  // Поля вводу
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Локатори для кнопок
    this.createNewButton = page.getByRole('button', { name: 'Create new' });
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.confirmDeleteButton = page.getByRole('button', { name: 'Delete' });
    // Локатори для полів вводу у формі
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.searchInput = page.getByPlaceholder('Search');
  }

  // Перехід на сторінку викладачів
  async goto() {
    await this.page.goto('/teachers');
    await expect(this.page.getByRole('heading', { name: 'Teachers' })).toBeVisible();
  }

  // Створення нового викладача 
  async createTeacher(firstName: string, lastName: string, email: string, phone: string) {
    await this.createNewButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.phoneInput.fill(phone);
    await this.saveButton.click();
  }

  // Пошук викладача в таблиці
  async findTeacherInTable(uniqueIdentifier: string) {
    await this.searchInput.clear();
    await this.searchInput.fill(uniqueIdentifier);
    // Шукаємо рядок, що містить унікальний ідентифікатор (email або прізвище)
    const teacherRow = this.page.locator(`tr:has-text("${uniqueIdentifier}")`).first();
    await expect(teacherRow).toBeVisible({ timeout: 10000 });
    return teacherRow;
  }

  // Видалення викладача
  async deleteTeacher(teacherRow: Locator) {
    await teacherRow.getByRole('button', { name: 'delete' }).click();
    await this.confirmDeleteButton.click();
  }
}