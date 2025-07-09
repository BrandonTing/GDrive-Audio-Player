import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const clientId = import.meta.env.PUBLIC_GOOGLE_CLIENT_ID;
  const { onLoginSuccess } = useAuth();

  if (!clientId) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 bg-gray-900">
        Error: Missing Google Client ID. Please check your environment
        variables.
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="flex flex-col justify-center items-center p-4 min-h-screen text-white bg-gray-900">
        <div className="p-8 w-full max-w-md text-center bg-gray-800 rounded-lg shadow-lg">
          <h1 className="mb-4 text-4xl font-bold">GDrive Audio Player</h1>
          <p className="mb-8 text-gray-300">
            Access and play your audio files directly from Google Drive.
          </p>
          <Login onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
