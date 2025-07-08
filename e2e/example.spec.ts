import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.route('https://apis.google.com/js/api.js', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'text/javascript',
      body: 'window.gapi = { load: () => {} };',
    });
  });
});

test('has title', async ({ page }) => {
  await page.goto('/GDrive-Audio-Player/login');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Rsbuild App/);
});

test('login page has sign in button', async ({ page }) => {
  await page.goto('/GDrive-Audio-Player/login');

  // Expect the page to have a button with the text "Sign in with Google".
  await expect(
    page.getByRole('button', { name: 'Sign in with Google' }),
  ).toBeVisible();
});
