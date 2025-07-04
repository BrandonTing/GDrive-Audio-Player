import { useMachine } from '@xstate/react';
import type React from 'react';
import { useCallback, useEffect, useId } from 'react';
import { assign, createMachine, fromPromise } from 'xstate';
import { getAudioFileBlobUrl } from '../services/googleDriveService';

const audioPlayerMachine = createMachine(
  {
    id: 'audioPlayer',
    context: {
      blobUrl: null,
      error: null as string | null,
      fileId: null,
      audioRef: null as HTMLAudioElement | null,
    },
    initial: 'idle',
    states: {
      idle: {
      },
      loading: {
        invoke: {
          id: 'loadAudio',
          src: fromPromise(({ input }) => getAudioFileBlobUrl(input.fileId)), // Use fromPromise, directly call async function
          onDone: {
            target: 'loadingBlob',
            actions: assign({ blobUrl: ({ event }) => event.output }), // Output of promise is the blobUrl
          },
          onError: {
            target: 'error',
            actions: assign({ error: ({ event }) => (event.error as Error).message }), // Error from promise
          },
          input: ({ context }) => {
            return { fileId: context.fileId };
          },
        },
      },
      loadingBlob: {
        on: {
          LOAD: {
            target: 'playing',
          }
        }
      },
      playing: {
        entry: 'playAudio',
        on: {
          PAUSE: 'paused',
          ENDED: 'idle',
          ERROR: {
            target: 'error',
            actions: assign({ error: ({ event }) => event.message }),
          },
        },
      },
      paused: {
        entry: 'pauseAudio',
        on: {
          PLAY: 'playing',
          LOAD: {
            target: 'loading',
            actions: assign({ fileId: ({ event }) => event.fileId, error: null, blobUrl: null }),
          },
        },
      },
      error: {
        on: {
          LOAD: {
            target: 'loading',
            actions: assign({ fileId: ({ event }) => event.fileId, error: null, blobUrl: null }),
          },
        },
      },
    },
    on: {
      SET_REF: {
        actions: assign({ audioRef: ({ event }) => event.audioRef }),
      },
      LOAD: {
        target: '.loading',
        actions: assign({ fileId: ({ event }) => event.fileId, error: null, blobUrl: null }),
      },
    }
  },
  {
    actions: {
      playAudio: ({ context }) => {
        const audio = context.audioRef;
        if (audio && audio.src === context.blobUrl) {
          audio.play().catch(e => console.error("Error playing audio:", e));
        } else if (audio && context.blobUrl) {
          audio.src = context.blobUrl;
          audio.play().catch(e => console.error("Error playing audio:", e));
        }
      },
      pauseAudio: ({ context }) => {
        const audio = context.audioRef;
        if (audio) {
          audio.pause();
        }
      },
    },
  },
);

interface AudioPlayerProps {
  src: string | null; // Now represents fileId
  onEnded?: () => void; // New prop for when audio ends
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, onEnded }) => {
  const audioId = useId();
  const [state, send] = useMachine(audioPlayerMachine);

  const setupAudioRef = useCallback((node: HTMLAudioElement | null) => {
    send({ type: 'SET_REF', audioRef: node });
  }, [send]);


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
      onEnded?.(); // Call the onEnded prop
    };
    const handleError = () => send({ type: 'ERROR', message: "Failed to play" });

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [send, state.context.audioRef, onEnded]);

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
