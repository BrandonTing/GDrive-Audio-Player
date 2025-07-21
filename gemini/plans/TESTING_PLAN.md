# Testing Plan for GDrive Audio Player

This document outlines the strategy for implementing unit and end-to-end (E2E) tests for the GDrive Audio Player application. It details the chosen tools, their justifications, and specific approaches for testing critical functionalities, including Google Login and Google Drive API interactions.

## 1. Testing Tools and Justification

### 1.1. Unit Testing

*   **Tool:** **Jest**
    *   **Justification:** Jest is a widely adopted, powerful, and fast JavaScript testing framework. It offers built-in assertion libraries, mocking capabilities, and a test runner. It's a standard choice for React projects and integrates seamlessly with TypeScript.
*   **Companion Library:** **React Testing Library (RTL)**
    *   **Justification:** RTL promotes testing components from a user's perspective, leading to more robust tests that are less coupled to internal implementation details. This approach results in more maintainable tests and encourages accessible design.

### 1.2. End-to-End (E2E) Testing

*   **Tool:** **Playwright**
    *   **Justification:** Playwright is a modern, fast, and reliable E2E testing framework developed by Microsoft.
        *   **Cross-Browser Support:** Supports Chromium, Firefox, and WebKit (Safari) out-of-the-box.
        *   **Auto-Waiting:** Automatically waits for elements, reducing test flakiness.
        *   **Powerful API:** Provides a rich API for browser interaction, network interception, and assertions.
        *   **Developer Experience:** Offers features like test generators, trace viewers, and parallel execution.
        *   **Headless/Headed Modes:** Flexible execution for CI/CD or debugging.

## 2. Plan to Implement Testing

### Phase 1: Unit Testing Setup (Jest & React Testing Library)

1.  **Install Dependencies:**
    *   `bun add -D jest ts-jest @types/jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom`
2.  **Configure Jest:**
    *   Create `jest.config.js` in the project root for TypeScript, React, and JSDOM environment.
    *   Update `tsconfig.json` to include Jest types.
3.  **Create First Unit Test:**
    *   Write a simple test for `Login.tsx` or `LoadingSpinner.tsx` using RTL.
    *   Place test files as `*.test.tsx` alongside components or in `__tests__` directories.
4.  **Add Test Script:**
    *   Add `"test:unit": "jest"` to `package.json` scripts.

### Phase 2: End-to-End Testing Setup (Playwright)

1.  **Install Playwright:**
    *   `bun add -D @playwright/test`
    *   `bun playwright install` (to install browser binaries)
2.  **Initialize Playwright:**
    *   Run `bun playwright init` (sets up `playwright.config.ts` and example tests).
3.  **Create First E2E Test:**
    *   Write a basic E2E test for a critical user flow (e.g., navigating to login page and checking button visibility).
    *   Place E2E tests in a dedicated `e2e` directory (e.g., `e2e/*.spec.ts`).
4.  **Add Test Script:**
    *   Add `"test:e2e": "playwright test"` to `package.json` scripts.

### Phase 3: Integration and Best Practices

1.  **Update `.gitignore`:**
    *   Add entries for test reports, Playwright's `test-results` directory, and other test artifacts.
2.  **CI/CD Integration (Future):**
    *   Integrate test scripts into CI/CD pipelines (e.g., GitHub Actions).
3.  **Test Naming Conventions:**
    *   Establish clear conventions (e.g., `*.test.ts` for unit, `*.spec.ts` for E2E).

## 3. Specific Strategies for Google Login and Drive File Fetching

### 3.1. Unit Testing Strategy

**Goal:** Test individual components and service functions in isolation, mocking external dependencies.

#### 3.1.1. Mocking Google Login (`@react-oauth/google`)

*   **Challenge:** `useGoogleLogin` initiates an OAuth flow. We don't want real authentication in unit tests.
*   **Strategy:** Use Jest's `jest.mock()` to mock the `@react-oauth/google` module.
    *   Mock `useGoogleLogin` to return a controlled `login` function and `onSuccess`/`onError` callbacks.
    *   Simulate successful or failed login by calling mocked callbacks.
*   **Example (`Login.test.tsx` - Conceptual):**
    ```typescript
    // __mocks__/@react-oauth/google.ts
    export const useGoogleLogin = jest.fn(() => ({
      login: jest.fn(),
      // Add other mock properties as needed
    }));

    // In Login.test.tsx
    import { render, screen, fireEvent } from '@testing-library/react';
    import Login from '../Login';
    import { useGoogleLogin } from '@react-oauth/google';

    jest.mock('@react-oauth/google');

    describe('Login Component', () => {
      it('calls login function on button click', () => {
        const mockLoginFn = jest.fn();
        (useGoogleLogin as jest.Mock).mockReturnValue({ login: mockLoginFn });

        render(<Login onLoginSuccess={jest.fn()} />);
        fireEvent.click(screen.getByRole('button', { name: /sign in with google/i }));
        expect(mockLoginFn).toHaveBeenCalledTimes(1);
      });

      // Further tests would involve mocking localStorage and notifyAuthStoreChange
      // to verify side effects of onSuccess/onError callbacks.
    });
    ```

#### 3.1.2. Mocking Google Drive API Calls (`axiosInstance`, `googleDriveService.ts`, `HomePage.loader.ts`)

