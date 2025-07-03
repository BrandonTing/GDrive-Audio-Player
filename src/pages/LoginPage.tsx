import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const clientId = process.env.PUBLIC_GOOGLE_CLIENT_ID;
  const { onLoginSuccess } = useAuth();

  if (!clientId) {
    return <div>Error: Missing Google Client ID</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <h1>Login</h1>
        <Login onLoginSuccess={onLoginSuccess} />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
