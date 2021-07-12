import { Ctx } from 'boardgame.io';

import { GameState } from './game';
import { Skill, isMonster } from './card';
import { meetsSkillReq } from './utils';

export function endLevelStage(G: GameState, ctx: Ctx) {
  G.player[ctx.currentPlayer].activationPos = 0;
  ctx.events!.endStage!();
  endActivateStage(G, ctx);
}

function endActivate(G: GameState, ctx: Ctx) {
  ctx.events!.endStage!();
  endAttackStage(G, ctx);
}

export function endActivateStage(G: GameState, ctx: Ctx, now?: boolean) {
  if (now) endActivate(G, ctx);

  const player = G.player[ctx.currentPlayer];
  const skills: Skill[] = [];

  skills.push(...player.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return meetsSkillReq(skill.requirements, player, ctx.turn);
  });

  const noTargets = player.activationPos > skills.length || availableSkills.length == 0;
  if (noTargets) endActivate(G, ctx);
}

export function endAttackStage(G: GameState, ctx: Ctx, now?: boolean) {
  if (now) ctx.events!.endTurn!();

  const currentField = G.player[ctx.currentPlayer].field;

  if (!currentField.some((card) => isMonster(card) && card.attacks > 0)) {
    ctx.events!.endTurn!();
  }
}
