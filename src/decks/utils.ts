import lodash from 'lodash';

import { Deck } from '../game';

export function validateDeck(deck?: Deck): boolean {
  if (!deck?.character) return false;

  const totalCards = deck.deck.reduce(
    (acc, card) => {
      return { qt: card[1] + acc.qt, valid: card[1] <= 4 && card[1] >= 0 && acc.valid };
    },
    { qt: 0, valid: true }
  );

  if (totalCards.qt < 40 || !totalCards.valid) return false;

  if (
    lodash(deck.deck)
      .uniqBy((card) => card[0])
      .value().length !== deck.deck.length
  )
    return false;

  return true;
}
