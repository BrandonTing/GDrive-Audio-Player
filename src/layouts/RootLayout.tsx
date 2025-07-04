import type React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PlaylistProvider } from '../context/PlaylistContext'; // Import PlaylistProvider
import { useLoadGapi } from '../hooks/useLoadGapi';

const RootLayout: React.FC = () => {
  useLoadGapi();
  return (
    <AuthProvider>
      <PlaylistProvider> {/* Wrap Outlet with PlaylistProvider */}
        <Toaster />
        <Outlet />
      </PlaylistProvider>
    </AuthProvider>
  );
};

export default RootLayout;
