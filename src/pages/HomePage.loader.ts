import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import { fetchFolderContents } from '../services/googleDriveService';

export async function homePageLoader({ params }: LoaderFunctionArgs) {
  const folderId = params.folderId as string | undefined;
  try {
    const files = await fetchFolderContents(folderId || null);
    return { files };
  } catch (error) {
    console.error('Error in HomePage loader', error);
    // Clear the access token and redirect to login
    localStorage.removeItem('google_access_token');
    return redirect('/login');
  }
}
