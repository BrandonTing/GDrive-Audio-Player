import { redirect } from 'react-router-dom';

export async function protectedLoader() {
  const accessToken = localStorage.getItem('google_access_token');

  if (!accessToken) {
    throw redirect('/login');
  }

  return null;
}
