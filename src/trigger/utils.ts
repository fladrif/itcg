import { Ctx } from 'boardgame.io';

import { Character, NonCharacter, Monster } from '../card';
import { GameState, FuncContext } from '../game';
import { upsertStack, Decision } from '../stack';
import { getRandomKey } from '../utils';

import { GenericTrigger } from './trigger';
import { ActionTrigger } from './actionTrigger';
import { TurnTrigger } from './turnTrigger';
import { triggers, TriggerNames } from './store';
import {
  TriggerContext,
  TriggerLifetime,
  TriggerLifetimeTemplate,
  TriggerOptions,
  TriggerPreposition,
  TriggerStore,
  TurnPhase,
} from './types';

export function stackActionTriggers(
  fnCtx: FuncContext,
  decision: Decision,
  prep: TriggerPreposition
): boolean {
  // TODO: Maybe should split this into multiple calls, one for ea selection, or split decision, one for ea selection
  // edit: probably for shield, but maybe not if trigger order works + splitting damage decisions
  const decisions = getActionTriggerFns(fnCtx, decision, prep);

  stackTriggerFns(fnCtx, decision, decisions);

  if (prep === 'Before' && decisions.length > 0) return true;
  return false;
}

export function stackTriggerFns<T extends TriggerContext>(
  fnCtx: FuncContext,
  trigCtx: T,
  decisionFns: ((fnCtx: FuncContext, trigCtx: T) => Decision[])[]
): void {
  const decisions = decisionFns.map((decFn) => decFn(fnCtx, trigCtx)).flat();

  if (decisions.length > 0) upsertStack(fnCtx, decisions);
}

export function getActionTriggerFns(
  fnCtx: FuncContext,
  decision: Decision,
  prep: TriggerPreposition
): ((fnCtx: FuncContext, decision: Decision) => Decision[])[] {
  const { G } = fnCtx;

  const processedTriggers = G.triggers
    .map((store) => processTriggers(store))
    .filter(isActionTrigger);
  const triggerDecisions: ((fnCtx: FuncContext, decision: Decision) => Decision[])[] = [];

  for (const trigger of processedTriggers) {
    if (trigger.shouldTrigger(fnCtx, decision, prep)) {
      G.stack!.decisionTriggers[decision.key].push(trigger.key);
      if (trigger.lifetime?.usableTurn && trigger.lifetime?.once) {
        removeTrigger(G, trigger.cardOwner);
      }

      triggerDecisions.push(trigger.createDecision.bind(trigger));
    }
  }

  return triggerDecisions;
}

export function getTurnTriggerFns(
  fnCtx: FuncContext,
  phase: TurnPhase,
  prep: TriggerPreposition
): ((fnCtx: FuncContext, phase: TurnPhase) => Decision[])[] {
  const { G, ctx } = fnCtx;

  const processedTriggers = G.triggers
    .map((store) => processTriggers(store))
    .filter(isTurnTrigger);
  const triggerDecisions: ((fnCtx: FuncContext, phase: TurnPhase) => Decision[])[] = [];
  const turnCtxKey = `${phase}${ctx.turn}`;

  for (const trigger of processedTriggers) {
    if (trigger.shouldTrigger(fnCtx, phase, prep)) {
      if (!G.stack) {
        G.stack = {
          decisions: [],
          activeDecisions: [],
          decisionTriggers: {},
          queuedDecisions: [],
          currentStage: phase,
        };
        G.stack.decisionTriggers[turnCtxKey] = [];
      }
      G.stack!.decisionTriggers[turnCtxKey].push(trigger.key);
      if (trigger.lifetime?.usableTurn && trigger.lifetime?.once) {
        removeTrigger(G, trigger.cardOwner);
      }

      triggerDecisions.push(trigger.createDecision.bind(trigger));
    }
  }

  return triggerDecisions;
}

function processTriggers(trig: TriggerStore): GenericTrigger {
  return new triggers[trig.name](
    trig.cardOwner,
    trig.owner,
    trig.key,
    trig.opts,
    trig.lifetime
  );
}

function isTurnTrigger(trig: GenericTrigger): trig is TurnTrigger {
  return !!(trig as TurnTrigger).turnTrigger;
}

function isActionTrigger(trig: GenericTrigger): trig is ActionTrigger {
  return !!(trig as ActionTrigger).actionTrigger;
}

export function pruneTriggerStore(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;

  const unPrunedTriggers = G.triggers.filter((trig) => {
    const uTurn = trig.lifetime?.usableTurn;

    return !(uTurn && uTurn < ctx.turn);
  });

  G.triggers = unPrunedTriggers;
}

export function removeTrigger(G: GameState, cardOwner: string) {
  const index = G.triggers.findIndex((trig) => trig.cardOwner === cardOwner);
  if (index < 0) return;

  G.triggers.splice(index, 1);
}

export function pushTriggerStore(
  fnCtx: FuncContext,
  triggerName: TriggerNames,
  card: NonCharacter | Character,
  opts?: TriggerOptions,
  lifetime?: TriggerLifetime
) {
  fnCtx.G.triggers.push({
    name: triggerName,
    cardOwner: card.key,
    key: getRandomKey(),
    owner: card.owner,
    opts,
    lifetime,
  });
}

export function parseTriggerLifetime(
  ctx: Ctx,
  lifetime: TriggerLifetimeTemplate,
  monCard?: Monster
): TriggerLifetime {
  const curTurn = monCard && monCard.turnETB ? monCard.turnETB : ctx.turn;
  const usableTurn =
    lifetime.usableTurnTemplate && lifetime.usableTurnTemplate === 'ETBTurn'
      ? curTurn
      : lifetime.usableTurnTemplate && lifetime.usableTurnTemplate === 'YourNextTurn'
      ? ctx.turn + 2
      : lifetime.usableTurnTemplate;

  return {
    ...lifetime,
    usableTurn,
  };
}
