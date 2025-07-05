import type React from 'react';
import { useCallback, useEffect, useId } from 'react';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';

const AudioPlayer: React.FC = () => {
  const audioId = useId();
  const actorRef = useAudioPlayerActor();
  const state = actorRef.getSnapshot();
  const send = actorRef.send;
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
    <div className="flex flex-col items-center p-4 text-white bg-gray-900">
      <audio
        id={audioId}
        ref={setupAudioRef}
        src={state.context.blobUrl || undefined} // Use blobUrl for audio element src
        preload="auto"
      >
        <track kind="captions" />
      </audio>
      <p className="mb-2 text-sm">Status: {String(state.value)}</p>
      {state.matches('error') && (
        <p className="mb-2 text-sm text-red-500">Error: {state.context.error}</p>
      )}
      <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
        <input
          type="range"
          min="0"
          max={state.context.duration}
          step="0.01"
          value={state.context.currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex space-x-4">
          {state.matches('playing') && (
            <button
              type="button"
              onClick={() => send({ type: 'PAUSE' })}
              className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Pause
            </button>
          )}
          {(state.matches('idle') ||
            state.matches('error') ||
            (state.matches('paused') && state.context.blobUrl)) && (
              <button
                type="button"
                onClick={() => send({ type: 'PLAY' })}
                className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Play
              </button>
            )}
          <button
            type="button"
            onClick={() => sendToPlaylist({ type: 'TOGGLE_SHUFFLE' })}
            className={`px-4 py-2 rounded-md ${playlistState.context.shuffle ? 'bg-green-600' : 'bg-gray-600'
              } hover:bg-green-700`}
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => sendToPlaylist({ type: 'TOGGLE_REPEAT' })}
            className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-700"
          >
            Repeat: {playlistState.context.repeat}
          </button>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.context.volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
        {state.matches('loading') && <p className="text-yellow-500">Loading...</p>}
      </div>
    </div>
  );
};

export default AudioPlayer;
