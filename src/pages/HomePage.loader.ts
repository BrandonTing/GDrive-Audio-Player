import type { LoaderFunctionArgs } from 'react-router-dom';
import { fetchFolderContents } from '../services/googleDriveService';

export async function homePageLoader({ params }: LoaderFunctionArgs) {
  console.log(params)
  const folderId = params.folderId as string | undefined;
  try {
    const files = await fetchFolderContents(folderId || null);
    return { files };
  } catch (error) {
    console.error('Error in HomePage loader:', error);
    throw error; // Re-throw to let React Router handle it
  }
}
