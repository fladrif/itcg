import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
import { CardTypes, CardClasses, Monster, NonCharacter, SkillRequirements } from './card';
import { Selection } from './stack';
import { deepCardComp, getLocation, getOpponentState, rmCard } from './utils';

export enum Location {
  Field = 'Field',
  Hand = 'Hand',
  Deck = 'Deck',
  CharAction = 'CharAction',
  Character = 'Character',
  OppField = 'OppField',
  OppHand = 'OppHand',
  OppDeck = 'OppDeck',
  OppCharAction = 'OppCharAction',
  OppCharacter = 'OppCharacter',
}

export type LevelSelector = number | 'CurrentLevel';

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

export interface ActionOpts {
  damage?: number;
  selection?: Selection;
}

export function checkReqs(reqs: SkillRequirements): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

function quest(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

function spawn(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || !opts.selection[Location.Hand]) return;

  const player = G.player[ctx.currentPlayer];
  opts.selection[Location.Hand]!.map((card) => {
    player.field.push(card as NonCharacter);
    rmCard(G, ctx, card, Location.Hand);
  });
}

function damage(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || opts.damage == undefined) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      if (card.type === CardTypes.Character) {
        getOpponentState(G, ctx).hp -= opts.damage!;
      }
      if (card.type === CardTypes.Monster) {
        getLocation(G, ctx, location)
          .filter((c) => deepCardComp(c, card))
          .map((card) => ((card as Monster).health -= opts.damage!));
      }
    });
  }
}

export const actions = {
  quest,
  spawn,
  damage,
};

export type Action = keyof typeof actions;
