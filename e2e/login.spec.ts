import { expect, test } from '@playwright/test';

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

test('should navigate to the login page when user is not logged in', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('GDrive Audio Player');
  await expect(page.locator('button', { hasText: 'Sign in with Google' })).toBeVisible();
});
