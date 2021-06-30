import { Ctx, PlayerID } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
import { NonCharacter, Character, CardTypes, isMonster, Skill } from './card';
import { endLevelStage, endAttackStage } from './hook';
import { resolveStack, buildStack, selectCard } from './stack';
import { deepCardComp, getLocation, meetsSkillReq, rmCard } from './utils';
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
  const player = G.player[ctx.currentPlayer];
  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (cardLoc !== Location.Hand || 'skills' in selCard) return INVALID_MOVE;
  rmCard(G, ctx, selCard, cardLoc);

  const turn = selCard.skill.requirements.turn !== undefined ? ctx.turn : undefined;

  player.learnedSkills.push({
    ...selCard,
    skill: {
      ...selCard.skill,
      requirements: { ...selCard.skill.requirements, turn },
    },
  });

  // TODO: May want to consider handling level elsewhere, or determining it jit, (consider destroying cards under character)
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

  buildStack(G, ctx, skill, 'activate', prevPos);
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

  const attackAction: Skill = {
    requirements: {
      level: 0,
    },
    action: 'attack',
    activated: false,
    targets: {
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
      attacker: selCard,
    },
  };

  buildStack(G, ctx, attackAction, 'attack');
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
