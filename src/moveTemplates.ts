import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { CardClasses } from "./card";

interface skillRequirements {
  level: number;
  class?: Record<CardClasses, number>;
}

export function checkReqs(
  reqs: skillRequirements
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

export const actions = {
  quest,
};

export type Actions = keyof typeof actions;
