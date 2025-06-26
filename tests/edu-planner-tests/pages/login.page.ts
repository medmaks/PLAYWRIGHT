export class LoginPage {
  constructor(private page: any) {}

  async login(email: string, password: string) {
    await this.page.getByPlaceholder('Your email').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: /Sign in/i }).click();
    await this.page.waitForURL(/dashboard/);
  }
}
