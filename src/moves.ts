import { INVALID_MOVE } from 'boardgame.io/core';

import { FuncContext } from './game';
import { NonCharacter, Character, CardTypes, isMonster } from './card';
import { endLevelStage, endActivateStage, endAttackStage } from './hook';
import {
  Decision,
  upsertStack,
  selectCard,
  makeChoice,
  parseSkill,
  resolveStack,
  Choice,
} from './stack';
import { getMonsterAtt } from './state';
import {
  deepCardComp,
  getCardAtLocation,
  getLocation,
  getRandomKey,
  meetsSkillReq,
} from './utils';
import { Location } from './target';

export interface MoveOptions {
  card?: [Location, Character | NonCharacter];
  choice?: Choice;
  position?: number;
  finished?: boolean;
}

export function levelUp(fnCtx: FuncContext, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  const cardLoc = opts.card[0];
  const selCard = getCardAtLocation(fnCtx, cardLoc, opts.card[1].key);

  if (cardLoc !== Location.Hand || 'skills' in selCard) return INVALID_MOVE;

  const levelDecision: Decision = {
    selection: {
      [cardLoc]: [selCard],
    },
    action: 'level',
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [levelDecision], 'level');
  resolveStack(fnCtx);
}

export function activateSkill(fnCtx: FuncContext, opts?: MoveOptions) {
  const { G, ctx } = fnCtx;
  if (!opts || !opts.card) return INVALID_MOVE;

  const card = opts.card;
  const player = G.player[ctx.currentPlayer];
  const cardLoc = card[0];
  const selCard = getLocation(fnCtx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (
    (cardLoc !== Location.Character && cardLoc !== Location.CharAction) ||
    opts.position === undefined ||
    player.activationPos > opts.position
  ) {
    return INVALID_MOVE;
  }

  const skill = 'skills' in selCard ? selCard.skills[opts.position] : selCard.skill;

  if (skill.every((skill) => !meetsSkillReq(skill.requirements, player))) {
    return INVALID_MOVE;
  }

  const prevPos = player.activationPos;
  player.activationPos = opts.position + 1;
  for (const sk of skill) {
    sk.activated = true;
  }

  upsertStack(
    fnCtx,
    skill.map((skill) => parseSkill(fnCtx, skill, selCard, true)),
    'activate',
    prevPos
  );
  resolveStack(fnCtx);
}

export function attack(fnCtx: FuncContext, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  const card = opts.card;
  const cardLoc = card[0];
  const selCard = getLocation(fnCtx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (cardLoc !== Location.Field || !isMonster(selCard) || selCard.attacks <= 0) {
    return INVALID_MOVE;
  }

  const attackDecision: Decision = {
    action: 'attack',
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
      damage: getMonsterAtt(fnCtx, selCard),
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [attackDecision], 'attack');
  resolveStack(fnCtx);
}

export function selectChoice(fnCtx: FuncContext, opts?: MoveOptions) {
  if (!opts || !opts.choice) return INVALID_MOVE;

  makeChoice(fnCtx, opts.choice);
  resolveStack(fnCtx);
}

export function selectTarget(fnCtx: FuncContext, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  selectCard(fnCtx, opts.card);
}

export function confirmSkill(fnCtx: FuncContext, opts?: MoveOptions) {
  resolveStack(fnCtx, { finished: opts?.finished });
}

export function resetStack(fnCtx: FuncContext, _opts?: MoveOptions) {
  resolveStack(fnCtx, { resetStack: true });
}

export function noAttacks(fnCtx: FuncContext, _opts?: MoveOptions) {
  endAttackStage(fnCtx, true);
}

export function noLevel(fnCtx: FuncContext, _opts?: MoveOptions) {
  endLevelStage(fnCtx);
}

export function noActivate(fnCtx: FuncContext, _opts?: MoveOptions) {
  endActivateStage(fnCtx, true);
}

export function nullMove(opts?: MoveOptions) {
  return opts;
}
