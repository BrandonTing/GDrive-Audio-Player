import { assign, createMachine, fromPromise } from 'xstate';
import { getAudioFileBlobUrl } from '../services/googleDriveService';

// Define the machine's context (state)
interface AudioPlayerContext {
  blobUrl: string | null; // Stores the Blob URL for the audio element
  error: string | null;
  fileId: string | null; // Stores the current fileId being processed
  audioRef: HTMLAudioElement | null; // Reference to the audio DOM element
}

// Define the machine's events
type AudioPlayerEvent =
  | { type: 'LOAD'; fileId: string }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'ENDED' }
  | { type: 'ERROR'; message: string }
  | { type: 'SET_REF'; audioRef: HTMLAudioElement | null };

// Define the machine's input (for invoked actors and actions)
interface AudioPlayerMachineInput {
  audioRef: React.RefObject<HTMLAudioElement>;
}

export const audioPlayerMachine = createMachine({
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
        src: fromPromise(({ context }) => getAudioFileBlobUrl(context.fileId!)),
        onDone: {
          target: 'playing',
          actions: assign({ blobUrl: ({ event }) => event.output }),
        },
        onError: {
          target: 'error',
          actions: assign({ error: ({ event }) => (event.error as Error).message }),
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
  {
    actions: {
      playAudio: ({ context, input }) => {
        const audio = context.audioRef;
        if (audio) {
          // Ensure src is set before playing if it's not already
          if (audio.src !== context.blobUrl) {
            audio.src = context.blobUrl || '';
            audio.load(); // Load the new source
          }
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
