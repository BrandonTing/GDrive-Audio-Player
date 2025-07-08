import { expect, test } from '@playwright/test';

// 在每個測試前設定登入狀態
test.beforeEach(async ({ page }) => {
  // 使用 addInitScript 在頁面載入前設定 localStorage
  // 這是最可靠的方法，會在每次頁面導航時自動執行
  await page.addInitScript(() => {
    localStorage.setItem('google_access_token', 'dummy_access_token');
  });

  // 模擬 Google Drive API 響應，防止 homePageLoader 失敗
  await page.route('https://www.googleapis.com/drive/v3/files*', (route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        files: [
          {
            id: 'audio1',
            name: 'Test Song.mp3',
            mimeType: 'audio/mpeg',
          },
          {
            id: 'folder1',
            name: 'Music Folder',
            mimeType: 'application/vnd.google-apps.folder',
          },
        ],
      }),
    });
  });
});

test('should successfully log in and display home page content', async ({
  page,
}) => {
  // 導航到首頁
  await page.goto('/');

  // 等待頁面載入完成
  await page.waitForLoadState('networkidle');
  // 檢查是否顯示了主頁面標題
  await expect(
    page.locator('h1:has-text("Your Google Drive Files")'),
  ).toBeVisible();

  // 檢查 Playlist 標題是否可見
  await expect(page.locator('h2:has-text("Playlist")')).toBeVisible();

  // 檢查是否顯示了音頻播放器的狀態
  await expect(page.locator('text=Status:')).toBeVisible();

  // 檢查是否顯示了文件夾和音頻文件的分組標題
  await expect(page.locator('h2:has-text("Folders")')).toBeVisible();
  await expect(page.locator('h2:has-text("Audio Files")')).toBeVisible();

  // 檢查是否顯示了模擬的文件
  await expect(page.locator('text=Test Song.mp3')).toBeVisible();
  await expect(page.locator('text=Music Folder')).toBeVisible();
});
