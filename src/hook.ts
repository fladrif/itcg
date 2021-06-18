import { Ctx } from 'boardgame.io';

import { GameState } from './game';
import { Skill } from './card';
import { meetsSkillReq } from './utils';

export function endLevelStage(G: GameState, ctx: Ctx) {
  G.player[ctx.currentPlayer].activationPos = 0;
  ctx.events!.endStage!();
}

export function endActivateStage(G: GameState, ctx: Ctx) {
  const player = G.player[ctx.currentPlayer];
  const skills: Skill[] = [];

  skills.push(...player.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return meetsSkillReq(skill.requirements, player);
  });

  if (player.activationPos > skills.length || availableSkills.length == 0) {
    ctx.events!.endStage!();
  }
}

export function endAttackStage(_G: GameState, ctx: Ctx) {
  ctx.events!.endTurn!();
}
