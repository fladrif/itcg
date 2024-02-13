import { PlayerID } from 'boardgame.io';

import { TriggerNames } from './store';

import { Decision } from '../stack';
import { Action } from '../actions';

export interface TriggerStore {
  name: TriggerNames;
  key: string;
  owner: PlayerID;
  cardOwner: string;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;
}

export type TriggerPreposition = 'Before' | 'After';
export type TriggerOwner = PlayerID | 'Global';
export type TriggerSubject = (Action | TurnPhase)[];
export type TriggerContext = Decision | TurnPhase;
export type TurnPhase = 'Level' | 'Activate' | 'Attack';

// TODO: dd & merge triggeroptions and triggerlifetime
export interface TriggerOptions {
  damage?: number;
  lifegain?: number;
}

export interface TriggerLifetime {
  /**
   * Can only trigger on this turn
   */
  usableTurn?: number;
  /**
   * Only triggers once on usable turn
   */
  once?: boolean;
  /**
   * Triggers once per turn
   */
  turn?: number;
}

export interface TriggerLifetimeTemplate extends TriggerLifetime {
  /**
   * Can only trigger on this turn
   */
  usableTurnTemplate?: number | 'ETBTurn' | 'YourNextTurn';
}
