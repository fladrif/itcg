import { Ctx } from 'boardgame.io';

import { GameState, PlayerState } from './game';
import {
  actions,
  isOpponentAction,
  Action,
  ActionOpts,
  ActionTargets,
  Location,
} from './actions';
import { endActivateStage, endAttackStage } from './hook';
import { isMonster, Skill, Character, NonCharacter } from './card';
import { ensureFilter, filterSelections, isTargetable } from './target';
import { stackTriggers } from './trigger';
import {
  deepCardComp,
  getCurrentStage,
  getCardLocation,
  getLocation,
  getCardAtLocation,
  getRandomKey,
  mergeSelections,
} from './utils';
import { GlobalState } from './state';
import { TriggerStore } from './triggerStore';

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
  queuedDecisions: Decision[];
  triggers?: TriggerStore[];
  prevActivatePos?: number;
}

interface OpponentActiveStage {
  others: string;
  currentPlayer?: never;
  next?: SetActiveStage;
}

interface CurrentActiveStage {
  currentPlayer: string;
  others?: never;
  next?: SetActiveStage;
}

export type SetActiveStage = CurrentActiveStage | OpponentActiveStage;

function stage(
  stg: string,
  opponentAction: boolean,
  prev?: SetActiveStage
): SetActiveStage {
  const stageOutput: SetActiveStage = !opponentAction
    ? { currentPlayer: stg }
    : { others: stg };

  if (prev) stageOutput.next = prev;

  return stageOutput;
}

function setStages(G: GameState, ctx: Ctx, decisions: Decision[]) {
  if (!G.stack) return;

  const loopbackStage = stage(G.stack.currentStage, false);
  const otherStages = decisions.reduce((acc, decision) => {
    const isOpponent = decision.target ? isOpponentAction(decision.target) : false;

    //TODO: Need to add modal option
    const stageName = !!decision.target
      ? 'select'
      : decision.choice !== undefined
      ? 'confirmation'
      : 'confirmation';

    return stage(stageName, isOpponent, acc);
  }, loopbackStage);

  ctx.events!.setActivePlayers!(otherStages);
}

export function resolveStack(G: GameState, ctx: Ctx, confirmation?: boolean) {
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeDecisions.length <= 0) {
    if (stack.decisions.length <= 0) {
      resetSkillActivations(G, ctx);

      if (stack.queuedDecisions.length > 0) {
        upsertStack(G, ctx, [stack.queuedDecisions.shift()!]);
        resolveStack(G, ctx);
        return;
      }

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
      actionOpts.selection = mergeSelections(decision.selection, decision.opts.selection);
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

export function parseSkill(skill: Skill, source: Character | NonCharacter): Decision {
  return {
    action: skill.action,
    opts: { ...skill.opts, source },
    target: skill.targets,
    selection: {},
    finished: false,
    key: getRandomKey(),
  };
}

export function upsertStack(
  G: GameState,
  ctx: Ctx,
  decisions: Decision[],
  currentStage?: string,
  prevActivatePos?: number
) {
  if (!G.stack) {
    const stage = currentStage ? currentStage : getCurrentStage(G, ctx);

    G.stack = {
      decisions: [],
      activeDecisions: decisions,
      decisionTriggers: {},
      queuedDecisions: [],
      currentStage: stage,
      prevActivatePos,
    };

    decisions.map((dec) => (G.stack!.decisionTriggers[dec.key] = []));
  } else {
    G.stack.activeDecisions.push(...decisions);

    decisions.map((dec) => (G.stack!.decisionTriggers[dec.key] = []));
  }

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

  if (!isSelectable(G.state, playerState, curDecision, selCard)) return;

  if (!selCard.selected) {
    curDecision.selection[cardLoc]!.push(selCard);
    selCard.selected = true;
  } else {
    pruneCardsFromSelection(curDecision.selection, cardLoc, [selCard]);
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

function isSelectable(
  globalState: GlobalState[],
  playerState: PlayerState,
  decision: Decision,
  card: Character | NonCharacter
): boolean {
  if (!isTargetable(ensureFilter(decision.target!, playerState), card)) return false;
  if (!validationGate(globalState, decision, card)) return false;

  return true;
}

function validationGate(
  globalState: GlobalState[],
  decision: Decision,
  card: Character | NonCharacter
): boolean {
  if (decision.action === 'attack' && isMonster(card)) {
    if (card.ability.keywords && card.ability.keywords.includes('stealthy')) return false;
  }

  const stateTarget = globalState.filter(
    (state) =>
      state.player == card.owner &&
      !!state.modifier.target &&
      state.modifier.target.action === decision.action
  );

  if (stateTarget.some((target) => isStateTargetable(target, card))) return false;

  return true;
}

function isStateTargetable(target: GlobalState, card: Character | NonCharacter): boolean {
  // TODO: add specific card targetted effects in future if necessary.
  if (isTargetable(target.targets, card)) return false;

  return true;
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
    unselectGameCards(G, ctx, location, overflow[location]!);
    pruneCardsFromSelection(selection, location, overflow[location]!);
  }
}

function pruneCardsFromSelection(
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

function unselectGameCards(
  G: GameState,
  ctx: Ctx,
  location: Location,
  cards: (Character | NonCharacter)[]
) {
  getLocation(G, ctx, location)
    .filter((gameCard) => !!cards.find((card) => deepCardComp(gameCard, card)))
    .map((gameCard) => (gameCard.selected = false));

  cards
    .filter((card) => {
      return !getLocation(G, ctx, location).find((locCard) =>
        deepCardComp(locCard, card)
      );
    })
    .map((movedCard) => {
      const currentLocation = getCardLocation(G, ctx, movedCard.key);
      getCardAtLocation(G, ctx, currentLocation, movedCard.key).selected = false;
    });
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
