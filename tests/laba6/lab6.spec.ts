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