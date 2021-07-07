import { Ctx } from 'boardgame.io';

import { Action, Location } from './actions';
import { Card } from './card';
import { GameState } from './game';
import { insertStack, Decision } from './stack';
import { getRandomKey } from './utils';

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
  // TODO: search list of triggers, filter
  if (!ShieldTrigger.shouldTrigger(G, ctx, decision, prep)) return [];

  G.stack!.decisionTriggers[decision.key].push(ShieldTrigger.name);

  return ShieldTrigger.createDecision(G, ctx, decision);
}

// TODO: Currently triggers on the entire damage decision, should split damage decision into constituent parts so shield triggers only on character damage (for damage decisions that affect characters and monsters)
export const ShieldTrigger: Trigger = {
  owner: 'Global',
  name: 'shield',
  shouldTrigger: (G, _ctx, decision, prep) => {
    if (
      !G.stack!.decisionTriggers[decision.key].includes('shield') &&
      prep === 'Before' &&
      decision.action === 'damage' &&
      (!!decision.selection[Location.Character] ||
        !!decision.selection[Location.OppCharacter])
    ) {
      return true;
    }

    return false;
  },
  createDecision: (_G, _ctx, decision) => {
    const newDec: Decision = {
      action: 'shield',
      selection: {},
      finished: false,
      key: getRandomKey(),
      opts: {
        decision: decision.key,
      },
    };

    return [newDec];
  },
};
