import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
import { CardTypes, CardClasses, NonCharacter, SkillRequirements } from './card';
import { Selection } from './stack';
import { rmCard } from './utils';

export enum Location {
  Board = 'Board',
  Hand = 'Hand',
  Deck = 'Deck',
  CharAction = 'CharAction',
  OppBoard = 'OppBoard',
  OppHand = 'OppHand',
  OppDeck = 'OppDeck',
  OppCharAction = 'OppCharAction',
}

export type CurrentLevel = 'CurrentLevel';
export type LevelSelector = number | CurrentLevel;

export interface TargetFilter {
  location: Location;
  quantity: number;
  quantityUpTo?: boolean;
  level?: LevelSelector;
  type?: CardTypes;
  class?: CardClasses[];

  and?: never;
  xor?: never;
}

interface AddActionTarget {
  and: ActionTargets[];
  xor?: never;
}
interface XorActionTarget {
  xor: ActionTargets[];
  and?: never;
}

export type ActionTargets = TargetFilter | AddActionTarget | XorActionTarget;

export function checkReqs(reqs: SkillRequirements): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

function quest(G: GameState, ctx: Ctx, _sel?: Selection): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

function spawn(G: GameState, ctx: Ctx, sel: Selection): any {
  if (!G.stack) return;
  if (!sel[Location.Hand]) return;

  const player = G.player[ctx.currentPlayer];
  sel[Location.Hand]!.map((card) => {
    player.board.push(card as NonCharacter);
    rmCard(G, ctx, card, Location.Hand);
  });
}

export const actions = {
  quest,
  spawn,
};

export type Action = keyof typeof actions;
