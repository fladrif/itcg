import { ActionTargets, Location } from '../target';
import { isMonster, Monster, Character, NonCharacter, SkillRequirements } from '../card';
import { FuncContext, PlayerState } from '../game';
import { upsertStack, parseSkill, Decision } from '../stack';
import { parseStateLifetime, removeGlobalState } from '../state';
import { removeTrigger, parseTriggerLifetime, pushTriggerStore } from '../trigger';
import { getCardAtLocation, getCardLocation, getOpponentID, rmCard } from '../utils';

import { Damage } from './types';

export function handleAbility(fnCtx: FuncContext, card: NonCharacter): any {
  const { G, ctx } = fnCtx;

  if (card.ability.triggers) {
    card.ability.triggers.map((trigger) => {
      const lifetime = trigger.lifetime
        ? parseTriggerLifetime(ctx, trigger.lifetime)
        : undefined;

      pushTriggerStore(fnCtx, trigger.name, card, trigger.opts, lifetime);
    });
  }

  if (card.ability.skills) {
    card.ability.skills.map((skill, idx) => {
      if (idx === 0) {
        upsertStack(fnCtx, [parseSkill(fnCtx, skill, card)]);
      } else {
        G.stack!.queuedDecisions.push(parseSkill(fnCtx, skill, card));
      }
    });
  }

  if (card.ability.state) {
    G.state.push({
      owner: card.key,
      player: card.ability.state.targetOpponent
        ? getOpponentID(fnCtx, card.owner)
        : card.owner,
      targets: card.ability.state.targets,
      modifier: card.ability.state.modifier,
      lifetime: parseStateLifetime(ctx, card.ability.state.lifetime),
    });
  }
}

export function handleCardLeaveField(
  fnCtx: FuncContext,
  card: NonCharacter,
  location: Location
) {
  const { G } = fnCtx;
  if (location === Location.OppCharAction || location === Location.CharAction) {
    G.player[card.owner].level -= 10;
  }
  removeTrigger(G, card.key);
  rmCard(fnCtx, card, location);
  resetMonsterDamage(fnCtx, card);
  removeGlobalState(fnCtx, card);
}

function resetMonsterDamage(fnCtx: FuncContext, card: NonCharacter) {
  if (!isMonster(card)) return;

  const newLocation = getCardLocation(fnCtx, card.key);
  const c = getCardAtLocation(fnCtx, newLocation, card.key);
  (c as Monster).damageTaken = 0;
}

// TODO: this needs to be relative to the current player, and the owner of the decision
export function isOpponentAction(target: ActionTargets): boolean {
  if ('location' in target) return target.location === Location.OppHand;

  if ('and' in target) return target.and!.some((tar) => isOpponentAction(tar));

  if ('xor' in target) return target.xor!.some((tar) => isOpponentAction(tar));

  throw new Error(`Filter composed incorrectly: ${target}`);
}

export function checkReqs(reqs: SkillRequirements): (fnCtx: FuncContext) => boolean {
  return (fnCtx: FuncContext) => {
    const { G, ctx } = fnCtx;
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

export function resolveDamage(player: PlayerState, damage: Damage): number {
  if (damage === 'CurrentLevel') return player.level;
  return damage;
}

export function ensureDecision(
  decisions: Decision[],
  source: Character | NonCharacter
): Decision[] {
  return decisions.map((dec) => {
    if (!!dec.opts?.source) return dec;

    return {
      ...dec,
      opts: {
        ...dec.opts,
        source,
      },
    };
  });
}
