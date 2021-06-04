import { Ctx } from "boardgame.io";

import { GameState } from "./game";
import { actions, Actions, ActionTargets } from "./actions";
import { endActivateStage } from "./hook";

// TODO: Genericize targets for actionable interrupts
export interface Stack {
  action: Actions;
  targets: ActionTargets[];
  activeTargets: ActionTargets[];
}

// TODO: Add stack rewind for false confirmation
export function resolveSkill(G: GameState, ctx: Ctx, confirmation?: boolean) {
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeTargets.length == 0 && confirmation) {
    actions[stack.action](G, ctx);

    G.stack = undefined;
    endActivateStage(G, ctx);
  }
}

// TODO: function stackBuilder();
