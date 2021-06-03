import { Ctx } from "boardgame.io";

import { GameState, PlayerState } from "./game";
import { Skill, SkillRequirements } from "./card";

export function endLevelStage(G: GameState, ctx: Ctx) {
  G.player[ctx.currentPlayer].activationPos = 0;
  ctx.events!.endStage!();
}

export function endActivateStage(G: GameState, ctx: Ctx) {
  const player = G.player[ctx.currentPlayer];
  const skills: Skill[] = [];

  skills.push(...player.deck.character.skills);
  player.learnedSkills.map((card) => skills.push(card.skill));

  const availableSkills = skills.slice(player.activationPos).filter((skill) => {
    return meetsSkillReq(skill.requirements, player);
  });

  if (player.activationPos > skills.length || availableSkills.length == 0) {
    ctx.events!.endStage!();
  }
}

export function meetsSkillReq(req: SkillRequirements, P: PlayerState): boolean {
  if (req.level > P.level) return false;

  return true;
}
