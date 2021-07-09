import { Ctx } from 'boardgame.io';

import { Card } from './card';
import { GameState } from './game';
import { insertStack, Decision } from './stack';
import { shieldTrigger, dmgDestroyTrigger } from './triggerList';

export type TriggerOwner = Card | 'Global';
export type TriggerPrepostion = 'Before' | 'After';

export interface Trigger {
  owner: TriggerOwner; // quest target
  name: string;
  shouldTrigger: (
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ) => boolean;
  createDecision: (G: GameState, ctx: Ctx, decision: Decision) => Decision[];
}

const triggerList = [shieldTrigger, dmgDestroyTrigger];

export function stackTriggers(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): boolean {
  // TODO: Maybe should split this into multiple calls, one for ea selection, or split decision, one for ea selection
  const decisions = getTriggers(G, ctx, decision, prep);

  for (const decision of decisions) {
    insertStack(G, ctx, decision);
  }

  if (prep === 'Before' && decisions.length > 0) return true;
  return false;
}

function getTriggers(
  G: GameState,
  ctx: Ctx,
  decision: Decision,
  prep: TriggerPrepostion
): Decision[] {
  const triggerDecisions: Decision[] = [];

  for (const trigger of triggerList) {
    if (trigger.shouldTrigger(G, ctx, decision, prep)) {
      G.stack!.decisionTriggers[decision.key].push(trigger.name);

      triggerDecisions.push(...trigger.createDecision(G, ctx, decision));
    }
  }

  return triggerDecisions;
}
