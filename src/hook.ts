import { Ctx } from "boardgame.io";

import { GameState } from "./game";
import { Skill } from "./card";
import { meetsSkillReq } from "./utils";
import { actions } from "./actions";

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

// TODO: Add stack rewind for false confirmation
export function resolveSkill(G: GameState, ctx: Ctx, confirmation?: boolean) {
  const stack = G.stack;
  if (!stack) return;

  if (stack.activeTargets.length == 0 && confirmation) {
    actions[stack.action](G, ctx);

    G.stack = undefined;
    endActivateStage(G, ctx);
  }
}
