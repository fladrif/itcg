import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { CardTypes, SkillRequirements } from "./card";

export enum Location {
  Hand,
  Deck,
  CharAction,
  OppHand,
  OppDeck,
  OppCharAction,
}

export interface ActionTargets {
  level?: number;
  type?: CardTypes;
  quantity?: number;
  location?: Location;
}

export function checkReqs(
  reqs: SkillRequirements
): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

function quest(G: GameState, ctx: Ctx): any {
  const player = G.player[ctx.currentPlayer];

  if (!player || player.deck.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.deck.pop()!);
}

// function spawn(G: GameState, ctx: Ctx, targets: ActionTargets[]): any {
//   const player = G.player[ctx.currentPlayer];
//   if (targets.level && opts.level
// }

export const actions = {
  quest,
  // spawn,
};

export type Actions = keyof typeof actions;
