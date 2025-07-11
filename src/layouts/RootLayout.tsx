import type React from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet, useNavigation } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { AuthProvider } from '../context/AuthContext';
import { PlaylistProvider } from '../context/PlaylistContext'; // Import PlaylistProvider
import { useLoadGapi } from '../hooks/useLoadGapi';

const RootLayout: React.FC = () => {
  useLoadGapi();
  const navigation = useNavigation();

  return (
    <AuthProvider>
      <PlaylistProvider>
        {' '}
        {/* Wrap Outlet with PlaylistProvider */}
        <Toaster />
        {navigation.state === 'loading' && <LoadingSpinner />}
        <Outlet />
      </PlaylistProvider>
    </AuthProvider>
  );
};

export default RootLayout;
