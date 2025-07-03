# How to Get Your Google Client ID for GDrive Audio Player

Follow these steps to create the necessary credentials in the Google Cloud Console.

## 1. Create a Google Cloud Project

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Click the project dropdown in the top navigation bar and click **New Project**.
3.  Give your project a name (e.g., "GDrive Audio Player") and click **Create**.

## 2. Enable the Google Drive API

1.  Once your project is created, make sure it's selected in the project dropdown.
2.  In the search bar at the top, search for "Google Drive API" and select it from the results.
3.  Click the **Enable** button. If you don't see it, the API might already be enabled.

## 3. Configure the OAuth Consent Screen

This screen is what users will see when they are asked to grant permission to your application.

1.  From the navigation menu (hamburger icon ☰), go to **APIs & Services** > **OAuth consent screen**.
2.  Choose the **External** user type and click **Create**.
3.  Fill in the required application information:
    *   **App name:** GDrive Audio Player
    *   **User support email:** Select your email address.
    *   **Developer contact information:** Enter your email address.
4.  Click **Save and Continue**.
5.  On the **Scopes** page, click **Add or Remove Scopes**.
6.  In the filter box, search for `drive.readonly`.
7.  Find and enable the scope `.../auth/drive.readonly` (View your Google Drive files).
8.  Click **Update**, then click **Save and Continue**.
9.  On the **Test users** page, click **Add Users**.
10. Enter your own Google email address. This will allow you to test the application before it's published.
11. Click **Add**, then click **Save and Continue**.
12. Review the summary and click **Back to Dashboard**.

## 4. Create Your OAuth 2.0 Client ID

This is the final step to get the ID you need for the application.

1.  In the left-hand menu, go to **Credentials**.
2.  Click **+ Create Credentials** at the top of the page and select **OAuth 2.0 Client ID**.
3.  For the **Application type**, select **Web application**.
4.  Give it a **Name** (e.g., "GDrive Player Web Client").
5.  Under **Authorized JavaScript origins**, click **+ Add URI**.
6.  Enter `http://localhost:3000`. This is the address used by the development server.
7.  Click **Create**.
8.  A pop-up will appear showing your credentials. **Copy the "Your Client ID" value.** It will look something like `1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com`.

## 5. Add the Client ID to Your Application

1.  Open the `src/App.tsx` file in your project.
2.  Find the line that says `clientId="YOUR_GOOGLE_CLIENT_ID"`.
3.  Replace `YOUR_GOOGLE_CLIENT_ID` with the ID you just copied.
4.  Save the file.

You are now ready to run the application and sign in with your Google account!
