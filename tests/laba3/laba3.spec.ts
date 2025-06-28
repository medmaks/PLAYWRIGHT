import { test, expect } from '@playwright/test';

// Створюємо унікальні дані для кожного запуску тесту, щоб уникнути конфліктів
const uniqueUsername = `testuser_${Date.now()}`;
const password = `Password_123!`;

// Описуємо наш тестовий набір
test.describe('Лабораторна 3: Повний цикл API-тестування з автоматичним створенням користувача', () => {
  
  // Змінні для збереження ID користувача та токену, щоб використовувати їх у різних тестах
  let userId: string;
  let token: string;

  // Хук beforeAll виконується один раз перед усіма тестами в цьому файлі
  test.beforeAll(async ({ request }) => {
    // Крок 1 (Підготовка): Створюємо нового користувача через API
    const response = await request.post('https://demoqa.com/Account/v1/User', {
      data: {
        userName: uniqueUsername,
        password: password,
      },
    });

    // Перевіряємо, що запит на створення був успішним (код 201 Created)
    expect(response.status()).toBe(201);
    const responseJson = await response.json();
    userId = responseJson.userID;
    console.log(`УСПІХ: Користувача "${uniqueUsername}" створено з ID: ${userId}`);
  });

  // Основний тест, який перевіряє логін та доступ до профілю
  test('Виконуємо логін через UI, перехоплюємо токен та перевіряємо профіль', async ({ page }) => {
    
    // Крок 2: Переходимо на сторінку логіну
    await page.goto('https://demoqa.com/login');

    // Крок 3: Починаємо "слухати" мережеві запити, щоб перехопити відповідь на логін
    const responsePromise = page.waitForResponse('**/Account/v1/Login');

    // Крок 4: Заповнюємо форму логіну даними щойно створеного користувача
    await page.getByPlaceholder('UserName').fill(uniqueUsername);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    // Крок 5: Отримуємо відповідь від сервера, яку ми "слухали"
    const response = await responsePromise;
    const loginResponseJson = await response.json();

    // Перевіряємо, що логін успішний і відповідь містить токен
    expect(response.ok()).toBeTruthy();
    expect(loginResponseJson).toHaveProperty('token');
    
    // Зберігаємо токен для використання в наступних кроках
    token = loginResponseJson.token;
    console.log(`УСПІХ: Токен перехоплено для користувача "${uniqueUsername}"`);

    // Крок 6: Використовуємо токен для API-запиту до профілю (вже з контексту браузера)
    const profileResponse = await page.request.get(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Перевіряємо, що запит до профілю успішний і дані вірні
    expect(profileResponse.ok()).toBeTruthy();
    const profileResponseJson = await profileResponse.json();
    expect(profileResponseJson.username).toEqual(uniqueUsername);
    console.log(`УСПІХ: Дані профілю успішно отримано через API.`);
  });

  // Хук afterAll виконується один раз після всіх тестів
  test.afterAll(async ({ request }) => {
    // Перевіряємо, чи ми отримали токен і userId
    if (!token || !userId) {
      console.log('Токен або userId не були отримані, видалення неможливе.');
      return;
    }

    // Крок 7 (Очищення): Видаляємо створеного користувача, щоб не залишати сміття
    console.log(`Спроба видалення користувача з ID: ${userId}`);
    const deleteResponse = await request.delete(`https://demoqa.com/Account/v1/User/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    // Очікуємо статус 204 (успішне видалення) або 401 (недостатньо прав, що теж є валідною реакцією API)
    expect([204, 401]).toContain(deleteResponse.status());
    console.log(`Запит на видалення завершився зі статусом: ${deleteResponse.status()}. Тестовий цикл завершено.`);
  });
});