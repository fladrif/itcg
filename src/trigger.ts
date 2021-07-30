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

function getTriggers(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): Decision[] {
  // reverse for trigger order matters
  const processedTriggers = G.triggers.reverse().map((store) => processTriggers(store));
  const triggerDecisions: Decision[] = [];

  for (const trigger of processedTriggers) {
    if (trigger.shouldTrigger(G, ctx, decision, prep)) {
      G.stack!.decisionTriggers[decision.key].push(trigger.name);

      triggerDecisions.push(...trigger.createDecision(G, ctx, decision));
    }
  }

  return triggerDecisions;
}

function processTriggers(trig: TriggerStore): Trigger {
  return new triggers[trig.name](trig.key, trig.owner);
}
