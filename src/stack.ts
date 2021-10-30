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
import { endLevelStage, endActivateStage, endAttackStage } from './hook';
import { isMonster, Skill, Character, NonCharacter } from './card';
import { ensureFilter, filterSelections, isTargetable, mayFinished } from './target';
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

export type Selection = Partial<Record<Location, (Character | NonCharacter)[]>>;

export enum Choice {
  Heads = 'Heads',
  Tails = 'Tails',
  Yes = 'Yes',
  No = 'No',
  Ack = 'Ack',
  Rock = 'Rock',
  Paper = 'Paper',
  Scissor = 'Scissor',
}

export interface Decision {
  action: Action;
  selection: Selection;
  finished: boolean;
  key: string;
  dialogPrompt?: string;
  opts?: ActionOpts;
  target?: ActionTargets;
  noReset?: boolean;
  choice?: Choice[];
  choiceSelection?: Choice;
  mainDecision?: boolean;
}

export interface Stack {
  decisions: Decision[];
  activeDecisions: Decision[];
  currentStage: string;
  decisionTriggers: Record<string, string[]>;
  queuedDecisions: Decision[];
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

interface ResolveStackOptions {
  resetStack?: boolean;
  finished?: boolean;
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
  const otherStages = decisions.reverse().reduce((acc, decision) => {
    const isOpponent = decision.target ? isOpponentAction(decision.target) : false;

    const stageName = !!decision.target
      ? 'select'
      : decision.choice !== undefined
      ? 'choice'
      : 'confirmation';

    return stage(stageName, isOpponent, acc);
  }, loopbackStage);

  decisions.reverse();

  ctx.events!.setActivePlayers!(otherStages);
}

export function resolveStack(G: GameState, ctx: Ctx, opts?: ResolveStackOptions) {
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

      if (stack.currentStage == 'level') endLevelStage(G, ctx);
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
    const actionOpts = {
      ...decision.opts,
      selection: decision.selection,
      choiceSelection: decision.choiceSelection,
    };

    if (decision.opts?.selection) {
      actionOpts.selection = mergeSelections(decision.selection, decision.opts.selection);
    }

    actions[decision.action](G, ctx, actionOpts);
    if (decision.mainDecision) stack.prevActivatePos = undefined;

    stackTriggers(G, ctx, decision, 'After');

    pruneSelection(G, ctx, decision.selection, decision.selection); // Removes select tag from card (ui)
    resolveStack(G, ctx);
  } else if (
    opts?.resetStack !== true &&
    (!isDecisionNeeded(stack.activeDecisions[0]) || opts?.finished)
  ) {
    if (!mayFinished(stack.activeDecisions[0].target) && opts?.finished) return; // finished option can only be used if quantityUpTo is true

    stack.decisions.push(stack.activeDecisions.shift()!);
    ctx.events!.endStage!();

    resolveStack(G, ctx);
  } else if (opts?.resetStack) {
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

export function parseSkill(
  skill: Skill,
  source: Character | NonCharacter,
  main?: boolean
): Decision {
  return {
    action: skill.action,
    opts: { ...skill.opts, source },
    target: skill.targets,
    selection: {},
    dialogPrompt: skill.dialogPrompt,
    choice: skill.choice,
    noReset: skill.noReset,
    finished: false,
    key: getRandomKey(),
    mainDecision: main,
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

export function makeChoice(G: GameState, _ctx: Ctx, choice: Choice) {
  if (!G.stack) return;

  const curDecision = G.stack.activeDecisions[0];
  if (!curDecision.choice?.includes(choice)) return;

  curDecision.choiceSelection = choice;
  curDecision.finished = true;
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
  if (!selCard) return;

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
  if (!validationGate(globalState, playerState, decision, card)) return false;

  return true;
}

function validationGate(
  globalState: GlobalState[],
  playerState: PlayerState,
  decision: Decision,
  card: Character | NonCharacter
): boolean {
  if (decision.action === 'attack' && isMonster(card)) {
    if (card.ability.keywords && card.ability.keywords.includes('stealthy')) return false;
  }

  if (decision.action === 'play') {
    const charClasses = new Set([playerState.character.class]);
    playerState.learnedSkills.map((card) => charClasses.add(card.class));

    return charClasses.has(card.class);
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

  return false;
}

function resetSkillActivations(G: GameState, ctx: Ctx) {
  (getLocation(G, ctx, Location.Character)[0] as Character).skills.map((skill) =>
    skill.map((sk) => (sk.activated = false))
  );

  G.player[ctx.currentPlayer].learnedSkills = (
    getLocation(G, ctx, Location.CharAction) as NonCharacter[]
  ).map((card) => {
    return {
      ...card,
      skill: card.skill.map((sk) => {
        return { ...sk, activated: false };
      }),
    };
  });
}
