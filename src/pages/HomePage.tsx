import { useState } from 'react';
import { useLoaderData, useNavigate, useParams } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import type { GoogleDriveFile } from '../services/googleDriveService';

interface HomePageLoaderData {
  files: GoogleDriveFile[];
}

const HomePage = () => {
  const { files } = useLoaderData() as HomePageLoaderData;
  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();
  const [currentAudioFileId, setCurrentAudioFileId] = useState<string | null>(
    null,
  );

  const folders = files.filter(
    (file) => file.mimeType === 'application/vnd.google-apps.folder',
  );
  const audioFiles = files.filter((file) => file.mimeType.startsWith('audio/'));

  const handleFileClick = (file: GoogleDriveFile) => {
    setCurrentAudioFileId(file.id);
  };

  const handleFolderClick = (folder: GoogleDriveFile) => {
    navigate(`/folder/${folder.id}`);
  };

  const handleBackClick = () => {
    // Navigate up one level. This is a simplified approach.
    // A more robust solution would involve tracking the full path.
    if (folderId) {
      // For now, assume we go back to root if not in root
      // A better solution would parse the current path to find the parent folder ID
      navigate('/');
    }
  };

  return (
    <div>
      <h1>{folderId ? 'Folder Contents' : 'Your Google Drive Files'}</h1>

      {folderId && (
        <button
          type="button"
          onClick={handleBackClick}
          style={{ marginBottom: '10px' }}
        >
          Back to Parent Folder
        </button>
      )}

      <h2>Folders</h2>
      {folders.length === 0 ? (
        <p>No subfolders found.</p>
      ) : (
        <ul>
          {folders.map((folder) => (
            <li key={folder.id}>
              <button type="button" onClick={() => handleFolderClick(folder)}>
                📁 {folder.name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2>Audio Files</h2>
      {audioFiles.length === 0 ? (
        <p>No audio files found in this folder.</p>
      ) : (
        <ul>
          {audioFiles.map((file) => (
            <li key={file.id}>
              <button type="button" onClick={() => handleFileClick(file)}>
                ▶️ Play
              </button>
              {file.name} ({file.mimeType})
            </li>
          ))}
        </ul>
      )}
      <hr />
      <AudioPlayer src={currentAudioFileId} />
    </div>
  );
};

export default HomePage;
