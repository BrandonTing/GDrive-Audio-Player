import axiosInstance from '../api/axiosInstance';

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export const fetchFolderContents = async (
  parentId: string | null,
): Promise<GoogleDriveFile[]> => {
  try {
    const parentQuery = parentId
      ? `'${parentId}' in parents`
      : "'root' in parents";
    const response = await axiosInstance.get('/files', {
      params: {
        q: `${parentQuery} and trashed = false and (mimeType = 'application/vnd.google-apps.folder' or mimeType contains 'audio/')`,
        fields: 'files(id, name, mimeType)',
      },
    });
    return response.data.files;
  } catch (error) {
    console.error(
      `Error fetching contents for folder ${parentId || 'root'}:`,
      error,
    );
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
