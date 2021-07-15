import { Ctx } from 'boardgame.io';

import { Item, Monster, Tactic } from '../card';
import { GameState } from '../game';
import { upsertStack, parseSkill } from '../stack';
import { pushTriggerStore } from '../triggerStore';

export function handlePlayNonTactic(G: GameState, ctx: Ctx, card: Monster | Item): any {
  if (card.ability.triggers) {
    card.ability.triggers.map((trigger) => pushTriggerStore(G, ctx, trigger, card));
  }

  if (card.ability.skills) {
    card.ability.skills.map((skill) => {
      upsertStack(G, ctx, [parseSkill(skill, card)]);
    });
  }
}

export function handlePlayTactic(G: GameState, ctx: Ctx, card: Tactic): any {
  if (card.ability.triggers) {
    card.ability.triggers.map((trigger) => pushTriggerStore(G, ctx, trigger, card));
  }

  if (card.ability.skills) {
    card.ability.skills.map((skill, idx) => {
      if (idx === 0) {
        upsertStack(G, ctx, [parseSkill(skill, card)]);
      } else {
        G.stack!.queuedDecisions.push(parseSkill(skill, card));
      }
    });
  }
}
