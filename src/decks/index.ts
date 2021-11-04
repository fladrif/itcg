import { PlayerID } from 'boardgame.io';

import { Deck } from '../game';
import { cards } from '../cards';
import { instantiateCard, NonCharacter } from '../card';

export function hydrateDeck(deck: Deck, owner: PlayerID): NonCharacter[] {
  return deck.deck.map((tuple) => instantiateCard(tuple[0], owner, tuple[1])).flat();
}

export const shermanSample: Deck = {
  character: cards.maya,
  deck: [
    [cards.slime, 1],
    [cards.fairy, 1],
    [cards.jrnecki, 1],
    [cards.octopus, 1],
    [cards.redsnail, 1],
    [cards.wildboar, 1],
    [cards.magicclaw, 4],
    [cards.ribbonpig, 1],
    [cards.darkaxestump, 1],
    [cards.greenmushroom, 1],
    [cards.orangemushroom, 1],
    [cards.emeraldearrings, 1],
  ],
};

export const nixieSample: Deck = {
  character: cards.nixie,
  deck: [
    [cards.slime, 1],
    [cards.fairy, 1],
    [cards.jrnecki, 1],
    [cards.octopus, 1],
    [cards.redsnail, 1],
    [cards.wildboar, 1],
    [cards.magicclaw, 1],
    [cards.ribbonpig, 4],
    [cards.darkaxestump, 1],
    [cards.greenmushroom, 1],
    [cards.orangemushroom, 4],
    [cards.emeraldearrings, 1],
  ],
};

export * from './bowman';
export * from './warrior';

export * from './utils';
