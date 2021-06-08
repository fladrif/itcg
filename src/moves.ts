import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { NonCharacter, Character, Skill } from "./card";
import { endLevelStage, endAttackStage } from "./hook";
import { resolveStack, buildStack } from "./stack";
import { meetsSkillReq } from "./utils";

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

  // TODO: Handle in more graceful way
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

  player.activationPos = position + 1;
  buildStack(G, ctx, skill);
}

export function selectTarget(
  G: GameState,
  ctx: Ctx,
  card: Character | NonCharacter,
  _position?: number
) {
  if (!G.stack) return;
  // TODO: temp exclude Character from select targets, should be character skills (including nonchar skills)
  if ("skills" in card) return;

  G.stack.selection.targets[G.stack.selection.position].push(card);

  resolveStack(G, ctx);
}

export function confirmSkill(
  G: GameState,
  ctx: Ctx,
  _card: Character | NonCharacter,
  _position?: number
) {
  resolveStack(G, ctx, true);
}

export function declineSkill(
  G: GameState,
  ctx: Ctx,
  _card: Character | NonCharacter,
  _position?: number
) {
  resolveStack(G, ctx, false);
}

export function noAttacks(
  G: GameState,
  ctx: Ctx,
  _card: Character | NonCharacter,
  _position?: number
) {
  endAttackStage(G, ctx);
}

export function noLevel(
  G: GameState,
  ctx: Ctx,
  _card: Character | NonCharacter,
  _position?: number
) {
  endLevelStage(G, ctx);
}

export function noActivate(
  _G: GameState,
  ctx: Ctx,
  _card: Character | NonCharacter,
  _position?: number
) {
  ctx.events!.endStage!();
}
