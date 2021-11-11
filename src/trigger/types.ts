import { PlayerID } from 'boardgame.io';

import { TriggerNames } from './store';

export interface TriggerStore {
  name: TriggerNames;
  key: string;
  owner: PlayerID;
  cardOwner: string;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;
}

export type TriggerOwner = PlayerID | 'Global';
export type TriggerPrepostion = 'Before' | 'After';

// TODO: dd & merge triggeroptions and triggerlifetime
export interface TriggerOptions {
  damage?: number;
}

export interface TriggerLifetime {
  /**
   * Can only trigger on this turn
   */
  usableTurn?: number;
  /**
   * Triggers once per turn
   */
  turn?: number;
}
