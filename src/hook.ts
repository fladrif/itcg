import { Location } from './target';
import { isMonster, Monster } from './card';
import { FuncContext } from './game';
import { skillDict, SkillRef } from './skill';
import { Decision, overrideStage, upsertStack } from './stack';
import { getMonsterKeywords, getMonsterHealth, pruneStateStore } from './state';
import { pruneTriggerStore } from './trigger';
import {
  getCardLocation,
  getLocation,
  getRandomKey,
  passSkillReqToActivate,
} from './utils';

export function endLevelStage(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;

  G.player[ctx.currentPlayer].activationPos = 0;
  overrideStage(fnCtx, 'activate', false);
  endActivateStage(fnCtx);
}

export function resetMonsterDamageOnField(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;
  const locations = [Location.Field, Location.OppField];

  locations.map((location) => {
    getLocation(G, ctx, location)
      .filter((card) => isMonster(card))
      .map((card) => ((card as Monster).damageTaken = 0));
  });
}

export function checkDeadMonstersOnField(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;
  const locations = [Location.Field, Location.OppField];

  locations.map((location) => {
    const decisions = getLocation(G, ctx, location)
      .filter((card) => {
        return (
          isMonster(card) &&
          (card as Monster).damageTaken >= getMonsterHealth(G, ctx, card as Monster)
        );
      })
      .map((card) => {
        const cardLoc = getCardLocation(G, ctx, card.key);

        const decision: Decision = {
          action: 'destroy',
          selection: { [cardLoc]: [card] },
          finished: false,
          key: getRandomKey(),
        };

        return decision;
      });

    upsertStack(fnCtx, decisions);
  });
}

function resetAttacks(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;

  G.player[ctx.currentPlayer].field
    .filter((card) => isMonster(card))
    .map((card) => {
      const mon = card as Monster;

      const keywords = getMonsterKeywords(G, ctx, mon);

      if (!keywords) {
        mon.attacks = 1;
        return;
      }

      const confused = mon.turnETB == ctx.turn && keywords.includes('confused');

      mon.attacks = confused ? 0 : keywords.includes('fierce') ? 2 : 1;
    });
}

function endActivate(fnCtx: FuncContext) {
  overrideStage(fnCtx, 'attack', false);
  resetAttacks(fnCtx);
  endAttackStage(fnCtx);
}

export function endActivateStage(fnCtx: FuncContext, now?: boolean) {
  const { G, ctx } = fnCtx;

  if (now) return endActivate(fnCtx);

  const player = G.player[ctx.currentPlayer];
  const skills: SkillRef[] = [];

  skills.push(...player.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return skillDict[skill.name].every((skill) =>
      passSkillReqToActivate(skill.requirements, player)
    );
  });

  const noTargets = availableSkills.length == 0;
  if (noTargets) endActivate(fnCtx);
}

function endAttack(fnCtx: FuncContext) {
  const { events } = fnCtx;

  pruneTriggerStore(fnCtx);
  pruneStateStore(fnCtx);
  events.endTurn();
}

// TODO: add prune triggers for turn only triggers
export function endAttackStage(fnCtx: FuncContext, now?: boolean) {
  const { G, ctx } = fnCtx;

  if (now) return endAttack(fnCtx);

  const currentField = G.player[ctx.currentPlayer].field;

  if (!currentField.some((card) => isMonster(card) && card.attacks > 0)) {
    endAttack(fnCtx);
  }
}
