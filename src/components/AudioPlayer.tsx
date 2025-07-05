import type React from 'react';
import { useCallback, useEffect, useId } from 'react';
import { useAudioPlayerActor } from '../context/AudioPlayerActorContext';
import { usePlaylist } from '../context/PlaylistContext';

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const AudioPlayer: React.FC = () => {
  const audioId = useId();
  const seekBarId = useId();
  const volumeControlId = useId();
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
      {playlistState.context.currentTrackIndex !== null &&
        playlistState.context.tracks[playlistState.context.currentTrackIndex] && (
          <p className="mb-2 text-lg font-semibold">
            Now Playing: {playlistState.context.tracks[playlistState.context.currentTrackIndex].name}
          </p>
        )}
      <p className="mb-2 text-sm">Status: {String(state.value)}</p>
      {state.matches('error') && (
        <p className="mb-2 text-sm text-red-500">Error: {state.context.error}</p>
      )}
      <div className="flex flex-col items-center space-y-4 w-full max-w-lg">
        <div className="w-full">
          <label htmlFor="seek-bar" className="block text-sm font-medium text-gray-300">Seek:</label>
          <input
            id={seekBarId}
            type="range"
            min="0"
            max={state.context.duration}
            step="0.01"
            value={state.context.currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(state.context.currentTime)}</span>
            <span>{formatTime(state.context.duration)}</span>
          </div>
        </div>
        <div className="flex space-x-4">
          {state.matches('playing') && (
            <button
              type="button"
              onClick={() => send({ type: 'PAUSE' })}
              className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
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
                className="px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                Play
              </button>
            )}
          <button
            type="button"
            onClick={() => sendToPlaylist({ type: 'TOGGLE_SHUFFLE' })}
            className={`px-4 py-2 rounded-md ${playlistState.context.shuffle ? 'bg-gray-600' : 'bg-gray-800'
              } hover:bg-gray-700`}
          >
            Shuffle
          </button>
          <button
            type="button"
            onClick={() => sendToPlaylist({ type: 'TOGGLE_REPEAT' })}
            className="px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700"
          >
            Repeat: {playlistState.context.repeat}
          </button>
        </div>
        <div className="w-full">
          <label htmlFor="volume-control" className="block text-sm font-medium text-gray-300">Volume: {Math.round(state.context.volume * 100)}%</label>
          <input
            id={volumeControlId}
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={state.context.volume}
            onChange={handleVolumeChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        {state.matches('loading') && <p className="text-yellow-500">Loading...</p>}
      </div>
    </div>
  );
};

export default AudioPlayer;