*   **Challenge:** `axiosInstance` makes real HTTP requests.
*   **Strategy:** Use Jest to mock `axios` or `axiosInstance` directly.
    *   Mock specific methods like `axiosInstance.get()` to return predefined mock data or throw errors.
*   **Example (`googleDriveService.test.ts`):**
    ```typescript
    // src/services/googleDriveService.test.ts
    import { fetchFolderContents } from './googleDriveService';
    import axiosInstance from '../api/axiosInstance';

    jest.mock('../api/axiosInstance');
    const mockedAxiosInstance = axiosInstance as jest.Mocked<typeof axiosInstance>;

    describe('googleDriveService', () => {
      it('fetches folder contents successfully', async () => {
        const mockFiles = [{ id: '1', name: 'song.mp3' }];
        mockedAxiosInstance.get.mockResolvedValueOnce({ data: { files: mockFiles } });

        const result = await fetchFolderContents('mockFolderId');
        expect(result).toEqual(mockFiles);
        expect(mockedAxiosInstance.get).toHaveBeenCalledWith(
          '/files',
          expect.objectContaining({
            params: expect.any(Object), // Detailed params can be asserted if needed
          }),
        );
      });

      it('handles API errors during fetchFolderContents', async () => {
        mockedAxiosInstance.get.mockRejectedValueOnce(new Error('Network Error'));
        await expect(fetchFolderContents('mockFolderId')).rejects.toThrow('Network Error');
      });
    });
    ```
*   **For `HomePage.loader.ts`:** Mock `fetchFolderContents`, `localStorage.removeItem`, and `redirect` (from `react-router-dom`) to test error handling and redirection logic.

### 3.2. End-to-End (E2E) Testing Strategy

**Goal:** Simulate real user interactions and verify the entire application flow, including interactions with Google APIs, by intercepting network requests.

#### 3.2.1. Network Interception with Playwright

*   **Challenge:** Avoid hitting real Google servers during E2E tests.
*   **Strategy:** Use Playwright's `page.route()` method to intercept specific URLs and provide mock responses.
*   **Setup:** Configure `playwright.config.ts` or a `global-setup.ts` file.

#### 3.2.2. E2E Test for Google Login Flow

*   **Scenario:** User clicks "Sign in with Google", and the app successfully authenticates.
*   **Strategy:**
    *   Navigate to the `/login` page.
    *   Intercept the Google OAuth authentication URL (`https://accounts.google.com/o/oauth2/v2/auth*`).
    *   Instead of letting it redirect to Google, fulfill the route with a mock response that sets the necessary `localStorage` items (e.g., `google_access_token`) directly and then redirects back to your app's home page.
    *   Alternatively, pre-authenticate by setting `localStorage` items directly in a `beforeEach` hook for the test suite.
    *   Assert that the application navigates to the home page and displays authenticated content.
*   **Example (Conceptual `login.spec.ts`):**
    ```typescript
    // e2e/login.spec.ts
    import { test, expect } from '@playwright/test';

    test('successful login redirects to home page', async ({ page }) => {
      await page.goto('/login');

      // Intercept Google OAuth requests and mock a successful response
      await page.route('https://accounts.google.com/o/oauth2/v2/auth*', route => {
        route.fulfill({
          status: 200,
          headers: { 'Content-Type': 'text/html' },
          body: `
            <script>
              localStorage.setItem('google_access_token', 'mock_e2e_token');
              window.location.href = '/'; // Redirect to your app's home page
            </script>
          `,
        });
      });

      await page.click('button:has-text("Sign in with Google")');
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
      await expect(page.locator('button:has-text("Sign in with Google")')).not.toBeVisible();
    });
    ```

#### 3.2.3. E2E Test for Google Drive File Fetching

*   **Scenario:** After login, the app fetches and displays audio files from Google Drive.
*   **Strategy:**
    *   Start the test in an authenticated state (pre-set `localStorage`).
    *   Intercept requests to `https://www.googleapis.com/drive/v3/files*`.
    *   Provide mock JSON responses for various scenarios (empty folder, files list, API errors).
    *   Assert that the UI correctly renders the mock data or handles errors.
*   **Example (Conceptual `homepage.spec.ts`):**
    ```typescript
    // e2e/homepage.spec.ts
    import { test, expect } from '@playwright/test';

    test.beforeEach(async ({ page }) => {
      await page.goto('/');
      await page.evaluate(() => {
        localStorage.setItem('google_access_token', 'mock_e2e_token');
      });
      await page.goto('/');
    });

    test('displays audio files from Google Drive', async ({ page }) => {
      await page.route('https://www.googleapis.com/drive/v3/files*', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            files: [{ id: 'audio1', name: 'My Song.mp3', mimeType: 'audio/mpeg' }],
          }),
        });
      });

      await page.goto('/');
      await expect(page.locator('text=My Song.mp3')).toBeVisible();
    });

    test('redirects to login on Google Drive API 401 error', async ({ page }) => {
      await page.route('https://www.googleapis.com/drive/v3/files*', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'invalid_token' }),
        });
      });

      await page.goto('/');
      await page.waitForURL('/login');
      await expect(page).toHaveURL('/login');
      await expect(page.locator('button:has-text("Sign in with Google")')).toBeVisible();
    });
    ```
