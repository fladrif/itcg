import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { CardTypes, CardClasses, SkillRequirements } from "./card";
import { rmCard } from "./utils";

export enum Location {
  Board,
  Hand,
  Deck,
  CharAction,
  OppBoard,
  OppHand,
  OppDeck,
  OppCharAction,
}

export type CurrentLevel = "CurrentLevel";
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

function quest(G: GameState, ctx: Ctx): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.deck.shift()!);
}

function spawn(G: GameState, ctx: Ctx): any {
  if (!G.stack) return;
  if (G.stack.selection.targets.length !== 1) return;

  const player = G.player[ctx.currentPlayer];
  G.stack.selection.targets.map((arry) =>
    arry.map((card) => {
      player.board.push(card);
      rmCard(G, ctx, card, G.stack!.targets[0].location);
    })
  );
}

export const actions = {
  quest,
  spawn,
};

export type Action = keyof typeof actions;
