import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';

const App = () => {
  const clientId = process.env.PUBLIC_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return <div>Error: Missing Google Client ID</div>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="content">
        <h1>GDrive Audio Player</h1>
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
