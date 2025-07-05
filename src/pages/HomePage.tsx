import { useLoaderData, useNavigate, useParams, useNavigation } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import Playlist from '../components/Playlist';
import {
  AudioPlayerActorProvider
} from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';
import type { GoogleDriveFile } from '../services/googleDriveService';
import toast from 'react-hot-toast';

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
    toast.success(`${file.name} added to playlist!`);
  };

  if (navigation.state === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        {/* File Browser Section */}
        <div className="flex-1 p-5 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-4">
            {folderId ? 'Folder Contents' : 'Your Google Drive Files'}
          </h1>

          {folderId && (
            <button
              type="button"
              onClick={handleBackClick}
              className="mb-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
            >
              Back to Parent Folder
            </button>
          )}

          <h2 className="text-2xl font-semibold mb-3">Folders</h2>
          {folders.length === 0 ? (
            <p className="text-gray-400">No subfolders found.</p>
          ) : (
            <ul className="space-y-2">
              {folders.map((folder) => (
                <li key={folder.id}>
                  <button
                    type="button"
                    onClick={() => handleFolderClick(folder)}
                    className="text-blue-400 hover:text-blue-300 text-lg"
                  >
                    📁 {folder.name}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <h2 className="text-2xl font-semibold mt-6 mb-3">Audio Files</h2>
          {audioFiles.length === 0 ? (
            <p className="text-gray-400">No audio files found in this folder.</p>
          ) : (
            <ul className="space-y-2">
              {audioFiles.map((file) => (
                <li key={file.id} className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleFileClick(file)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm"
                  >
                    ▶️ Play
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddToPlaylist(file)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm"
                  >
                    ➕ Add to Playlist
                  </button>
                  <span className="text-lg">{file.name}</span>
                  <span className="text-gray-500 text-sm">({file.mimeType})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Playlist Section */}
        <div className="w-80 p-5 border-l border-gray-700 overflow-y-auto bg-gray-800">
          <AudioPlayerActorProvider>
            <Playlist />
          </AudioPlayerActorProvider>
        </div>
      </div>

      {/* Audio Player Section (Fixed at bottom) */}
      <div className="border-t border-gray-700 bg-gray-900 p-4">
        <AudioPlayerActorProvider>
          <AudioPlayer />
        </AudioPlayerActorProvider>
      </div>
    </div>
  );
};

export default HomePage;
