import { FuncContext, PlayerState } from './game';
import { actions, isOpponentAction, Action, ActionOpts } from './actions';
import { ActionTargets, Location } from './target';
import { endLevelStage, endActivateStage, endAttackStage } from './hook';
import { isMonster, Skill, Character, NonCharacter } from './card';
import { ensureFilter, filterSelections, meetsTarget, mayFinished } from './target';
import { getActionTriggerFns, stackTriggerFns, stackActionTriggers } from './trigger';
import {
  deepCardComp,
  getCurrentStage,
  getCardLocation,
  getLocation,
  getCardAtLocation,
  getRandomKey,
  mergeSelections,
  getOpponentState,
} from './utils';
import { getRelevantState, GlobalState } from './state';

export type Selection = Partial<Record<Location, (Character | NonCharacter)[]>>;

export enum Choice {
  Heads = 'Heads',
  Tails = 'Tails',
  Yes = 'Yes',
  No = 'No',
  Ack = 'Ok',
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
  currentPlayer: string;
  next?: SetActiveStage;
}

interface CurrentActiveStage {
  currentPlayer: string;
  others: string;
  next?: SetActiveStage;
}

interface ResolveStackOptions {
  resetStack?: boolean;
  finished?: boolean;
  turnTrigger?: boolean;
}

export type SetActiveStage = CurrentActiveStage | OpponentActiveStage;

function stage(
  stg: string,
  opponentAction: boolean,
  prev?: SetActiveStage
): SetActiveStage {
  const stageOutput: SetActiveStage = !opponentAction
    ? { currentPlayer: stg, others: 'unactive' }
    : { others: stg, currentPlayer: 'unactive' };

  if (prev) stageOutput.next = prev;

  return stageOutput;
}

function setStages({ G, ctx, events }: FuncContext, decisions: Decision[]) {
  if (!G.stack) return;
  const loopbackStage = stage(G.stack.currentStage, false);

  const otherStages = decisions.reverse().reduce((acc, decision) => {
    const isOpponent = decision.target
      ? isOpponentAction(decision.target)
      : decision.opts?.activePlayer
      ? decision.opts.activePlayer !== ctx.currentPlayer
      : false;

    const stageName = !!decision.target
      ? 'select'
      : decision.choice !== undefined
      ? 'choice'
      : 'confirmation';

    return stage(stageName, isOpponent, acc);
  }, loopbackStage);

  decisions.reverse();

  events.setActivePlayers(otherStages);
}

export function overrideStage(
  { events }: FuncContext,
  stg: string,
  opponentAction: boolean
): void {
  const setStages = stage(stg, opponentAction);

  events.setActivePlayers(setStages);
}

export function resolveStack(fnCtx: FuncContext, opts?: ResolveStackOptions) {
  const { G, ctx } = fnCtx;
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeDecisions.length <= 0) {
    if (stack.decisions.length <= 0) {
      resetSkillActivations(fnCtx);

      if (stack.queuedDecisions.length > 0) {
        upsertStack(fnCtx, [stack.queuedDecisions.shift()!]);
        resolveStack(fnCtx);
        return;
      }

      if (!opts?.turnTrigger) {
        if (stack.currentStage === 'level') endLevelStage(fnCtx);
        if (stack.currentStage === 'activate') endActivateStage(fnCtx);
        if (stack.currentStage === 'attack') endAttackStage(fnCtx);
      }

      G.stack = undefined;
      return;
    }

    const nextDecision = stack.decisions[stack.decisions.length - 1];
    const didAddTrigger = stackActionTriggers(fnCtx, nextDecision, 'Before');

    if (didAddTrigger) {
      resolveStack(fnCtx);
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

    /**
     * Will only stack decisions, but won't start executing until after current decision is completed
     * Used so that cards being destroyed with death triggers can see their own death.
     * Cards that ignore their own death trigger will need to explicitly check for themselves
     */
    const afterTrigFns = getActionTriggerFns(fnCtx, decision, 'After');

    actions[decision.action](fnCtx, actionOpts);
    if (decision.mainDecision) stack.prevActivatePos = undefined;

    /**
     * Triggers will not duplicate, inherent check if triggered for particular decision
     */
    afterTrigFns.push(...getActionTriggerFns(fnCtx, decision, 'After'));
    stackTriggerFns(fnCtx, decision, afterTrigFns);

    /**
     * Removes select tag from card (ui)
     */
    pruneSelection(fnCtx, decision.selection, decision.selection);

    resolveStack(fnCtx);
  } else if (
    opts?.resetStack !== true &&
    (!isDecisionNeeded(stack.activeDecisions[0]) || opts?.finished)
  ) {
    if (!mayFinished(stack.activeDecisions[0].target) && opts?.finished) return; // finished option can only be used if quantityUpTo is true

    stack.decisions.push(stack.activeDecisions.shift()!);
    setStages(fnCtx, stack.activeDecisions);

    resolveStack(fnCtx);
  } else if (opts?.resetStack) {
    pruneDecisions(fnCtx, stack.decisions);
    pruneDecisions(fnCtx, stack.activeDecisions);

    if (stack.prevActivatePos !== undefined) {
      G.player[ctx.currentPlayer].activationPos = stack.prevActivatePos;
      // TODO (fix): should this reset all skill activations? What is activated used for
      resetSkillActivations(fnCtx);
    }

    setStages(fnCtx, []);
    G.stack = undefined;
  }
}

