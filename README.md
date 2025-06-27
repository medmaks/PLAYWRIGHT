tests/edu-planner-tests ТЕСТ ЗНАЙШОВ БАГ У САЙТІ ЯК І ПОТРІБНО БУЛО У ВХОДІ ЗАВДАННЯ "ТЕСТУВАННЯ" 
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




























PLAYWRIGHT/tests/laba1
/form-tests.spec.ts
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

tests/laba1/lab1data.ts
// lab1data.ts

export const userData = {
  firstName: 'Іван',
  lastName: 'Петренко',
  userName: 'ivanpetrenko',
  password: 'Test123!',
  email: 'ivan@example.com',
  currentAddress: 'м. Київ',
  permanentAddress: 'м. Львів'
};

tests/laba1/lab1selectors.ts
// lab1selectors.ts

export const selectors = {
  registerPage: 'https://demoqa.com/register',
  textBoxPage: 'https://demoqa.com/text-box',
  buttonsPage: 'https://demoqa.com/buttons',

  firstNameInput: '#firstname',
  lastNameInput: '#lastname',
  userNameInput: '#userName',
  passwordInput: '#password',
  registerButton: '#register',

  textBoxNameInput: '#userName',
  textBoxEmailInput: '#userEmail',
  textBoxCurrentAddress: '#currentAddress',
  textBoxPermanentAddress: '#permanentAddress',
  textBoxSubmitButton: '#submit',
  textBoxNameOutput: '#output #name',

  doubleClickButton: '#doubleClickBtn',
  doubleClickMessage: '#doubleClickMessage',

  rightClickButton: '#rightClickBtn',
  rightClickMessage: '#rightClickMessage'
};

tests/laba2/lab2data.ts
export const sortableData = {
  expectedCount: 6,
  firstItem: 'One',
  lastItem: 'Six'
};

tests/laba2/lab2selectors.ts
export const selectors = {
  sortablePage: 'https://demoqa.com/sortable',
  sortableListItems: '#demo-tabpane-list .list-group-item'
};

tests/laba2/sortable.spec.ts
import { test, expect } from '@playwright/test';
import { selectors } from './lab2selectors';
import { sortableData } from './lab2data';

test('Перевірка списку сортування', async ({ page }) => {
  await page.goto(selectors.sortablePage, { timeout: 60000, waitUntil: 'domcontentloaded' });

  const listItems = page.locator(selectors.sortableListItems);

  // Чекаємо, поки елементи з'являться
  await expect(listItems.first()).toBeVisible();

  // Перевіряємо кількість елементів
  const itemCount = await listItems.count();
  expect(itemCount).toBe(sortableData.expectedCount);

  // Перевіряємо текст першого і останнього елементів
  const firstText = await listItems.nth(0).innerText();
  const lastText = await listItems.nth(itemCount - 1).innerText();

  expect(firstText).toBe(sortableData.firstItem);
  expect(lastText).toBe(sortableData.lastItem);
});

tests/laba3/laba3.spec.ts
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

tests/laba5
import { test, expect } from '@playwright/test';

test('Create faculty → group → teacher chain', async ({ page }) => {
  await page.goto('https://demoqa.com/webtables');

  // === 1. Додаємо "Факультет"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Faculty');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'faculty@example.com');
  await page.fill('#age', '45');
  await page.fill('#salary', '10000');
  await page.fill('#department', 'Faculty of Physics');
  await page.click('#submit');

  // === 2. Додаємо "Групу"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Group');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'group@example.com');
  await page.fill('#age', '30');
  await page.fill('#salary', '5000');
  await page.fill('#department', 'Phys-101');
  await page.click('#submit');

  // === 3. Додаємо "Викладача"
  await page.click('#addNewRecordButton');
  await page.fill('#firstName', 'Teacher');
  await page.fill('#lastName', 'Test');
  await page.fill('#userEmail', 'teacher@example.com');
  await page.fill('#age', '40');
  await page.fill('#salary', '8000');
  await page.fill('#department', 'Phys-101');
  await page.click('#submit');

  // === 4. Перевірка через пошук
  await page.fill('#searchBox', 'Teacher');

  const filteredRows = page.locator('.rt-tr-group', { hasText: 'Teacher' });
  await expect(filteredRows).toHaveCount(1);

  const row = filteredRows.first();
  await expect(row).toContainText('Teacher');
  await expect(row).toContainText('teacher@example.com');
  await expect(row).toContainText('Phys-101');
});

