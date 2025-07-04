import { useMachine } from '@xstate/react';
import type React from 'react';
import { useEffect, useId, useRef } from 'react';
import { assign, createMachine, fromPromise } from 'xstate'; // Changed fromCallback to fromPromise
import { getAudioFileBlobUrl } from '../services/googleDriveService';

// Define the machine's context (state)
interface AudioPlayerContext {
  blobUrl: string | null; // Stores the Blob URL for the audio element
  error: string | null;
  fileId: string | null; // Stores the current fileId being processed
}

const audioPlayerMachine = createMachine({
  id: 'audioPlayer',
  context: {
    blobUrl: null,
    error: null as string | null,
    fileId: null,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        LOAD: {
          target: 'loading',
          actions: assign({ fileId: ({ event }) => event.fileId, error: null, blobUrl: null }),
        },
      },
    },
    loading: {
      invoke: {
        id: 'loadAudio',
        src: fromPromise(({ input }) => getAudioFileBlobUrl(input.fileId)), // Use fromPromise, directly call async function
        onDone: {
          target: 'playing',
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
},
  {
    actions: {
      playAudio: ({ context }) => {
        const audio = document.getElementById('audio-element') as HTMLAudioElement;
        if (audio && audio.src === context.blobUrl) {
          audio.play().catch(e => console.error("Error playing audio:", e));
        } else if (audio && context.blobUrl) {
          audio.src = context.blobUrl;
          audio.play().catch(e => console.error("Error playing audio:", e));
        }
      },
      pauseAudio: () => {
        const audio = document.getElementById('audio-element') as HTMLAudioElement;
        if (audio) {
          audio.pause();
        }
      },
    },
  },
);

interface AudioPlayerProps {
  src: string | null; // Now represents fileId
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioId = useId();
  const [state, send] = useMachine(audioPlayerMachine, {
    input: { audioRef: audioRef.current }, // audioRef is now passed to the machine via context.audioRef
  });

  // Update machine context with audioRef when it's available
  useEffect(() => {
    if (audioRef.current) {
      send({ type: 'SET_REF', audioRef: audioRef.current });
    }
  }, [send]);

  useEffect(() => {
    // Only send LOAD if src (fileId) has changed and is not null
    if (src && src !== state.context.fileId) {
      send({ type: 'LOAD', fileId: src });
    }
  }, [src, state.context.fileId, send]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => send({ type: 'ENDED' });
    const handleError = () => send({ type: 'ERROR', message: 'Audio playback error.' });

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [send]);

  return (
    <div>
      <audio
        id={audioId}
        ref={audioRef}
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
        {state.matches('playing') && (
          <button type="button" onClick={() => send({ type: 'PAUSE' })}>
            Pause
          </button>
        )}
        {state.matches('paused') && (
          <button type="button" onClick={() => send({ type: 'PLAY' })}>
            Play
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
