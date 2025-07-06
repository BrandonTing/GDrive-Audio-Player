import { useGoogleLogin } from '@react-oauth/google';
import { notifyAuthStoreChange } from '../hooks/useAuthStore';

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      localStorage.setItem('google_access_token', tokenResponse.access_token);
      notifyAuthStoreChange(); // Notify the store of the change
      onLoginSuccess();
    },
    onError: () => {
      console.log('Login Failed');
    },
    scope: 'https://www.googleapis.com/auth/drive.readonly',
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="flex justify-center items-center px-6 py-3 w-full font-semibold text-white bg-blue-600 rounded-lg shadow-md transition duration-300 ease-in-out hover:bg-blue-700"
    >
      <img
        src="https://www.gstatic.com/images/branding/googleg/1x/googleg_standard_color_18dp.png"
        alt="Google icon"
        className="mr-2 w-5 h-5"
      />
      Sign in with Google
    </button>
  );
};

export default Login;
