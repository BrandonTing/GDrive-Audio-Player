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
        fields: 'files(id, name, mimeType)', // No webContentLink here
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
    const response = await gapi.client.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    console.log(response);
    // gapi.client.drive.files.get with alt='media' returns the file content directly
    // The response.body will be the raw audio data
    const blob = new Blob([response.body], { type: response.headers['Content-Type'] });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error fetching audio file as blob:', error);
    throw error;
  }
};
