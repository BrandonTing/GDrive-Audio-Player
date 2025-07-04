import { useLoaderData } from 'react-router-dom';
import type { GoogleDriveFile } from '../services/googleDriveService';

interface HomePageLoaderData {
  files: GoogleDriveFile[];
}

const HomePage = () => {
  const { files } = useLoaderData() as HomePageLoaderData;

  return (
    <div>
      <h1>Your Google Drive Files</h1>
      {files.length === 0 ? (
        <p>No files found in your root Google Drive folder.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              {file.name} ({file.mimeType})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HomePage;
