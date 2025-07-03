import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const handleLoginSuccess = (credentialResponse: any) => {
    console.log(credentialResponse);
    // We will handle the access token here in the next step
  };

  const handleLoginError = () => {
    console.log('Login Failed');
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={handleLoginError}
    />
  );
};

export default Login;
