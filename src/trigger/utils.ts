import { Ctx } from 'boardgame.io';

import { Character, NonCharacter } from '../card';
import { GameState, FuncContext } from '../game';
import { upsertStack, Decision } from '../stack';
import { getRandomKey } from '../utils';

import { Trigger } from './trigger';
import { triggers, TriggerNames } from './store';
import {
  TriggerStore,
  TriggerOptions,
  TriggerLifetime,
  TriggerPrepostion,
} from './types';

export function stackTriggers(
  fnCtx: FuncContext,
  decision: Decision,
  prep: TriggerPrepostion
): boolean {
  // TODO: Maybe should split this into multiple calls, one for ea selection, or split decision, one for ea selection
  // edit: probably for shield, but maybe not if trigger order works + splitting damage decisions
  const decisions = getTriggerFns(fnCtx, decision, prep);

  stackTriggerFns(fnCtx, decision, decisions);

  if (prep === 'Before' && decisions.length > 0) return true;
  return false;
}

export function stackTriggerFns(
  fnCtx: FuncContext,
  decision: Decision,
  decisionFns: ((fnCtx: FuncContext, decision: Decision) => Decision[])[]
): void {
  const decisions = decisionFns.map((decFn) => decFn(fnCtx, decision)).flat();

  upsertStack(fnCtx, decisions);
}

export function getTriggerFns(
  fnCtx: FuncContext,
  decision: Decision,
  prep: TriggerPrepostion
): ((fnCtx: FuncContext, decision: Decision) => Decision[])[] {
  const { G } = fnCtx;

  const processedTriggers = G.triggers.map((store) => processTriggers(store));
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

function processTriggers(trig: TriggerStore): Trigger {
  return new triggers[trig.name](
    trig.cardOwner,
    trig.owner,
    trig.key,
    trig.opts,
    trig.lifetime
  );
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
  lifetime: TriggerLifetime
): TriggerLifetime {
  const usableTurn =
    lifetime.usableTurn && lifetime.usableTurn === 'ETBTurn'
      ? ctx.turn
      : lifetime.usableTurn;

  return {
    ...lifetime,
    usableTurn,
  };
}
