import { Ctx } from 'boardgame.io';

import { GameState } from './game';
import { actions, Action, ActionOpts, ActionTargets, Location } from './actions';
import { endActivateStage, endAttackStage } from './hook';
import { Skill, Character, NonCharacter } from './card';
import { ensureFilter, filterSelections } from './target';
import { stackTriggers } from './trigger';
import { deepCardComp, getLocation, getRandomKey } from './utils';

// TODO: Handle choice/modal selections as well
export type Selection = Partial<Record<Location, (Character | NonCharacter)[]>>;

export interface Decision {
  action: Action;
  selection: Selection;
  finished: boolean;
  key: string;
  opts?: ActionOpts;
  target?: ActionTargets;
  choice?: boolean;
  // TODO: future multiple choice
  modal?: boolean;
}

export interface Stack {
  decisions: Decision[];
  activeDecisions: Decision[];
  currentStage: string;
  decisionTriggers: Record<string, string[]>;
  prevActivatePos?: number;
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

function setStages(G: GameState, ctx: Ctx, decisions: Decision[]) {
  if (!G.stack) return;

  const loopbackStage = stage(G.stack.currentStage);
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

  if (stack.activeDecisions.length <= 0) {
    if (stack.decisions.length <= 0) {
      resetSkillActivations(G, ctx);

      if (stack.currentStage == 'activate') endActivateStage(G, ctx);
      if (stack.currentStage == 'attack') endAttackStage(G, ctx);

      G.stack = undefined;
      return;
    }

    const nextDecision = stack.decisions[stack.decisions.length - 1];
    const didAddTrigger = stackTriggers(G, ctx, nextDecision, 'Before');

    if (didAddTrigger) {
      resolveStack(G, ctx);
      return;
    }

    const decision = stack.decisions.pop()!;
    const actionOpts = { ...decision.opts, selection: decision.selection };

    if (decision.opts?.selection) {
      actionOpts.selection = {
        ...actionOpts.selection,
        ...decision.opts.selection,
      };
    }

    actions[decision.action](G, ctx, actionOpts);

    stackTriggers(G, ctx, decision, 'After');

    pruneSelection(G, ctx, decision.selection, decision.selection); // Removes select tag from card (ui)
    resolveStack(G, ctx);
  } else if (confirmation !== false && !isDecisionNeeded(stack.activeDecisions[0])) {
    stack.decisions.push(stack.activeDecisions.shift()!);
    ctx.events!.endStage!();

    resolveStack(G, ctx);
  } else if (confirmation === false) {
    pruneDecisions(G, ctx, stack.decisions);
    pruneDecisions(G, ctx, stack.activeDecisions);

    if (stack.prevActivatePos !== undefined) {
      G.player[ctx.currentPlayer].activationPos = stack.prevActivatePos;
      resetSkillActivations(G, ctx);
    }

    setStages(G, ctx, []);
    G.stack = undefined;
  }
}

export function buildStack(
  G: GameState,
  ctx: Ctx,
  skill: Skill,
  currentStage: string,
  prevActivatePos?: number
) {
  const decision: Decision = {
    action: skill.action,
    opts: skill.opts,
    target: skill.targets,
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  G.stack = {
    decisions: [],
    activeDecisions: [decision],
    decisionTriggers: { [decision.key]: [] },
    currentStage,
    prevActivatePos,
  };

  setStages(G, ctx, G.stack.activeDecisions);
  resolveStack(G, ctx);
}

export function insertStack(G: GameState, ctx: Ctx, decision: Decision) {
  if (!G.stack) return;

  G.stack.activeDecisions.push(decision);
  G.stack.decisionTriggers[decision.key] = [];
  setStages(G, ctx, G.stack.activeDecisions);
}

export function selectCard(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter]
) {
  if (!G.stack) return;

  const playerState = G.player[ctx.currentPlayer];

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
    ensureFilter(curDecision.target!, playerState),
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
  if (dec.target !== undefined && dec.finished === false) return true;
  if (dec.choice !== undefined && dec.finished === false) return true;
  if (dec.modal !== undefined && dec.finished === false) return true;

  return false;
}

function resetSkillActivations(G: GameState, ctx: Ctx) {
  (getLocation(G, ctx, Location.Character)[0] as Character).skills.map(
    (skill) => (skill.activated = false)
  );

  (getLocation(G, ctx, Location.CharAction) as NonCharacter[]).map(
    (card) => (card.skill.activated = false)
  );
}
