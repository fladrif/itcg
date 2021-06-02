import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { GameState } from "./game";
import { NonCharacter, Character } from "./card";
import { actions } from "./moveTemplates";

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

  ctx.events!.endStage!();
}

export function activateSkill(
  G: GameState,
  ctx: Ctx,
  card: Character | NonCharacter,
  position?: number
) {
  if (
    position === undefined ||
    G.player[ctx.currentPlayer].activationPos > position
  ) {
    return INVALID_MOVE;
  }

  if ("skills" in card) {
    const skillPos = position ?? 0;
    if (
      card.skills[skillPos].requirements.level >
      G.player[ctx.currentPlayer].level
    ) {
      return INVALID_MOVE;
    }

    actions[card.skills[skillPos].action](G, ctx);
    G.player[ctx.currentPlayer].activationPos = position + 1;
  } else {
    actions[card.skill.action](G, ctx);
    G.player[ctx.currentPlayer].activationPos = position + 1;
  }
}
