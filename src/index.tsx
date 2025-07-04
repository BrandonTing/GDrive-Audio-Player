import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { protectedLoader } from './loaders/protectedLoader';
import { loginRedirectLoader } from './loaders/loginRedirectLoader'; // Import loginRedirectLoader
import HomePage from './pages/HomePage';
import { homePageLoader } from './pages/HomePage.loader'; // Import the homePageLoader
import LoginPage from './pages/LoginPage';

// Combine protectedLoader and homePageLoader
async function rootPageCombinedLoader() {
  await protectedLoader(); // This will throw a redirect if not authenticated
  return homePageLoader();
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
        loader: rootPageCombinedLoader, // Use the combined loader
      },
      {
        path: 'login',
        element: <LoginPage />,
        loader: loginRedirectLoader, // Apply loginRedirectLoader to the login route
      },
    ],
  },
]);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
