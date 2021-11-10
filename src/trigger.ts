import { Ctx } from 'boardgame.io';

import { GameState } from './game';
import { upsertStack, Decision } from './stack';
import { triggers, Trigger, TriggerStore, TriggerPrepostion } from './triggerStore';

export function stackTriggers(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): boolean {
  // TODO: Maybe should split this into multiple calls, one for ea selection, or split decision, one for ea selection
  // edit: probably for shield, but maybe not if trigger order works + splitting damage decisions
  const decisions = getTriggers(G, ctx, decision, prep);

  upsertStack(G, ctx, decisions);

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

      triggerDecisions.push(trigger.createDecision.bind(trigger));
    }
  }

  return triggerDecisions;
}

function getTriggers(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): Decision[] {
  const processedTriggers = G.triggers.map((store) => processTriggers(store));
  const triggerDecisions: Decision[] = [];

  for (const trigger of processedTriggers) {
    if (trigger.shouldTrigger(G, ctx, decision, prep)) {
      G.stack!.decisionTriggers[decision.key].push(trigger.key);

      triggerDecisions.push(...trigger.createDecision(G, ctx, decision));
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
