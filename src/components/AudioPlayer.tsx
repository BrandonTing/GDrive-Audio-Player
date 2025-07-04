import type React from 'react';
import { useCallback, useEffect, useId } from 'react';
import toast from 'react-hot-toast';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';

const AudioPlayer: React.FC = () => {
  const audioId = useId();
  const [state, send] = useAudioPlayerActor();
  const { playlistState, sendToPlaylist } = usePlaylist();

  const currentTrack =
    playlistState.context.currentTrackIndex !== null
      ? playlistState.context.tracks[playlistState.context.currentTrackIndex]
      : null;

  const src = currentTrack ? currentTrack.id : null;

  useEffect(() => {
    if (currentTrack) {
      toast.success(`Now Playing: ${currentTrack.name}`);
    }
  }, [currentTrack]);

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
    const handleTimeUpdate = () => {
      send({ type: 'UPDATE_TIME', time: audio.currentTime });
    };
    const handleLoadedData = () => {
        send({ type: 'LOAD' });
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);


    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);

    };
  }, [send, state.context.audioRef, sendToPlaylist]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    send({ type: 'SET_VOLUME', volume });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    send({ type: 'SEEK', time });
  };

  return (
    <div>
      <audio
        id={audioId}
        ref={setupAudioRef}
        src={state.context.blobUrl || undefined} // Use blobUrl for audio element src
        preload="auto"
      >
        <track kind="captions" />
      </audio>
      <p>Status: {String(state.value)}</p>
      {state.matches('error') && (
        <p style={{ color: 'red' }}>Error: {state.context.error}</p>
      )}
      <div>
        <input
          type="range"
          min="0"
          max={state.context.duration}
          step="0.01"
          value={state.context.currentTime}
          onChange={handleSeek}
        />
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
        <button
          type="button"
          onClick={() => sendToPlaylist({ type: 'TOGGLE_SHUFFLE' })}
          style={{
            color: playlistState.context.shuffle ? 'green' : 'black',
          }}
        >
          Shuffle
        </button>
        <button
          type="button"
          onClick={() => sendToPlaylist({ type: 'TOGGLE_REPEAT' })}
        >
          Repeat: {playlistState.context.repeat}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.context.volume}
          onChange={handleVolumeChange}
        />
        {state.matches('loading') && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default AudioPlayer;
