import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../components/Login';

const LoginPage = () => {
  const clientId = process.env.PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <div>Error: Missing Google Client ID</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div>
        <h1>Login</h1>
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
