import { Ctx } from 'boardgame.io';

import { ActionTargets, Location } from './index';
import { isMonster, Monster, NonCharacter, SkillRequirements } from '../card';
import { GameState } from '../game';
import { upsertStack, parseSkill } from '../stack';
import { removeGlobalState } from '../state';
import { pruneTriggerStore, pushTriggerStore } from '../triggerStore';
import { getCardAtLocation, getCardLocation, rmCard } from '../utils';

export function handleAbility(G: GameState, ctx: Ctx, card: NonCharacter): any {
  if (card.ability.triggers) {
    card.ability.triggers.map((trigger) =>
      pushTriggerStore(G, ctx, trigger.name, card, trigger.opts)
    );
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

  if (card.ability.state) {
    G.state.push({
      owner: card.key,
      player: card.owner,
      targets: card.ability.state.targets,
      modifier: card.ability.state.modifier,
    });
  }
}

export function handleCardLeaveField(
  G: GameState,
  ctx: Ctx,
  card: NonCharacter,
  location: Location
) {
  pruneTriggerStore(G, ctx, card.key);
  rmCard(G, ctx, card, location);
  resetMonsterDamage(G, ctx, card);
  removeGlobalState(G, ctx, card);
}

function resetMonsterDamage(G: GameState, ctx: Ctx, card: NonCharacter) {
  if (!isMonster(card)) return;

  const newLocation = getCardLocation(G, ctx, card.key);
  const c = getCardAtLocation(G, ctx, newLocation, card.key);
  (c as Monster).damageTaken = 0;
}

export function isOpponentAction(target: ActionTargets): boolean {
  if ('location' in target) return target.location === Location.OppHand;

  if ('and' in target) return target.and!.some((tar) => isOpponentAction(tar));

  if ('xor' in target) return target.xor!.some((tar) => isOpponentAction(tar));

  throw new Error(`Filter composed incorrectly: ${target}`);
}

export function checkReqs(reqs: SkillRequirements): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}
