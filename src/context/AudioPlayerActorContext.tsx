import { createActorContext } from '@xstate/react';
import { audioPlayerMachine } from '../machines/audioPlayerMachine';

export const AudioPlayerActorContext = createActorContext(audioPlayerMachine);

export const AudioPlayerActorProvider = AudioPlayerActorContext.Provider;
export const useAudioPlayerActor = AudioPlayerActorContext.useActorRef;
export const useAudioPlayerSelector = AudioPlayerActorContext.useSelector;
