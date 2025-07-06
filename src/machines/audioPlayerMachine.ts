import { assign, createMachine, fromPromise } from 'xstate';
import { getAudioFileBlobUrl } from '../services/googleDriveService';

export const audioPlayerMachine = createMachine(
  {
    id: 'audioPlayer',
    context: {
      blobUrl: null,
      error: null as string | null,
      fileId: null,
      audioRef: null as HTMLAudioElement | null,
      volume: 1,
      duration: 0,
      currentTime: 0,
    },
    initial: 'idle',
    states: {
      idle: {},
      loading: {
        invoke: {
          id: 'loadAudio',
          src: fromPromise<string, { fileId: string }>(({ input }) =>
            getAudioFileBlobUrl(input.fileId),
          ),
          onDone: {
            target: 'loadingAudio',
            actions: assign({ blobUrl: ({ event }) => event.output }),
          },
          onError: {
            target: 'error',
            actions: assign({
              error: ({ event }) => (event.error as Error).message,
            }),
          },
          input: ({ context }) => ({ fileId: context.fileId }),
        },
      },
      loadingAudio: {
        on: {
          LOAD_AUDIO: {
            target: 'playing',
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
          SET_VOLUME: {
            actions: 'setVolume',
          },
          UPDATE_TIME: {
            actions: 'updateTime',
          },
          SEEK: {
            actions: 'seek',
          },
        },
      },
      paused: {
        entry: 'pauseAudio',
        on: {
          PLAY: 'playing',
          LOAD: {
            target: 'loading',
            actions: assign({
              fileId: ({ event }) => event.fileId,
              error: null,
              blobUrl: null,
            }),
          },
        },
      },
      error: {
        on: {
          LOAD: {
            target: 'loading',
            actions: assign({
              fileId: ({ event }) => event.fileId,
              error: null,
              blobUrl: null,
            }),
          },
        },
      },
    },
    on: {
      LOAD: {
        target: '.loading',
        actions: assign({
          fileId: ({ event }) => event.fileId,
          error: null,
          blobUrl: null,
        }),
      },
      SET_REF: {
        actions: assign({ audioRef: ({ event }) => event.audioRef }),
      },
      UPDATE_DURATION: {
        actions: assign({ duration: ({ event }) => event.duration }),
      },
    },
  },
  {
    actions: {
      playAudio: ({ context }) => {
        const audio = context.audioRef;
        if (audio) {
          // Ensure src is set before playing if it's not already
          if (audio.src !== context.blobUrl) {
            audio.src = context.blobUrl || '';
            audio.load(); // Load the new source
          }
          audio.volume = context.volume;
          audio.play().catch((e) => console.error('Error playing audio:', e));
        }
      },
      pauseAudio: ({ context }) => {
        const audio = context.audioRef;
        if (audio) {
          audio.pause();
        }
      },
      setVolume: assign({
        volume: ({ event, context }) => {
          if (event.type === 'SET_VOLUME') {
            if (context.audioRef) {
              context.audioRef.volume = event.volume;
            }
            return event.volume;
          }
          return context.volume;
        },
      }),
      updateTime: assign({
        currentTime: ({ event }) => {
          if (event.type === 'UPDATE_TIME') {
            return event.time;
          }
          return 0;
        },
      }),
      seek: ({ context, event }) => {
        if (event.type === 'SEEK' && context.audioRef) {
          context.audioRef.currentTime = event.time;
        }
      },
    },
  },
);
