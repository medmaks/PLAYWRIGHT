import { test, expect } from '@playwright/test';

// === ВАШІ НОВІ ДАНІ ===
const username = 'Maks3';
const password = 'Jv3@pQ!8';
// ======================

test.describe('Лабораторна 3: Перехоплення токену після UI-логіну', () => {

  test('Виконуємо логін через UI та перехоплюємо відповідь з токеном', async ({ page }) => {
    // Переходимо на сторінку логіну
    await page.goto('https://demoqa.com/login');

    // Крок 1: Починаємо чекати на відповідь від сервера.
    // Це потрібно зробити ДО того, як ми натиснемо кнопку "Login".
    const responsePromise = page.waitForResponse('**/Account/v1/Login');

    // Крок 2: Заповнюємо форму логіну на сторінці
    await page.getByPlaceholder('UserName').fill(username);
    await page.getByPlaceholder('Password').fill(password);

    // Крок 3: Натискаємо кнопку "Login". Браузер відправить запит на сервер.
    await page.getByRole('button', { name: 'Login' }).click();

    // Крок 4: Чекаємо, поки наш "слухач" отримає відповідь від сервера
    const response = await responsePromise;
    const loginResponseJson = await response.json();

    // Перевіряємо, що відповідь успішна і містить токен
    expect(response.ok()).toBeTruthy();
    expect(loginResponseJson).toHaveProperty('token');
    
    const token = loginResponseJson.token;
    const userId = loginResponseJson.userId;
    console.log(`УСПІХ: Токен перехоплено після логіну через UI для користувача ${username}`);

    // Крок 5: Використовуємо перехоплений токен для API-запиту до профілю
    const profileResponse = await page.request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    expect(profileResponse.ok()).toBeTruthy();
    const profileResponseJson = await profileResponse.json();
    
    expect(profileResponseJson.username).toEqual(username);
    console.log(`УСПІХ: Успішно отримано дані профілю для користувача ${profileResponseJson.username} за допомогою перехопленого токену.`);
  });
});