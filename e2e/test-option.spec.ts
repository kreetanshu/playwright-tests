import { test, expect } from '@playwright/test';

test.use({
  baseURL: 'https://example.com',
  headless: true,
});

test.describe.configure({ retries: 1 });

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('login test', async ({ page }, testInfo) => {
  await test.step('Fill login form', async () => {
    await page.fill('#user', 'admin');
    await page.fill('#pass', 'password');
  });

  await test.step('Submit', async () => {
    await page.click('#login');
  });

  await testInfo.attach('screenshot', {
    body: await page.screenshot(),
    contentType: 'image/png',
  });

  expect(await page.title()).toContain('Dashboard');
});