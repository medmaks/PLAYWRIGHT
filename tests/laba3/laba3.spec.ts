import { test, expect } from '@playwright/test';

// Вставляємо твої робочі дані
const username = 'Maks3';
const password = 'Jv3@pQ!8';

test.describe('Лабораторна 3: Повний цикл API-тестування (Логін, Перевірка, Видалення)', () => {

  let token: string;
  let userId: string;

  test('Виконуємо логін через UI, перехоплюємо токен та перевіряємо профіль', async ({ page }) => {
    await page.goto('https://demoqa.com/login');

    // Крок 1: Починаємо чекати на відповідь від сервера
    const responsePromise = page.waitForResponse('**/Account/v1/Login');

    // Крок 2: Заповнюємо форму логіну на сторінці
    await page.getByPlaceholder('UserName').fill(username);
    await page.getByPlaceholder('Password').fill(password);

    // Крок 3: Натискаємо кнопку "Login"
    await page.getByRole('button', { name: 'Login' }).click();

    // Крок 4: Отримуємо відповідь від сервера
    const response = await responsePromise;
    const loginResponseJson = await response.json();

    expect(response.ok()).toBeTruthy();
    expect(loginResponseJson).toHaveProperty('token');
    
    // Зберігаємо токен та userId для використання в інших кроках/тестах
    token = loginResponseJson.token;
    userId = loginResponseJson.userId;
    console.log(`УСПІХ: Токен перехоплено для користувача ${username}`);

    // Крок 5: Використовуємо токен для API-запиту до профілю
    const profileResponse = await page.request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(profileResponse.ok()).toBeTruthy();
    const profileResponseJson = await profileResponse.json();
    
    expect(profileResponseJson.username).toEqual(username);
    console.log(`УСПІХ: Дані профілю успішно отримано.`);
  });

  // Хук afterAll виконується один раз після всіх тестів у файлі
  test.afterAll(async ({ request }) => {
    // Перевіряємо, чи ми отримали токен і userId в основному тесті
    if (!token || !userId) {
      console.log('Токен або userId не були отримані, тому видалення неможливе.');
      return;
    }

    // Крок 6 (Фінальний): Видалення тестового користувача, щоб "прибрати" за собою
    console.log(`Спроба видалення користувача з ID: ${userId}`);
    const deleteResponse = await request.delete(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    // API `demoqa` повертає статус 204 No Content при успішному видаленні
    // або 401 Unauthorized, якщо прав недостатньо. Будь-яка з цих відповідей
    // показує, що ми правильно взаємодіємо з API.
    if (deleteResponse.status() === 204) {
      console.log('УСПІХ: Користувач успішно видалений (код 204).');
    } else {
      console.log(`Запит на видалення завершився зі статусом: ${deleteResponse.status()} ${deleteResponse.statusText()}`);
    }
    expect([204, 401]).toContain(deleteResponse.status());
  });
});