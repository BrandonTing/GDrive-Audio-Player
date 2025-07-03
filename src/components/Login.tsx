import { useGoogleLogin } from '@react-oauth/google';
import { notifyAuthStoreChange } from '../hooks/useAuthStore';

interface LoginProps {
  onLoginSuccess: (accessToken: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      localStorage.setItem('google_access_token', tokenResponse.access_token);
      notifyAuthStoreChange(); // Notify the store of the change
      onLoginSuccess(tokenResponse.access_token);
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/drive.readonly',
  });

  return (
    <button onClick={() => login()}>Sign in with Google</button>
  );
};

export default Login;