export function parseSkill(
  fnCtx: FuncContext,
  skill: Skill,
  source: Character | NonCharacter,
  main?: boolean
): Decision {
  const { G, ctx } = fnCtx;

  const selection: Selection = {};
  const oppState = getOpponentState(G, ctx, source.owner);

  if (skill.opts?.allOppMonster) {
    const location: Location =
      source.owner === ctx.currentPlayer ? Location.OppField : Location.Field;

    selection[location] = [...oppState.field.filter((card) => isMonster(card))];
  }

  if (skill.opts?.oppCharacter) {
    const location: Location =
      source.owner === ctx.currentPlayer ? Location.OppCharacter : Location.Character;

    selection[location] = [oppState.character];
  }

  if (skill.opts?.randomDiscard && oppState.hand.length > 0) {
    const location =
      source.owner === ctx.currentPlayer ? Location.OppHand : Location.Hand;
    const randomCardIdx = Math.floor(Math.random() * oppState.hand.length);
    const randomCard = oppState.hand[randomCardIdx];

    selection[location] = [randomCard];
  }

  return {
    action: skill.action,
    opts: { ...skill.opts, source },
    target: skill.targets,
    selection,
    dialogPrompt: skill.dialogPrompt,
    choice: skill.choice,
    noReset: skill.noReset,
    finished: false,
    key: getRandomKey(),
    mainDecision: main,
  };
}

export function upsertStack(
  fnCtx: FuncContext,
  decisions: Decision[],
  currentStage?: string,
  prevActivatePos?: number
) {
  const { G } = fnCtx;

  if (!G.stack) {
    const stage = currentStage ? currentStage : getCurrentStage(fnCtx);

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

  setStages(fnCtx, G.stack.activeDecisions);
}

export function makeChoice(fnCtx: FuncContext, choice: Choice) {
  const { G } = fnCtx;

  if (!G.stack) return;

  const curDecision = G.stack.activeDecisions[0];
  if (!curDecision.choice?.includes(choice)) return;

  curDecision.choiceSelection = choice;
  curDecision.finished = true;
}

export function selectCard(
  fnCtx: FuncContext,
  card: [Location, Character | NonCharacter]
) {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;

  const playerState = G.player[ctx.currentPlayer];

  const cardLoc = card[0];
  const selCard = getCardAtLocation(G, ctx, cardLoc, card[1].key);

  const curDecision = G.stack.activeDecisions[0];

  if (!curDecision.selection[cardLoc]) curDecision.selection[cardLoc] = [];

  if (!isSelectable(fnCtx, G.state, playerState, curDecision, selCard)) return;

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

  pruneSelection(fnCtx, curDecision.selection, selection);
}

function isSelectable(
  fnCtx: FuncContext,
  globalState: GlobalState[],
  playerState: PlayerState,
  decision: Decision,
  card: Character | NonCharacter
): boolean {
  const { G, ctx } = fnCtx;
  if (!meetsTarget(G, ctx, ensureFilter(decision.target!, playerState), card))
    return false;
  if (!validationGate(fnCtx, globalState, playerState, decision, card)) return false;

  return true;
}

function validationGate(
  fnCtx: FuncContext,
  globalState: GlobalState[],
  playerState: PlayerState,
  decision: Decision,
  card: Character | NonCharacter
): boolean {
  const { G, ctx } = fnCtx;

  // Cannot attack monsters with stealthy
  if (decision.action === 'attack' && isMonster(card)) {
    if (card.ability.keywords && card.ability.keywords.includes('stealthy')) return false;
  }

  // Cannot play cards of a class that is not in your party
  if (decision.action === 'play') {
    const charClasses = new Set();
    playerState.learnedSkills.map((card) => charClasses.add(card.class));

    return charClasses.has(card.class);
  }

  // Cannot use action against targets belonging to player
  // Seems a bit too specific, should be refactored in the future probably
  // TODO: currently doesn't account for location, needs to for fully functioning filter
  const stateTarget = getRelevantState(ctx, globalState, card).filter(
    (state) => !!state.modifier.target && state.modifier.target.action === decision.action
  );

  if (
    stateTarget.some((target) =>
      meetsTarget(G, ctx, ensureFilter(target.targets, playerState), card)
    )
  ) {
    return false;
  }

  return true;
}

function pruneDecisions(fnCtx: FuncContext, decisions: Decision[]) {
  decisions.forEach((decision) => {
    pruneSelection(fnCtx, decision.selection, decision.selection);
  });
}

function pruneSelection(fnCtx: FuncContext, selection: Selection, overflow: Selection) {
  for (const location of Object.keys(overflow) as Location[]) {
    unselectGameCards(fnCtx, location, overflow[location]!);
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
  fnCtx: FuncContext,
  location: Location,
  cards: (Character | NonCharacter)[]
) {
  const { G, ctx } = fnCtx;

  getLocation(G, ctx, location)
    .filter((gameCard) => !!cards.find((card) => deepCardComp(gameCard, card)))
    .map((gameCard) => (gameCard.selected = false));

  cards
    .filter((card) => {
      return !getLocation(G, ctx, location).find((locCard) =>
        deepCardComp(locCard, card)
      );
    })
    .forEach((movedCard) => {
      const currentLocation = getCardLocation(G, ctx, movedCard.key);
      getCardAtLocation(G, ctx, currentLocation, movedCard.key).selected = false;
    });
}

function isDecisionNeeded(dec: Decision): boolean {
  if (dec.target !== undefined && dec.finished === false) return true;
  if (dec.choice !== undefined && dec.finished === false) return true;

  return false;
}

function resetSkillActivations(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;
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
