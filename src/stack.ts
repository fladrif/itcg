import { Ctx } from "boardgame.io";

import { GameState } from "./game";
import { actions, Action, ActionTargets, Location } from "./actions";
import { endActivateStage } from "./hook";
import { Skill, Character, NonCharacter } from "./card";

export type Selection = Partial<Record<Location, (Character | NonCharacter)[]>>;

export interface Decision {
  action: Action;
  selection: Selection;
  target?: ActionTargets;
  choice?: boolean;
}

// TODO: Genericize targets for actionable interrupts
export interface Stack {
  decisions: Decision[];
  activeDecisions?: Decision[];
  prevActivatePos: number;
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

function setStages(ctx: Ctx, targets?: ActionTargets) {
  const loopbackStage = stage("activate");
  const otherStages = !!targets ? stage("select", loopbackStage) : loopbackStage;

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

export function buildStack(
  G: GameState,
  ctx: Ctx,
  skill: Skill,
  prevActivatePos: number
) {
  G.stack = {
    decisions: [
      {
        action: skill.action,
        target: skill.targets,
        selection: {},
      },
    ],
    prevActivatePos,
  };
  G.stack.activeDecisions = G.stack.decisions;

  setStages(ctx, skill.targets);
  if (!skill.targets) resolveStack(G, ctx, true);
}

export function selectCard(G: GameState, card: [Location, Character | NonCharacter]) {
  if (!G.stack) return;

  const cardLoc = card[0];
  const selCard = card[1];
  if (!G.stack.selection[cardLoc]) G.stack.selection[cardLoc] = [];

  if (!selCard.selected) {
    G.stack.selection[cardLoc]!.push(selCard);
    selCard.selected = true;
  } else {
    selCard.selected = false;
    G.stack.selection[cardLoc] = G.stack.selection[cardLoc]!.filter(
      (card) => card.selected !== false
    );
  }
}
