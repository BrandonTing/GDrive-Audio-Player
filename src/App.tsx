import './App.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './components/Login';

const App = () => {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="content">
        <h1>GDrive Audio Player</h1>
        <Login />
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;
