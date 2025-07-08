import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import RootLayout from './layouts/RootLayout';
import { loginRedirectLoader } from './loaders/loginRedirectLoader'; // Import loginRedirectLoader
import { protectedLoader } from './loaders/protectedLoader';
import HomePage from './pages/HomePage';
import { homePageLoader } from './pages/HomePage.loader'; // Import the homePageLoader
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <RootLayout />,
      children: [
        {
          loader: protectedLoader,
          children: [
            {
              index: true,
              element: <HomePage />,
              loader: homePageLoader, // Use the combined loader
            },
            {
              path: 'folder/:folderId',
              element: <HomePage />,
              loader: homePageLoader, // Use the combined loader for nested folders
            },
          ],
        },
        {
          path: 'login',
          element: <LoginPage />,
          loader: loginRedirectLoader, // Apply loginRedirectLoader to the login route
        },
      ],
    },
  ],
  {
    basename: '/GDrive-Audio-Player',
  },
);

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
