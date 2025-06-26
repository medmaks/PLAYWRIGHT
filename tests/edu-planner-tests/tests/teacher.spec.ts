import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TeacherGroupPage } from '../pages/teacherGroup.page';

test.describe('Teacher management', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await page.goto(process.env.BASE_URL!);
    await loginPage.login(process.env.EDU_EMAIL!, process.env.EDU_PASSWORD!);
  });

  test('Додавання викладача до групи', async ({ page }) => {
    const tg = new TeacherGroupPage(page);
    await tg.goto();
    await tg.addTeacher({
      name: 'Іван Іванов',
      email: 'ivanov@example.com',
      group: 'ІТ-101'
    });
    await expect(page.locator('text=Іван Іванов')).toBeVisible();
  });

  test('Валідація пустого e-mail викладача', async ({ page }) => {
    const tg = new TeacherGroupPage(page);
    await tg.goto();
    await tg.addTeacher({
      name: 'Без пошти',
      email: '',
      group: 'ІТ-101'
    });
    await expect(page.locator('.error')).toContainText('Email обов\'язковий');
  });
});
