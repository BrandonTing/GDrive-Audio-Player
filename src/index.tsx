import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { protectedLoader } from './loaders/protectedLoader';
import RootLayout from './layouts/RootLayout'; // Import RootLayout

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // Use RootLayout as the main element
    children: [
      {
        index: true, // This makes '/' render HomePage
        element: <HomePage />,
        loader: protectedLoader,
      },
      {
        path: "login", // Relative path to parent
        element: <LoginPage />,
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
