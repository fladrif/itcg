import { Ctx, PlayerID } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
import { NonCharacter, Character, CardTypes, isMonster } from './card';
import { endLevelStage, endActivateStage, endAttackStage } from './hook';
import { Decision, upsertStack, selectCard, parseSkill, resolveStack } from './stack';
import { getMonsterAtt } from './state';
import { deepCardComp, getLocation, getRandomKey, meetsSkillReq } from './utils';
import { Location } from './actions';

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
  const cardLoc = card[0];
  const selCard = card[1];

  if (cardLoc !== Location.Hand || 'skills' in selCard) return INVALID_MOVE;

  const levelDecision: Decision = {
    opts: {
      selection: {
        [cardLoc]: [selCard],
      },
    },
    action: 'level',
    finished: false,
    selection: {},
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [levelDecision], 'level');
  resolveStack(G, ctx);
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
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (
    (cardLoc !== Location.Character && cardLoc !== Location.CharAction) ||
    position === undefined ||
    player.activationPos > position
  ) {
    return INVALID_MOVE;
  }

  const skill = 'skills' in selCard ? selCard.skills[position] : selCard.skill;

  if (!meetsSkillReq(skill.requirements, player, ctx.turn)) {
    return INVALID_MOVE;
  }

  const prevPos = player.activationPos;
  player.activationPos = position + 1;
  skill.activated = true;

  upsertStack(G, ctx, [parseSkill(skill, selCard)], 'activate', prevPos);
  resolveStack(G, ctx);
}

export function attack(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter],
  _position?: number
) {
  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (cardLoc !== Location.Field || !isMonster(selCard) || selCard.attacks <= 0) {
    return INVALID_MOVE;
  }

  const attackDecision: Decision = {
    action: 'damage',
    target: {
      xor: [
        {
          location: Location.OppField,
          type: CardTypes.Monster,
          quantity: 1,
        },
        {
          location: Location.OppCharacter,
          type: CardTypes.Character,
          quantity: 1,
        },
      ],
    },
    opts: {
      source: selCard,
      damage: getMonsterAtt(G, ctx, selCard),
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [attackDecision], 'attack');
  resolveStack(G, ctx);
}

export function selectTarget(
  G: GameState,
  ctx: Ctx,
  card: [Location, Character | NonCharacter],
  _position?: number
) {
  selectCard(G, ctx, card);
}

export function confirmSkill(
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  resolveStack(G, ctx);
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
  endAttackStage(G, ctx, true);
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
  G: GameState,
  ctx: Ctx,
  _card: [Location, Character | NonCharacter],
  _position?: number
) {
  endActivateStage(G, ctx, true);
}
