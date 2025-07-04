import axiosInstance from '../api/axiosInstance';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export const fetchRootFolderContents = async (): Promise<GoogleDriveFile[]> => {
  try {
    const response = await axiosInstance.get('/files', {
      params: {
        q: "'root' in parents and trashed = false and mimeType contains 'audio/'",
        fields: 'files(id, name, mimeType)',
      },
    });
    return response.data.files;
  } catch (error) {
    console.error('Error fetching root folder contents:', error);
    throw error;
  }
};

export const getAudioFileBlobUrl = async (fileId: string): Promise<string> => {
  try {
    const response = await axiosInstance.get(`/files/${fileId}`, {
      params: {
        alt: 'media',
      },
      responseType: 'arraybuffer', // Crucial for binary data
    });

    const contentType = response.headers['content-type'];
    const blob = new Blob([response.data], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching audio file as blob:', error);
    throw error;
  }
};
