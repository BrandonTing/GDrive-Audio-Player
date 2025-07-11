import toast from 'react-hot-toast';
import { assign, setup } from 'xstate';
import type { GoogleDriveFile } from '../services/googleDriveService';

const shuffleArray = (array: GoogleDriveFile[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

interface PlaylistContext {
  tracks: GoogleDriveFile[];
  shuffledTracks: GoogleDriveFile[];
  currentTrackIndex: number | null;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
}

type PlaylistEvent =
  | { type: 'ADD_TRACK'; track: GoogleDriveFile }
  | { type: 'REMOVE_TRACK'; trackId: string }
  | { type: 'PLAY_TRACK'; trackId: string }
  | { type: 'PLAY_NEXT' }
  | { type: 'PLAY_PREVIOUS' }
  | { type: 'CLEAR_PLAYLIST' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'TOGGLE_REPEAT' };

const playlistMachine = setup({
  types: {
    context: {} as PlaylistContext,
    events: {} as PlaylistEvent,
  },
}).createMachine({
  id: 'playlist',
  initial: 'active',
  context: () => {
    try {
      const persistedState = localStorage.getItem('audioPlayerPlaylist');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        return {
          tracks: parsedState.tracks || [],
          shuffledTracks: parsedState.shuffledTracks || [],
          currentTrackIndex:
            parsedState.currentTrackIndex !== undefined
              ? parsedState.currentTrackIndex
              : null,
          shuffle: parsedState.shuffle || false,
          repeat: parsedState.repeat || 'none',
        };
      }
    } catch (error) {
      console.error('Failed to load playlist from localStorage:', error);
    }
    return {
      tracks: [],
      shuffledTracks: [],
      currentTrackIndex: null,
      shuffle: false,
      repeat: 'none',
    };
  },
  states: {
    active: {
      on: {
        ADD_TRACK: {
          actions: assign(({ context, event }) => {
            if (!context.tracks.some((t) => t.id === event.track.id)) {
              const newTracks = [...context.tracks, event.track];
              if (context.shuffle) {
                // If shuffle is on, add to shuffled list as well
                // and re-shuffle
                return {
                  ...context,
                  tracks: newTracks,
                  shuffledTracks: shuffleArray(newTracks),
                };
              }
              return {
                ...context,
                tracks: newTracks,
                shuffledTracks: shuffleArray(newTracks),
              };
            }
            return context;
          }),
        },
        REMOVE_TRACK: {
          actions: assign({
            tracks: ({ context, event }) =>
              context.tracks.filter((track) => track.id !== event.trackId),
            shuffledTracks: ({ context, event }) =>
              context.shuffledTracks.filter(
                (track) => track.id !== event.trackId,
              ),
            currentTrackIndex: ({ context, event }) => {
              if (
                context.currentTrackIndex !== null &&
                context.tracks[context.currentTrackIndex]?.id === event.trackId
              ) {
                return null;
              }
              return context.currentTrackIndex;
            },
          }),
        },
        PLAY_TRACK: {
          actions: assign({
            currentTrackIndex: ({ context, event }) => {
              const currentTracks = context.shuffle
                ? context.shuffledTracks
                : context.tracks;
              const index = currentTracks.findIndex(
                (t) => t.id === event.trackId,
              );
              if (index !== -1) {
                toast.success(`Now Playing: ${currentTracks[index].name}`);
              }
              return index !== -1 ? index : null;
            },
          }),
        },
        PLAY_NEXT: {
          actions: assign({
            currentTrackIndex: ({ context }) => {
              if (context.repeat === 'one') {
                return context.currentTrackIndex;
              }

              const currentTracks = context.shuffle
                ? context.shuffledTracks
                : context.tracks;
              if (context.currentTrackIndex === null) return 0;

              const nextIndex = context.currentTrackIndex + 1;
              if (nextIndex >= currentTracks.length) {
                if (context.repeat === 'all') {
                  toast.success(`Now Playing: ${currentTracks[0].name}`);
                  return 0;
                }
                return null;
              }
              toast.success(`Now Playing: ${currentTracks[nextIndex].name}`);
              return nextIndex;
            },
          }),
        },
        PLAY_PREVIOUS: {
          actions: assign({
            currentTrackIndex: ({ context }) => {
              const currentTracks = context.shuffle
                ? context.shuffledTracks
                : context.tracks;
              if (context.currentTrackIndex === null) return 0;
              const newIndex = context.currentTrackIndex - 1;
              const newSafeIndex =
                newIndex < 0 ? currentTracks.length - 1 : newIndex;
              toast.success(`Now Playing: ${currentTracks[newSafeIndex].name}`);
              return newSafeIndex;
            },
          }),
        },
        CLEAR_PLAYLIST: {
          actions: assign({
            tracks: [],
            shuffledTracks: [],
            currentTrackIndex: null,
          }),
        },
        TOGGLE_SHUFFLE: {
          actions: assign({
            shuffle: ({ context }) => !context.shuffle,
            shuffledTracks: ({ context }) => {
              if (!context.shuffle) {
                return shuffleArray(context.tracks);
              }
              return []; // Or keep original order if you want to toggle back
            },
          }),
        },
        TOGGLE_REPEAT: {
          actions: assign({
            repeat: ({ context }) => {
              if (context.repeat === 'none') return 'all';
              if (context.repeat === 'all') return 'one';
              return 'none';
            },
          }),
        },
      },
    },
  },
});

export default playlistMachine;
