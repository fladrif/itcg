import { Ctx } from 'boardgame.io';

import { Location } from './target';
import { Skill, isMonster, Monster } from './card';
import { GameState } from './game';
import { Decision, upsertStack } from './stack';
import { getMonsterHealth } from './state';
import { pruneTriggerStore } from './trigger';
import { getCardLocation, getLocation, getRandomKey, meetsSkillReq } from './utils';

export function endLevelStage(G: GameState, ctx: Ctx) {
  G.player[ctx.currentPlayer].activationPos = 0;
  ctx.events!.endStage!();
  endActivateStage(G, ctx);
}

export function resetMonsterDamageOnField(G: GameState, ctx: Ctx) {
  const locations = [Location.Field, Location.OppField];

  locations.map((location) => {
    getLocation(G, ctx, location)
      .filter((card) => isMonster(card))
      .map((card) => ((card as Monster).damageTaken = 0));
  });
}

export function checkDeadMonstersOnField(G: GameState, ctx: Ctx) {
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

    upsertStack(G, ctx, decisions);
  });
}

function resetAttacks(G: GameState, ctx: Ctx) {
  G.player[ctx.currentPlayer].field
    .filter((card) => isMonster(card))
    .map((card) => {
      const mon = card as Monster;

      // TODO: get keywords through state
      const keywords = mon.ability.keywords;

      if (!keywords) {
        mon.attacks = 1;
        return;
      }

      const confused = mon.turnETB == ctx.turn && keywords.includes('confused');

      mon.attacks = confused ? 0 : keywords.includes('fierce') ? 2 : 1;
    });
}

function endActivate(G: GameState, ctx: Ctx) {
  ctx.events!.endStage!();
  resetAttacks(G, ctx);
  endAttackStage(G, ctx);
}

export function endActivateStage(G: GameState, ctx: Ctx, now?: boolean) {
  if (now) return endActivate(G, ctx);

  const player = G.player[ctx.currentPlayer];
  const skills: Skill[][] = [];

  skills.push(...player.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return skill.every((skill) => meetsSkillReq(skill.requirements, player));
  });

  const noTargets = availableSkills.length == 0;
  if (noTargets) endActivate(G, ctx);
}

export function endAttack(G: GameState, ctx: Ctx) {
  pruneTriggerStore(G, ctx);
  ctx.events!.endTurn!();
}

// TODO: add prune triggers for turn only triggers
export function endAttackStage(G: GameState, ctx: Ctx, now?: boolean) {
  if (now) return endAttack(G, ctx);

  const currentField = G.player[ctx.currentPlayer].field;

  if (!currentField.some((card) => isMonster(card) && card.attacks > 0)) {
    endAttack(G, ctx);
  }
}
