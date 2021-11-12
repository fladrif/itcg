import { Ctx } from 'boardgame.io';

import { Character, isItem, isMonster, NonCharacter } from '../card';
import { GameState } from '../game';
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
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): boolean {
  // TODO: Maybe should split this into multiple calls, one for ea selection, or split decision, one for ea selection
  // edit: probably for shield, but maybe not if trigger order works + splitting damage decisions
  const decisions = getTriggerFns(G, ctx, decision, prep);

  stackTriggerFns(G, ctx, decision, decisions);

  if (prep === 'Before' && decisions.length > 0) return true;
  return false;
}

export function stackTriggerFns(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  decisionFns: ((G: GameState, ctx: Ctx, decision: Decision) => Decision[])[]
): void {
  const decisions = decisionFns.map((decFn) => decFn(G, ctx, decision)).flat();

  upsertStack(G, ctx, decisions);
}

export function getTriggerFns(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): ((G: GameState, ctx: Ctx, decision: Decision) => Decision[])[] {
  const processedTriggers = G.triggers.map((store) => processTriggers(store));
  const triggerDecisions: ((G: GameState, ctx: Ctx, decision: Decision) => Decision[])[] =
    [];

  for (const trigger of processedTriggers) {
    if (trigger.shouldTrigger(G, ctx, decision, prep)) {
      G.stack!.decisionTriggers[decision.key].push(trigger.key);
      if (trigger.lifetime?.usableTurn && trigger.lifetime?.once) {
        removeTrigger(G, ctx, trigger.cardOwner);
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

export function pruneTriggerStore(G: GameState, ctx: Ctx) {
  const unPrunedTriggers = G.triggers.filter((trig) => {
    const uTurn = trig.lifetime?.usableTurn;

    return !(uTurn && uTurn < ctx.turn);
  });

  G.triggers = unPrunedTriggers;
}

export function removeTrigger(G: GameState, _ctx: Ctx, cardOwner: string) {
  const index = G.triggers.findIndex((trig) => trig.cardOwner === cardOwner);
  if (index < 0) return;

  G.triggers.splice(index, 1);
}

export function pushTriggerStore(
  G: GameState,
  _ctx: Ctx,
  triggerName: TriggerNames,
  card: NonCharacter | Character,
  opts?: TriggerOptions,
  lifetime?: TriggerLifetime
) {
  G.triggers.push({
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
