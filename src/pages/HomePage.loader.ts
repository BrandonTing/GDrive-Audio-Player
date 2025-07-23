import type { LoaderFunctionArgs } from 'react-router-dom';
import { redirect } from 'react-router-dom';
import {
  fetchFolderContents,
  fetchFolderDetails,
} from '../services/googleDriveService';

export async function homePageLoader({ params }: LoaderFunctionArgs) {
  const folderId = params.folderId as string | undefined;
  try {
    const [files, folderDetails] = await Promise.all([
      fetchFolderContents(folderId || null),
      folderId ? fetchFolderDetails(folderId) : null,
    ]);
    return { files, parentId: folderDetails?.parents?.[0] || null };
  } catch (_error) {
    console.error('Error in HomePage loader');
    // Clear the access token and redirect to login
    localStorage.removeItem('google_access_token');
    return redirect('/login');
  }
}
