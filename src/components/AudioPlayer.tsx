import type React from 'react';
import { useCallback, useEffect, useId, useState } from 'react';
import {
  FaPause,
  FaPlay,
  FaRandom,
  FaStepBackward,
  FaStepForward,
  FaVolumeDown,
  FaVolumeMute,
} from 'react-icons/fa';
import { LuRepeat, LuRepeat1 } from 'react-icons/lu';
import {
  useAudioPlayerActor,
  useAudioPlayerSelector,
} from '../context/AudioPlayerActorContext';
import {
  usePlaylistActor,
  usePlaylistSelector,
} from '../context/PlaylistContext';

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
  const state = useAudioPlayerSelector((state) => state);
  const send = actorRef.send;
  const playlistActorRef = usePlaylistActor();
  const playlistState = usePlaylistSelector((state) => state);
  const sendToPlaylist = playlistActorRef.send;

  const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false);

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

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    send({ type: 'SET_VOLUME', volume });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    send({ type: 'SEEK', time });
  };

  const currentTrackName =
    playlistState.context.currentTrackIndex !== null
      ? playlistState.context.tracks[playlistState.context.currentTrackIndex].name
      : 'No track selected';

  return (
    <div className="flex flex-col items-center p-2 text-white bg-gray-900 md:p-4">
      <audio
        id={audioId}
        ref={setupAudioRef}
        src={state.context.blobUrl || undefined}
        preload="auto"
        onEnded={() => {
          if (playlistState.context.repeat === 'one') {
            send({ type: 'REPLAY' });
          } else {
            send({ type: 'ENDED' });
            sendToPlaylist({ type: 'PLAY_NEXT' });
          }
        }}
        onError={() => send({ type: 'ERROR', message: 'Failed to play' })}
        onTimeUpdate={() =>
          send({
            type: 'UPDATE_TIME',
            time: state.context.audioRef?.currentTime,
          })
        }
        onLoadedData={() => send({ type: 'LOAD_AUDIO' })}
        onLoadedMetadata={() =>
          send({
            type: 'UPDATE_DURATION',
            duration: state.context.audioRef?.duration,
          })
        }
        autoPlay
      >
        <track kind="captions" />
      </audio>

      <div className="w-full max-w-4xl">
        <div className="mb-2 text-center md:hidden">
          <p className="font-semibold truncate">{currentTrackName}</p>
          <p className="text-sm text-gray-400">Status: {String(state.value)}</p>
        </div>
        <p className="hidden text-sm text-gray-400 md:block">Status: {String(state.value)}</p>

        <div className="mb-2 w-full">
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
          <div className="flex justify-between px-1 text-xs text-gray-400">
            <span>{formatTime(state.context.currentTime)}</span>
            <span>{formatTime(state.context.duration)}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="hidden items-center space-x-4 w-1/3 md:flex">
            <p className="font-semibold truncate">{currentTrackName}</p>
          </div>

          <div className="flex justify-center items-center space-x-4 w-full md:space-x-6 md:w-1/3">
            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'TOGGLE_SHUFFLE' })}
              className={`text-2xl ${playlistState.context.shuffle ? 'text-green-500' : 'text-white'}`}
              aria-label="Shuffle"
            >
              <FaRandom />
            </button>
            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'PLAY_PREVIOUS' })}
              className="text-3xl text-white"
              aria-label="Previous"
            >
              <FaStepBackward />
            </button>

            {state.matches('playing') ? (
              <button
                type="button"
                onClick={() => send({ type: 'PAUSE' })}
                className="p-2 text-2xl text-white rounded-full"
                aria-label="Pause"
              >
                <FaPause />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => send({ type: 'PLAY' })}
                className="p-2 text-2xl text-white rounded-full"
                aria-label="Play"
              >
                <FaPlay />
              </button>
            )}

            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'PLAY_NEXT' })}
              className="text-3xl text-white"
              aria-label="Next"
            >
              <FaStepForward />
            </button>
            <button
              type="button"
              onClick={() => sendToPlaylist({ type: 'TOGGLE_REPEAT' })}
              className="text-2xl text-white"
              aria-label="Repeat"
            >
              {playlistState.context.repeat === 'one' ? (
                <LuRepeat1 className="text-green-500" />
              ) : playlistState.context.repeat === 'all' ? (
                <LuRepeat className="text-green-500" />
              ) : (
                <LuRepeat />
              )}
            </button>
          </div>

          <div className="hidden justify-end items-center space-x-2 w-1/3 md:flex">
            <FaVolumeDown />
            <input
              id={volumeControlId}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.context.volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end w-1/3 md:hidden">
            <button
              type="button"
              onClick={() => setIsVolumeSliderVisible(!isVolumeSliderVisible)}
              className="text-2xl text-white"
              aria-label="Volume"
            >
              {state.context.volume > 0 ? <FaVolumeDown /> : <FaVolumeMute />}
            </button>
          </div>
        </div>

        {isVolumeSliderVisible && (
          <div className="mt-2 md:hidden">
            <input
              id={`${volumeControlId}-mobile`}
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.context.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}

        {state.matches('loading') && (
          <p className="mt-2 text-center text-yellow-500">Loading...</p>
        )}
        {state.matches('error') && (
          <p className="mt-2 text-center text-red-500">
            Error: {state.context.error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AudioPlayer;
