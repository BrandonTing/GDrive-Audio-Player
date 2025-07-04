import type React from 'react';
import { useCallback, useEffect, useId } from 'react';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';

const AudioPlayer: React.FC = () => {
  const audioId = useId();
  const [state, send] = useAudioPlayerActor();
  const { playlistState, sendToPlaylist } = usePlaylist();

  const src =
    playlistState.context.currentTrackIndex !== null &&
      playlistState.context.tracks[playlistState.context.currentTrackIndex]
      ? playlistState.context.tracks[playlistState.context.currentTrackIndex].id
      : null;

  const setupAudioRef = useCallback(
    (node: HTMLAudioElement | null) => {
      if (node) {
        send({ type: 'SET_REF', audioRef: node });
      }
    },
    [send],
  );

  useEffect(() => {
    // Only send LOAD if src (fileId) has changed and is not null
    if (src && src !== state.context.fileId) {
      send({ type: 'LOAD', fileId: src });
    }
  }, [src, state.context.fileId, send]);

  useEffect(() => {
    const audio = state.context.audioRef;
    if (!audio) return;

    const handleEnded = () => {
      send({ type: 'ENDED' });
      sendToPlaylist({ type: 'PLAY_NEXT' });
    };
    const handleError = () =>
      send({ type: 'ERROR', message: 'Failed to play' });

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [send, state.context.audioRef, sendToPlaylist]);

  return (
    <div>
      <audio
        id={audioId}
        ref={setupAudioRef}
        src={state.context.blobUrl || undefined} // Use blobUrl for audio element src
        preload="auto"
        onLoadedData={() => send({ type: 'LOAD' })}
      >
        <track kind="captions" />
      </audio>
      <p>Status: {String(state.value)}</p>
      {state.matches('error') && (
        <p style={{ color: 'red' }}>Error: {state.context.error}</p>
      )}
      <div>
        {state.matches('playing') && (
          <button type="button" onClick={() => send({ type: 'PAUSE' })}>
            Pause
          </button>
        )}
        {(state.matches('idle') ||
          state.matches('error') ||
          (state.matches('paused') && state.context.blobUrl)) && (
            <button type="button" onClick={() => send({ type: 'PLAY' })}>
              Play
            </button>
          )}
        {state.matches('loading') && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default AudioPlayer;
