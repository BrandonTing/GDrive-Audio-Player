import { useLoaderData, useNavigate, useParams, useNavigation } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import Playlist from '../components/Playlist';
import {
  AudioPlayerActorProvider
} from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';
import type { GoogleDriveFile } from '../services/googleDriveService';

interface HomePageLoaderData {
  files: GoogleDriveFile[];
}

const HomePage = () => {
  const { files } = useLoaderData() as HomePageLoaderData;
  const { folderId } = useParams<{ folderId?: string }>();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const { sendToPlaylist } = usePlaylist();

  const folders = files.filter(
    (file) => file.mimeType === 'application/vnd.google-apps.folder',
  );
  const audioFiles = files.filter((file) => file.mimeType.startsWith('audio/'));

  const handleFileClick = (file: GoogleDriveFile) => {
    sendToPlaylist({ type: 'PLAY_TRACK', trackId: file.id });
  };

  const handleFolderClick = (folder: GoogleDriveFile) => {
    navigate(`/folder/${folder.id}`);
  };

  const handleBackClick = () => {
    if (folderId) {
      navigate('/');
    }
  };

  const handleAddToPlaylist = (file: GoogleDriveFile) => {
    sendToPlaylist({ type: 'ADD_TRACK', track: file });
    alert(`${file.name} added to playlist!`);
  };

  if (navigation.state === "loading") {
    return <div>Loading...</div>;
  }

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
              <button
                type="button"
                onClick={() => handleAddToPlaylist(file)}
                style={{ marginLeft: '10px' }}
              >
                ➕ Add to Playlist
              </button>
              {file.name} ({file.mimeType})
            </li>
          ))}
        </ul>
      )}
      <hr />
      <AudioPlayerActorProvider>
        <AudioPlayer />
        <Playlist />
      </AudioPlayerActorProvider>
    </div>
  );
};

export default HomePage;
