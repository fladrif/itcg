import { Ctx, PlayerID } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import lodash from "lodash";

import { GameState } from "./game";
import { NonCharacter } from "./card";

export function shuffleDeck(G: GameState, _ctx: Ctx, id: PlayerID) {
  const player = G.player[id];
  if (!player) return INVALID_MOVE;

  player.deck.deck = lodash(player.deck.deck).shuffle().value();
}

export function drawCard(G: GameState, ctx: Ctx) {
  const player = G.player[ctx.currentPlayer];
  if (!player || player.deck.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.deck.pop()!);
  ctx.events!.endTurn!();
}

export function levelUp(G: GameState, ctx: Ctx, card: NonCharacter) {
  const player = G.player[ctx.currentPlayer];

  const handIndex = player.hand.findIndex(
    (searchCard) => searchCard.name === card.name
  );

  if (handIndex === -1) return INVALID_MOVE;

  player.hand.splice(handIndex, 1);
  player.learnedSkills.push(card);

  player.level += 10;
  player.hp += 20;
  player.maxHP += 20;

  ctx.events!.endStage!();
}
