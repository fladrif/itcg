import { Ctx } from 'boardgame.io';

import { GameState } from './game';
import { actions, Action, ActionTargets, Location } from './actions';
import { endActivateStage } from './hook';
import { Skill, Character, NonCharacter } from './card';
import { filterSelections } from './target';
import { deepCardComp, getLocation } from './utils';

export type Selection = Partial<Record<Location, (Character | NonCharacter)[]>>;

export interface Decision {
  action: Action;
  selection: Selection;
  finished: boolean;
  target?: ActionTargets;
  choice?: boolean;
  // TODO: future multiple choice
  modal?: boolean;
}

// TODO: Genericize targets for actionable interrupts
export interface Stack {
  decisions: Decision[];
  activeDecisions: Decision[];
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

function setStages(ctx: Ctx, decisions: Decision[]) {
  const loopbackStage = stage('activate');
  const otherStages = decisions.reduce((acc, decision) => {
    //TODO: Need to add modal option
    const stageName = !!decision.target
      ? 'select'
      : decision.choice !== undefined
      ? 'confirmation'
      : 'confirmation';

    return stage(stageName, acc);
  }, loopbackStage);

  ctx.events!.setActivePlayers!(otherStages);
}

export function resolveStack(G: GameState, ctx: Ctx, confirmation?: boolean) {
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeDecisions.length == 0) {
    stack.decisions.map((decision) => {
      actions[decision.action](G, ctx, decision.selection);
    });

    G.stack = undefined;

    endActivateStage(G, ctx);
    return;
  }

  if (!isDecisionNeeded(stack.activeDecisions[0]) || confirmation) {
    stack.decisions.push(stack.activeDecisions.shift()!);
    ctx.events!.endStage!();

    resolveStack(G, ctx);
  } else if (confirmation == false) {
    pruneDecisions(G, ctx, stack.decisions);
    pruneDecisions(G, ctx, stack.activeDecisions);
    G.player[ctx.currentPlayer].activationPos = stack.prevActivatePos;

    G.stack = undefined;
    setStages(ctx, []);
  }
}

// TODO: check for or accept hooks
export function buildStack(
  G: GameState,
  ctx: Ctx,
  skill: Skill,
  prevActivatePos: number
) {
  const decision = {
    action: skill.action,
    target: skill.targets,
    selection: {},
    finished: false,
  };

  G.stack = {
    decisions: [],
    activeDecisions: [decision],
    prevActivatePos,
  };

  setStages(ctx, G.stack.activeDecisions);
  resolveStack(G, ctx);
}

export function selectCard(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter]
) {
  if (!G.stack) return;

  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, card[0]).filter((c) => deepCardComp(c, card[1]))[0];

  const curDecision = G.stack.activeDecisions[0];

  if (!curDecision.selection[cardLoc]) curDecision.selection[cardLoc] = [];

  if (!selCard.selected) {
    curDecision.selection[cardLoc]!.push(selCard);
    selCard.selected = true;
  } else {
    pruneCardsSelection(curDecision.selection, cardLoc, [selCard]);
    selCard.selected = false;
  }

  // TODO: Confirm that target exists when allowing select
  const { selection, finished } = filterSelections(
    curDecision.target!,
    JSON.parse(JSON.stringify(curDecision.selection)),
    [card[0], selCard]
  );

  curDecision.finished = finished;

  pruneSelection(G, ctx, curDecision.selection, selection);
}

function pruneDecisions(G: GameState, ctx: Ctx, decisions: Decision[]) {
  decisions.map((decision) => {
    pruneSelection(G, ctx, decision.selection, decision.selection);
  });
}

function pruneSelection(
  G: GameState,
  ctx: Ctx,
  selection: Selection,
  overflow: Selection
) {
  for (const location of Object.keys(overflow) as Location[]) {
    pruneCardsGame(G, ctx, location, overflow[location]!);
    pruneCardsSelection(selection, location, overflow[location]!);
  }
}

function pruneCardsSelection(
  selection: Selection,
  location: Location,
  cards: (Character | NonCharacter)[]
) {
  const selLoc = selection[location];
  if (!selLoc) return;

  selLoc
    .filter((selCard) => !!cards.find((card) => deepCardComp(selCard, card)))
    .map((selCard) => (selCard.selected = false));

  selection[location] = selLoc.filter((card) => card.selected !== false);
}

function pruneCardsGame(
  G: GameState,
  ctx: Ctx,
  location: Location,
  cards: (Character | NonCharacter)[]
) {
  getLocation(G, ctx, location)
    .filter((gameCard) => !!cards.find((card) => deepCardComp(gameCard, card)))
    .map((gameCard) => (gameCard.selected = false));
}

function isDecisionNeeded(dec: Decision): boolean {
  if (dec.target !== undefined) return true;
  if (dec.choice !== undefined) return true;
  if (dec.modal !== undefined) return true;

  return false;
}
