import axiosInstance from '../api/axiosInstance';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  // Add other properties as needed, e.g., thumbnailLink, webContentLink
}

export const fetchRootFolderContents = async (): Promise<GoogleDriveFile[]> => {
  try {
    const response = await axiosInstance.get('/files', {
      params: {
        q: "'root' in parents and trashed = false",
        fields: 'files(id, name, mimeType)',
        // You might want to filter for audio files here, or do it client-side
        // e.g., mimeType contains 'audio/'
      },
    });
    return response.data.files;
  } catch (error) {
    console.error('Error fetching root folder contents:', error);
    throw error;
  }
};
