import { createActorContext } from '@xstate/react';
import playlistMachine from '../machines/playlistMachine';

export const PlaylistActorContext = createActorContext(playlistMachine);

export const PlaylistProvider = PlaylistActorContext.Provider;
export const usePlaylistActor = PlaylistActorContext.useActorRef;
export const usePlaylistSelector = PlaylistActorContext.useSelector;