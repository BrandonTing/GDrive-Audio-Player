import { fetchRootFolderContents } from '../services/googleDriveService';

export async function homePageLoader() {
  try {
    const files = await fetchRootFolderContents();
    return { files };
  } catch (error) {
    console.error('Error in HomePage loader:', error);
    // You might want to throw a Response here for errorElement handling
    throw error; // Re-throw to let React Router handle it
  }
}
