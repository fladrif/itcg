import { PlayerID } from 'boardgame.io';

import { Deck } from '../game';
import { instantiateCard, NonCharacter } from '../card';

export function hydrateDeck(deck: Deck, owner: PlayerID): NonCharacter[] {
  return deck.deck.map((tuple) => instantiateCard(tuple[0], owner, tuple[1])).flat();
}

export * from './bowman';
export * from './warrior';
