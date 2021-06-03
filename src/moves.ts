import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { NonCharacter, Character, Skill } from "./card";
import { actions } from "./actions";
import { endLevelStage, endActivateStage, meetsSkillReq } from "./hook";

export function shuffleDeck(G: GameState, ctx: Ctx, id: PlayerID) {
  const player = G.player[id];
  if (!player) return INVALID_MOVE;

  player.deck.deck = ctx.random!.Shuffle(player.deck.deck);
}

export function levelUp(
  G: GameState,
  ctx: Ctx,
  card: Character | NonCharacter,
  _position?: number
) {
  if ("skills" in card) return INVALID_MOVE;

  const player = G.player[ctx.currentPlayer];

  const handIndex = player.hand.findIndex(
    (searchCard) => searchCard.name === card.name
  );

  if (handIndex === -1) return INVALID_MOVE;

  player.hand.splice(handIndex, 1);
  player.learnedSkills.push(card);

  player.level += 10;
  player.hp += 20;

  endLevelStage(G, ctx);
}

export function activateSkill(
  G: GameState,
  ctx: Ctx,
  card: Character | NonCharacter,
  position?: number
) {
  const player = G.player[ctx.currentPlayer];
  if (position === undefined || player.activationPos > position) {
    return INVALID_MOVE;
  }

  let skill: Skill;

  if ("skills" in card) {
    skill = card.skills[position!];
  } else {
    skill = card.skill;
  }

  if (!meetsSkillReq(skill.requirements, player)) {
    return INVALID_MOVE;
  }

  actions[skill.action](G, ctx);
  player.activationPos = position + 1;

  endActivateStage(G, ctx);
}
