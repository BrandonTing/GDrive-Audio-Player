import type React from 'react';
import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  onLoginSuccess: (accessToken: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  // Memoize the context value object, and define onLoginSuccess directly inside
  const contextValue = useMemo(() => {
    const onLoginSuccess = (accessToken: string) => {
      navigate('/');
    };
    return { onLoginSuccess };
  }, [navigate]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
