import { CardTypes, CardSubTypes, CardClasses } from '../card';
import { Selection } from '../stack';

export interface FilterResponse {
  selection: Selection;
  finished: boolean;
  usedRecent: boolean;
}
//
// TODO: possible refactor, this is always relative to currentPlayer; sometimes needs to be relative to card owner or other context
// edit: or fine as is and handle relativity elsewhere
export enum Location {
  Field = 'Field',
  Hand = 'Hand',
  Deck = 'Deck',
  Discard = 'Discard',
  CharAction = 'CharAction',
  Character = 'Character',
  Temporary = 'Temporary',
  OppField = 'OppField',
  OppHand = 'OppHand',
  OppDeck = 'OppDeck',
  OppDiscard = 'OppDiscard',
  OppCharAction = 'OppCharAction',
  OppCharacter = 'OppCharacter',
  OppTemporary = 'OppTemporary',
}

export type LevelSelector = number | 'CurrentLevel';

export interface TargetFilter {
  location: Location;
  quantity: number;
  // True if num selected can be less than quantity specified
  quantityUpTo?: boolean;
  level?: LevelSelector;
  type?: CardTypes;
  subtype?: CardSubTypes[];
  class?: CardClasses[];
  excludeCardKey?: string[];
  cardKey?: string[];

  and?: never;
  xor?: never;
}

interface AndActionTarget {
  and: ActionTargets[];

  xor?: never;
}

interface XorActionTarget {
  xor: ActionTargets[];

  and?: never;
}

export type ActionTargets = TargetFilter | AndActionTarget | XorActionTarget;
