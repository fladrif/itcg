import { PlayerID } from 'boardgame.io';

import { Character, NonCharacter } from '../card';
import { Choice, Decision, Selection } from '../stack';
// TODO: split into opts for ea action, wrap up into ActionOpts
export interface ActionOpts {
  damage?: Damage;
  selection?: Selection;
  choiceSelection?: Choice;
  decision?: string;
  position?: number;
  source?: Character | NonCharacter;
  triggerKey?: string;
  /**
   * Amount to regain hp. Used with refresh action
   */
  lifegain?: number;
  dialogDecision?: Decision[];
  /**
   * Should refresh increase hp over starting total. Defaults true if undef
   */
  overheal?: boolean;
  /**
   * Which player decision belongs to
   */
  activePlayer?: PlayerID;
}

export type Damage = number | 'CurrentLevel';
