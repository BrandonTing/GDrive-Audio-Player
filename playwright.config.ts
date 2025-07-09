import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: 'PUBLIC_GOOGLE_CLIENT_ID=1234567890 bun dev',
    url: 'http://localhost:3000/GDrive-Audio-Player',
    reuseExistingServer: !process.env.CI,
  },
  use: {
    baseURL: 'http://localhost:3000/GDrive-Audio-Player',
    // 確保 localStorage 可以正常工作
    storageState: undefined,
    // 允許不安全的 HTTPS 連接（如果需要）
    ignoreHTTPSErrors: true,
    // 設置合適的 viewport
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'Chromium',
      use: {
        browserName: 'chromium',
      },
    }
  ]
});
