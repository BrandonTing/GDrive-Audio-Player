import { redirect } from 'react-router-dom';

export async function loginRedirectLoader() {
  const accessToken = localStorage.getItem('google_access_token');

  if (accessToken) {
    // If already logged in, redirect to the home page
    throw redirect('/');
  }

  return null;
}
