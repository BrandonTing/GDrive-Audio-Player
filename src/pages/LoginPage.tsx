import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const clientId = process.env.PUBLIC_GOOGLE_CLIENT_ID;
  const { onLoginSuccess } = useAuth();

  if (!clientId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-red-500">
        Error: Missing Google Client ID. Please check your environment variables.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold mb-4">GDrive Audio Player</h1>
          <p className="text-gray-300 mb-8">
            Access and play your audio files directly from Google Drive.
          </p>
          <Login onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
