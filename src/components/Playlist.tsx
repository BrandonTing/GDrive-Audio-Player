import type React from 'react';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext'; // Import useAudioPlayerActor
import { usePlaylist } from '../context/PlaylistContext';

const Playlist: React.FC = () => {
  const { playlistState, sendToPlaylist } = usePlaylist();
  const [audioPlayerState, sendToAudioPlayer] = useAudioPlayerActor(); // Get actor state and send

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
    <div
      style={{ border: '1px solid #ccc', padding: '10px', marginTop: '20px' }}
    >
      <h2>Playlist</h2>
      {tracks.length === 0 ? (
        <p>Playlist is empty.</p>
      ) : (
        <>
          <ul>
            {tracks.map((track, index) => (
              <li
                key={track.id}
                style={{
                  fontWeight: index === currentTrackIndex ? 'bold' : 'normal',
                }}
              >
                {track.name}
                <button
                  type="button"
                  onClick={() => handlePlayTrack(track.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Play
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveTrack(track.id)}
                  style={{ marginLeft: '5px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div>
            <button type="button" onClick={handlePlayPrevious}>
              Previous
            </button>
            <button
              type="button"
              onClick={handlePlayNext}
              style={{ marginLeft: '10px' }}
            >
              Next
            </button>
            <button
              type="button"
              onClick={handleClearPlaylist}
              style={{ marginLeft: '10px' }}
            >
              Clear Playlist
            </button>
            {/* Add a global Play/Pause button for the current track */}
            {currentTrackIndex !== null && (
              <button
                type="button"
                onClick={handlePlayPauseAudioPlayer}
                style={{ marginLeft: '10px' }}
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
