import { Ctx, PlayerID } from "boardgame.io";

import { GameState, PlayerState } from "./game";
import { Card, SkillRequirements } from "./card";
import { Location } from "./actions";

export function meetsSkillReq(req: SkillRequirements, P: PlayerState): boolean {
  if (req.level > P.level) return false;

  return true;
}

export function rmCard(G: GameState, ctx: Ctx, card: Card, location: Location) {
  const loc = getLocation(G, ctx, location);

  const index = loc.findIndex((searchCard) => searchCard.name === card.name);

  // TODO: Handle in more graceful way, or expect error/verification to occur before
  if (index === -1) return;
  loc.splice(index, 1);
}

export function toggleCardSelect(G: GameState, ctx: Ctx, card: Card, location: Location) {
  const loc = getLocation(G, ctx, location);

  const index = loc.findIndex((searchCard) => searchCard.name === card.name);

  // TODO: Handle in more graceful way, or expect error/verification to occur before
  if (index === -1) return;
  loc[index].selected = !loc[index].selected;
}

export function getOpponentID(G: GameState, ctx: Ctx, player?: PlayerID): PlayerID {
  const playerID = player ?? ctx.currentPlayer;
  return Object.keys(G.player).filter((id) => id != playerID)[0];
}

export function getOpponentState(G: GameState, ctx: Ctx): PlayerState {
  return G.player[getOpponentID(G, ctx)];
}

export function getLocation(G: GameState, ctx: Ctx, location: Location): Card[] {
  const player = G.player[ctx.currentPlayer];
  const opponent = getOpponentState(G, ctx);

  switch (location) {
    case Location.Hand:
      return player.hand;
    case Location.Board:
      return player.board;
    case Location.Deck:
      return player.deck.deck;
    case Location.CharAction:
      return player.learnedSkills;
    case Location.OppHand:
      return opponent.hand;
    case Location.OppBoard:
      return opponent.board;
    case Location.OppDeck:
      return opponent.deck.deck;
    case Location.OppCharAction:
      return opponent.learnedSkills;
  }
}

export function deepCardComp(first: Card, second: Card): boolean {
  if (first.name !== second.name) return false;
  if (first.selected !== second.selected) return false;

  return true;
}
