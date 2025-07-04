import { assign, createMachine } from 'xstate';
import { GoogleDriveFile } from '../services/googleDriveService';

interface PlaylistContext {
  tracks: GoogleDriveFile[];
  currentTrackIndex: number | null;
}

type PlaylistEvent =
  | { type: 'ADD_TRACK'; track: GoogleDriveFile }
  | { type: 'REMOVE_TRACK'; trackId: string }
  | { type: 'PLAY_TRACK'; trackId: string }
  | { type: 'PLAY_NEXT' }
  | { type: 'PLAY_PREVIOUS' }
  | { type: 'CLEAR_PLAYLIST' };

const playlistMachine = createMachine<PlaylistContext, PlaylistEvent>(
  {
    id: 'playlist',
    initial: 'active',
    context: {
      tracks: [],
      currentTrackIndex: null,
    },
    states: {
      active: {
        on: {
          ADD_TRACK: {
            actions: assign({
              tracks: ({ context, event }) => {
                if (!context.tracks.some(t => t.id === event.track.id)) {
                  return [...context.tracks, event.track];
                }
                return context.tracks;
              },
            }),
          },
          REMOVE_TRACK: {
            actions: assign({
              tracks: ({ context, event }) =>
                context.tracks.filter((track) => track.id !== event.trackId),
              currentTrackIndex: ({ context, event }) => {
                // Adjust currentTrackIndex if the removed track was the current one
                if (context.currentTrackIndex !== null && context.tracks[context.currentTrackIndex]?.id === event.trackId) {
                  return null; // Or logic to select next/previous
                }
                return context.currentTrackIndex;
              },
            }),
          },
          PLAY_TRACK: {
            actions: assign({
              currentTrackIndex: ({ context, event }) => {
                const index = context.tracks.findIndex((t) => t.id === event.trackId);
                return index !== -1 ? index : null;
              },
            }),
          },
          PLAY_NEXT: {
            actions: assign({
              currentTrackIndex: ({ context }) => {
                if (context.currentTrackIndex === null) return 0; // Start from beginning
                return (context.currentTrackIndex + 1) % context.tracks.length;
              },
            }),
          },
          PLAY_PREVIOUS: {
            actions: assign({
              currentTrackIndex: ({ context }) => {
                if (context.currentTrackIndex === null) return 0; // Start from beginning
                const newIndex = context.currentTrackIndex - 1;
                return newIndex < 0 ? context.tracks.length - 1 : newIndex;
              },
            }),
          },
          CLEAR_PLAYLIST: {
            actions: assign({
              tracks: [],
              currentTrackIndex: null,
            }),
          },
        },
      },
    },
  },
);

export default playlistMachine;
