import { test, expect } from '@playwright/test';

test('should navigate into a folder and display its contents', async ({ page }) => {
  // Mock Google Drive API responses
  await page.route('**/files?q=*', async (route) => {
    const url = new URL(route.request().url());
    const qParam = url.searchParams.get('q');

    if (qParam?.includes("'root' in parents")) {
      // Mock response for root folder
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          files: [
            {
              id: 'folder1',
              name: 'My Music Folder',
              mimeType: 'application/vnd.google-apps.folder',
            },
            {
              id: 'audio1',
              name: 'song1.mp3',
              mimeType: 'audio/mpeg',
            },
          ],
        }),
      });
    } else if (qParam?.includes("'folder1' in parents")) {
      // Mock response for 'folder1'
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          files: [
            {
              id: 'audio2',
              name: 'song2.mp3',
              mimeType: 'audio/mpeg',
            },
            {
              id: 'audio3',
              name: 'song3.wav',
              mimeType: 'audio/wav',
            },
          ],
        }),
      });
    } else {
      await route.continue();
    }
  });

  // Simulate a logged-in state
  await page.context().addInitScript(() => {
    localStorage.setItem('google_access_token', 'dummy_access_token');
  });

  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Verify initial content of the home page
  await expect(page.locator('h1')).toContainText('Your Google Drive Files');
  await expect(page.locator('text=My Music Folder')).toBeVisible();
  await expect(page.locator('text=song1.mp3')).toBeVisible();

  // Click on the folder
  await page.locator('text=My Music Folder').click();
  await page.waitForLoadState('networkidle');

  // Verify URL has changed
  await expect(page).toHaveURL(/.*\/folder\/folder1$/);

  // Verify content of the folder
  await expect(page.locator('h1')).toContainText('Folder Contents');
  await expect(page.locator('text=song2.mp3')).toBeVisible();
  await expect(page.locator('text=song3.wav')).toBeVisible();
  await expect(page.locator('text=song1.mp3')).not.toBeVisible(); // Ensure old files are gone
});
