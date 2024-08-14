import { v4 as uuidv4 } from 'uuid';
import { Ctx, PlayerID } from 'boardgame.io';

import { FuncContext, GameState, PlayerState } from './game';
import {
  Card,
  CardClasses,
  Item,
  Monster,
  Tactic,
  Character,
  NonCharacter,
  SkillRequirements,
} from './card';
import { Location } from './target';
import { Selection } from './stack';
import { getBlankCard } from './card';

export type MonsterType = Omit<Monster, 'key' | 'owner'>;
export type CharacterType = Omit<Character, 'key' | 'owner'>;
export type ItemType = Omit<Item, 'key' | 'owner'>;
export type TacticType = Omit<Tactic, 'key' | 'owner'>;

export function passSkillReqToActivate(req: SkillRequirements, P: PlayerState): boolean {
  if (req.oneshot) return false;

  return meetsSkillReq(req, P);
}

export function meetsSkillReq(req: SkillRequirements, P: PlayerState): boolean {
  if (req.level > P.level) return false;

  if (!req.class) return true;

  for (const cardClass of Object.keys(req.class) as CardClasses[]) {
    if (
      req.class[cardClass] !== undefined &&
      req.class[cardClass]! >
        P.learnedSkills.filter((card) => card.class === cardClass).length
    ) {
      return false;
    }
  }

  return true;
}

export function rmCard(G: GameState, ctx: Ctx, card: Card, location: Location) {
  const loc = getLocation(G, ctx, location);

  const index = loc.findIndex((searchCard) => deepCardComp(searchCard, card));

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
  return Object.keys(G.player).filter((id) => id !== playerID)[0];
}

export function getOpponentState(G: GameState, ctx: Ctx, player?: PlayerID): PlayerState {
  return G.player[getOpponentID(G, ctx, player)];
}

export function getCardAtLocation(
  G: GameState,
  ctx: Ctx,
  location: Location,
  key: string
): Character | NonCharacter {
  const cards = getLocation(G, ctx, location).filter((card) => card.key === key);

  return cards[0];
}

export function getCardLocation(G: GameState, ctx: Ctx, key: string): Location {
  const locations = Object.keys(Location) as Location[];

  return locations.find((location) =>
    getLocation(G, ctx, location).some((card) => card.key === key)
  )!;
}

export function getLocation(
  G: GameState,
  ctx: Ctx,
  location: Location
): (Character | NonCharacter)[] {
  const player = G.player[ctx.currentPlayer];
  const opponent = getOpponentState(G, ctx);

  switch (location) {
    case Location.Hand:
      return player.hand;
    case Location.Field:
      return player.field;
    case Location.Deck:
      return player.deck;
    case Location.Discard:
      return player.discard;
    case Location.CharAction:
      return player.learnedSkills;
    case Location.Temporary:
      return player.temporary;
    case Location.Character:
      return [player.character];
    case Location.OppHand:
      return opponent.hand;
    case Location.OppField:
      return opponent.field;
    case Location.OppDeck:
      return opponent.deck;
    case Location.OppDiscard:
      return opponent.discard;
    case Location.OppCharAction:
      return opponent.learnedSkills;
    case Location.OppTemporary:
      return opponent.temporary;
    case Location.OppCharacter:
      return [opponent.character];
  }
}

export function deepCardComp(first: Card, second: Card): boolean {
  return first.key === second.key;
}

export function getRandomKey(): string {
  return uuidv4().split('-')[0];
}

export function getCurrentStage(fnCtx: FuncContext): string {
  const { ctx } = fnCtx;
  return ctx.activePlayers ? ctx.activePlayers[ctx.currentPlayer] : '';
}

export function mergeSelections(sel1: Selection, sel2: Selection): Selection {
  const mergedSel: Selection = [sel1, sel2].reduce((acc, sel) => {
    for (const location of Object.keys(sel) as Location[]) {
      if (!acc[location]) acc[location] = [];

      if (sel[location]) acc[location]!.push(...sel[location]!);
    }

    return acc;
  }, {});

  return mergedSel;
}

export function scrubPile(deck: NonCharacter[], curPlayer?: PlayerID): NonCharacter[] {
  const newDeck = deck.map((card) => {
    if (card.reveal && curPlayer && (card.reveal as PlayerID[]).includes(curPlayer)) {
      return card;
    }
    return getBlankCard(card.owner, getRandomKey());
  });
  return newDeck;
}

export function every<T>(arr: T[], fn: (val: T) => boolean): boolean {
  return arr.reduce<boolean>((acc, val) => acc && fn(val), true);
}
