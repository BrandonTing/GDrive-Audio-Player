import type React from 'react';
import { usePlaylist } from '../context/PlaylistContext';

const Playlist: React.FC = () => {
  const { playlistState, sendToPlaylist } = usePlaylist();

  const { tracks, currentTrackIndex } = playlistState.context;

  const handleRemoveTrack = (trackId: string) => {
    sendToPlaylist({ type: 'REMOVE_TRACK', trackId });
  };

  const handlePlayTrack = (trackId: string) => {
    sendToPlaylist({ type: 'PLAY_TRACK', trackId });
    // TODO: Integrate with AudioPlayer to actually play the track
  };

  const handleClearPlaylist = () => {
    sendToPlaylist({ type: 'CLEAR_PLAYLIST' });
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
            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'PLAY_PREVIOUS' })}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'PLAY_NEXT' })}
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
          </div>
        </>
      )}
    </div>
  );
};

export default Playlist;
