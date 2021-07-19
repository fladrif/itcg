import { Ctx } from 'boardgame.io';

import { Location } from './actions';
import { GameState } from './game';
import { Skill, isMonster, Monster } from './card';
import { getLocation, meetsSkillReq } from './utils';

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

function resetAttacks(G: GameState, ctx: Ctx) {
  // TODO: Handle fierce here, or set it as hook
  G.player[ctx.currentPlayer].field
    .filter((card) => isMonster(card))
    .map((card) => {
      (card as Monster).attacks = 1;
      (card as Monster).damageTaken = 0;
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
  const skills: Skill[] = [];

  skills.push(...player.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return meetsSkillReq(skill.requirements, player, ctx.turn);
  });

  const noTargets = availableSkills.length == 0;
  if (noTargets) endActivate(G, ctx);
}

export function endAttackStage(G: GameState, ctx: Ctx, now?: boolean) {
  if (now) return ctx.events!.endTurn!();

  const currentField = G.player[ctx.currentPlayer].field;

  if (!currentField.some((card) => isMonster(card) && card.attacks > 0)) {
    ctx.events!.endTurn!();
  }
}
