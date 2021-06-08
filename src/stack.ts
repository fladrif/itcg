import { Ctx } from "boardgame.io";

import { GameState } from "./game";
import { actions, Actions, ActionTargets } from "./actions";
import { endActivateStage } from "./hook";
import { Skill, NonCharacter } from "./card";

// TODO: Genericize targets for actionable interrupts
export interface Stack {
  action: Actions;
  targets: ActionTargets[];
  activeTargets: ActionTargets[];
  selection: TargetSelection;
}

// TODO: May need to handle skills (character actions) as targets
export interface TargetSelection {
  position: number;
  targets: NonCharacter[][];
}

interface SetActiveStage {
  currentPlayer: string;
  next?: SetActiveStage;
}

function stage(stg: string, prev?: SetActiveStage): SetActiveStage {
  const stageOutput: SetActiveStage = {
    currentPlayer: stg,
  };

  if (prev) stageOutput.next = prev;

  return stageOutput;
}

function setStages(ctx: Ctx, targets: ActionTargets[]) {
  const endStages = stage("confirmation", stage("activate"));
  const otherStages = targets.reduce((acc) => stage("select", acc), endStages);

  ctx.events!.setActivePlayers!(otherStages);
}

export function resolveStack(G: GameState, ctx: Ctx, confirmation?: boolean) {
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeTargets.length == 0 && confirmation) {
    actions[stack.action](G, ctx);

    G.stack = undefined;

    ctx.events!.endStage!();
    endActivateStage(G, ctx);
  } else if (stack.activeTargets.length == 0) {
    stack.activeTargets = stack.targets;
    stack.selection = {
      position: 0,
      targets: [[]],
    };

    setStages(ctx, stack.targets);
  } else {
    stack.activeTargets.shift();

    ctx.events!.endStage!();
  }
}

export function buildStack(G: GameState, ctx: Ctx, skill: Skill) {
  G.stack = {
    action: skill.action,
    targets: skill.targets,
    activeTargets: skill.targets,
    selection: {
      position: 0,
      targets: [[]],
    },
  };

  setStages(ctx, skill.targets);
  if (skill.targets.length == 0) resolveStack(G, ctx, true);
}
