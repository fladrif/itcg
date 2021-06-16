import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { NonCharacter, Character, Skill } from "./card";
import { endLevelStage, endAttackStage } from "./hook";
import { resolveStack, buildStack, selectCard } from "./stack";
import { meetsSkillReq } from "./utils";
import { Location } from "./actions";

export function shuffleDeck(G: GameState, ctx: Ctx, id: PlayerID) {
  const player = G.player[id];
  if (!player) return INVALID_MOVE;

  player.deck = ctx.random!.Shuffle(player.deck);
}

export function levelUp(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter],
  _position?: number
) {
  const player = G.player[ctx.currentPlayer];
  const cardLoc = card[0];
  const selCard = card[1];

  if (cardLoc !== Location.Hand || "skills" in selCard) return INVALID_MOVE;

  const handIndex = player.hand.findIndex(
    (searchCard) => searchCard.name === selCard.name
  );

  // TODO: Handle in more graceful way
  if (handIndex === -1) return INVALID_MOVE;

  player.hand.splice(handIndex, 1);
  player.learnedSkills.push(selCard);

  player.level += 10;
  player.hp += 20;

  endLevelStage(G, ctx);
}

export function activateSkill(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter],
  position?: number
) {
  const player = G.player[ctx.currentPlayer];
  const cardLoc = card[0];
  const selCard = card[1];

  if (
    cardLoc !== Location.CharAction ||
    position === undefined ||
    player.activationPos > position
  ) {
    return INVALID_MOVE;
  }

  let skill: Skill;

  if ("skills" in selCard) {
    skill = selCard.skills[position!];
  } else {
    skill = selCard.skill;
  }

  if (!meetsSkillReq(skill.requirements, player)) {
    return INVALID_MOVE;
  }

  const prevPos = player.activationPos;
  player.activationPos = position + 1;

  buildStack(G, ctx, skill, prevPos);
}

export function selectTarget(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter],
  _position?: number
) {
  // TODO: temp exclude Character from select targets, should be character skills (including nonchar skills)

  selectCard(G, ctx, card);
}

export function confirmSkill(
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  resolveStack(G, ctx, true);
}

export function declineSkill(
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  resolveStack(G, ctx, false);
}

export function noAttacks(
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  endAttackStage(G, ctx);
}

export function noLevel(
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  endLevelStage(G, ctx);
}

export function noActivate(
  _G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  ctx.events!.endStage!();
}
