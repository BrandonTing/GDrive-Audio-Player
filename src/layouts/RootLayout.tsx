import type React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { PlaylistProvider } from '../context/PlaylistContext'; // Import PlaylistProvider
import { useLoadGapi } from '../hooks/useLoadGapi';

const RootLayout: React.FC = () => {
  useLoadGapi();
  return (
    <AuthProvider>
      <PlaylistProvider> {/* Wrap Outlet with PlaylistProvider */}
        <Outlet />
      </PlaylistProvider>
    </AuthProvider>
  );
};

export default RootLayout;
