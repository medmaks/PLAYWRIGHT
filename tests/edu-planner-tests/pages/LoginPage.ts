import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly heading: Locator; // <-- Додали локатор для заголовка

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    // Знаходимо заголовок на сторінці
    this.heading = page.getByRole('heading', { name: 'Sign in to your account' });
  }

  async login(email: string, pass: string) {
    // === ДОДАЛИ РОЗУМНЕ ОЧІКУВАННЯ ===
    // Чекаємо, поки заголовок стане видимим, але не більше 20 секунд.
    // Це доказ того, що сторінка завантажилась.
    await this.heading.waitFor({ state: 'visible', timeout: 20000 });
    // ===================================

    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }
}