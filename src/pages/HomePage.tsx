import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import AudioPlayer from '../components/AudioPlayer';
import type { GoogleDriveFile } from '../services/googleDriveService';

interface HomePageLoaderData {
  files: GoogleDriveFile[];
}

const HomePage = () => {
  const { files } = useLoaderData() as HomePageLoaderData;
  const [currentAudioFileId, setCurrentAudioFileId] = useState<string | null>(null);

  const handleFileClick = (file: GoogleDriveFile) => {
    setCurrentAudioFileId(file.id);
  };

  return (
    <div>
      <h1>Your Google Drive Files</h1>
      {files.length === 0 ? (
        <p>No audio files found in your root Google Drive folder.</p>
      ) : (
        <ul>
          {files.map((file) => (
            <li key={file.id}>
              <button type="button" onClick={() => handleFileClick(file)}>
                Play
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
