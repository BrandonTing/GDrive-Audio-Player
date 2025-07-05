import type React from 'react';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext'; // Import useAudioPlayerActor
import { usePlaylist } from '../context/PlaylistContext';

const Playlist: React.FC = () => {
  const { playlistState, sendToPlaylist } = usePlaylist();
  const actorRef = useAudioPlayerActor();
  const audioPlayerState = actorRef.getSnapshot();
  const sendToAudioPlayer = actorRef.send;

  const { tracks, currentTrackIndex } = playlistState.context;

  const handleRemoveTrack = (trackId: string) => {
    sendToPlaylist({ type: 'REMOVE_TRACK', trackId });
  };

  const handlePlayTrack = (trackId: string) => {
    sendToPlaylist({ type: 'PLAY_TRACK', trackId });
    sendToAudioPlayer({ type: 'PLAY' });
  };

  const handleClearPlaylist = () => {
    sendToPlaylist({ type: 'CLEAR_PLAYLIST' });
  };

  const handlePlayPauseAudioPlayer = () => {
    if (audioPlayerState.matches('playing')) {
      sendToAudioPlayer({ type: 'PAUSE' });
    } else {
      sendToAudioPlayer({ type: 'PLAY' });
    }
  };

  const handlePlayNext = () => {
    sendToPlaylist({ type: 'PLAY_NEXT' });
    sendToAudioPlayer({ type: 'PLAY' });
  };

  const handlePlayPrevious = () => {
    sendToPlaylist({ type: 'PLAY_PREVIOUS' });
    sendToAudioPlayer({ type: 'PLAY' });
  };

  return (
    <div className="p-4 text-white bg-gray-800 rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Playlist</h2>
      {tracks.length === 0 ? (
        <p className="text-gray-400">Playlist is empty.</p>
      ) : (
        <>
          <ul className="mb-4 space-y-2">
            {tracks.map((track, index) => (
              <li
                key={track.id}
                className={`flex items-center justify-between p-2 rounded-md ${
                  index === currentTrackIndex ? 'bg-blue-700 font-bold' : 'bg-gray-700'
                }`}
              >
                <span className="mr-2 truncate">{track.name}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePlayTrack(track.id)}
                    className="px-3 py-1 text-sm bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Play
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrack(track.id)}
                    className="px-3 py-1 text-sm bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={handlePlayPrevious}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={handlePlayNext}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Next
            </button>
            <button
              type="button"
              onClick={handleClearPlaylist}
              className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
            >
              Clear Playlist
            </button>
            {/* Add a global Play/Pause button for the current track */}
            {currentTrackIndex !== null && (
              <button
                type="button"
                onClick={handlePlayPauseAudioPlayer}
                className="px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700"
              >
                {audioPlayerState.matches('playing')
                  ? 'Pause Current'
                  : 'Play Current'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
