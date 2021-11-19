import { PlayerID } from 'boardgame.io';

import { Character, NonCharacter } from '../card';
import { Choice, Decision, Selection } from '../stack';

export type Damage = number | 'CurrentLevel';

// TODO: split into opts for ea action, wrap up into ActionOpts
export interface ActionOpts {
  damage?: Damage;
  selection?: Selection;
  choiceSelection?: Choice;
  triggerKey?: string;
  decision?: string;
  /**
   * Position in deck for tuck action
   */
  position?: number;
  /**
   * Card source for action
   */
  source?: Character | NonCharacter;
  /**
   * Amount to regain hp. Used with refresh action
   */
  lifegain?: number;
  /**
   * Decisions an action resolves if appropriate
   */
  dialogDecision?: Decision[];
  /**
   * Should refresh increase hp over starting total. Defaults true if undef
   */
  overheal?: boolean;
  /**
   * Which player decision belongs to
   */
  activePlayer?: PlayerID;
  /**
   * Discard action targets randomly
   */
  randomDiscard?: boolean;
  /**
   * Targets all monsters opponent controls
   */
  allOppMonster?: boolean;
  /**
   * Targets opponent's character
   */
  oppCharacter?: boolean;
}
