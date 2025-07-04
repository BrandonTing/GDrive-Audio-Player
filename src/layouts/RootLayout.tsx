import type React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { useLoadGapi } from '../hooks/useLoadGapi';

const RootLayout: React.FC = () => {
  useLoadGapi();
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default RootLayout;
