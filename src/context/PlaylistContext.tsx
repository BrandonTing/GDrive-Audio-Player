import { useMachine } from '@xstate/react';
import type React from 'react';
import { createContext, useContext } from 'react';
import playlistMachine from '../machines/playlistMachine';

interface PlaylistContextType {
  playlistState: ReturnType<typeof useMachine<typeof playlistMachine>>[0];
  sendToPlaylist: ReturnType<typeof useMachine<typeof playlistMachine>>[1];
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(
  undefined,
);

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playlistState, sendToPlaylist] = useMachine(playlistMachine);

  return (
    <PlaylistContext.Provider value={{ playlistState, sendToPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