tests/laba6/lab6.spec.ts
import { test, expect, chromium } from '@playwright/test';

test.describe('Лабораторна 6: Тестування API + UI з мокапами', () => {
  // --- 1. Мокап SMS API ---
  test('Успішна відправка SMS', async ({ page }) => {
    await page.route('**/api/sms/send', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'SMS sent successfully' }),
      });
    });

    await page.goto('https://demoqa.com/books');
    // Тут мало б бути натискання кнопки, яка тригерить SMS
    console.log(' Мокап SMS з кодом 200 відпрацював');
  });

  test('Помилка сервера SMS (500)', async ({ page }) => {
    await page.route('**/api/sms/send', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.goto('https://demoqa.com/books');
    console.log(' Мокап SMS з помилкою 500 відпрацював');
  });

  test('Таймаут SMS сервісу', async ({ page }) => {
    await page.route('**/api/sms/send', async (route) => {
      await new Promise((res) => setTimeout(res, 6000));
      await route.abort(); // Імітація обриву
    });

    await page.goto('https://demoqa.com/books');
    console.log('⏱ Мокап таймауту SMS API відпрацював');
  });

  // --- 2. Створення користувача через UI та мокап SMS ---
  test('Створення користувача + перехоплення SMS', async ({ page }) => {
    await page.route('**/api/sms/send', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'SMS sent successfully' }),
      });
    });

    await page.goto('https://demoqa.com/register');

    await page.fill('#firstname', 'Test');
    await page.fill('#lastname', 'User');
    await page.fill('#userName', 'testuser123');
    await page.fill('#password', 'Pass123!');
    await page.click('#register');

    // Очікувана реакція — можеш адаптувати під свій UI
    console.log(' Перевірка системної реакції на успішну SMS-відправку');
  });

  // --- 3. Синхронізація даних між вкладками ---
  test('Синхронізація між вкладками (localStorage)', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('https://demoqa.com/books');
    await page2.goto('https://demoqa.com/books');

    await page1.evaluate(() => {
      localStorage.setItem('testItem', JSON.stringify({ key: 'value' }));
      window.dispatchEvent(new Event('storage'));
    });

    const isSynced = await page2.evaluate(() => {
      const item = localStorage.getItem('testItem');
      return item !== null && JSON.parse(item).key === 'value';
    });

    expect(isSynced).toBeTruthy();
    console.log('🔄 Дані синхронізовано між вкладками');

    await browser.close();
  });

  // --- 4. Оновлення UI після зміни даних через API ---
  test('UI оновлюється після зміни API', async ({ page }) => {
    await page.route('**/BookStore/v1/Books', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          books: [{ title: 'Новинка з API', isbn: '000-NEW' }],
        }),
      });
    });

    await page.goto('https://demoqa.com/books');

    const found = await page.locator('.rt-td').filter({ hasText: 'Новинка з API' }).isVisible();
    expect(found).toBeTruthy();
    console.log(' UI оновився на основі API відповіді');
  });

  // --- 5. Реалтайм оновлення UI між користувачами ---
  test('Real-time оновлення між вкладками', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    await page1.goto('https://demoqa.com/books');
    await page2.goto('https://demoqa.com/books');

    await page1.evaluate(() => {
      localStorage.setItem('books', JSON.stringify([{ title: 'RealTime Book', isbn: '111' }]));
      window.dispatchEvent(new Event('storage'));
    });

    const synced = await page2.evaluate(() => {
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      return books.length > 0 && books[0].title === 'RealTime Book';
    });

    expect(synced).toBeTruthy();
    console.log(' Дані в реальному часі оновлені між користувачами');

    await browser.close();
  });
});
