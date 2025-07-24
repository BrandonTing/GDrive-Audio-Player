import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
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

// 1. Create a client
const queryClient = new QueryClient();

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
              loader: homePageLoader(queryClient), // Use the loader factory
            },
            {
              path: 'folder/:folderId',
              element: <HomePage />,
              loader: homePageLoader(queryClient), // Use the loader factory
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
      {/* 2. Provide the client to your App */}
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        {/* 3. Add the devtools (will only show in development) */}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}
