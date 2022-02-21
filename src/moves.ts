import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
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

export const levelUp = {
  move: levelUpMove,
  client: false,
};

function levelUpMove(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  const cardLoc = opts.card[0];
  const selCard = getCardAtLocation(G, ctx, cardLoc, opts.card[1].key);

  if (cardLoc !== Location.Hand || 'skills' in selCard) return INVALID_MOVE;

  const levelDecision: Decision = {
    selection: {
      [cardLoc]: [selCard],
    },
    action: 'level',
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [levelDecision], 'level');
  resolveStack(G, ctx);
}

export const activateSkill = {
  move: activateSkillMove,
  client: false,
};

function activateSkillMove(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  const card = opts.card;
  const player = G.player[ctx.currentPlayer];
  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

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
    G,
    ctx,
    skill.map((skill) => parseSkill(G, ctx, skill, selCard, true)),
    'activate',
    prevPos
  );
  resolveStack(G, ctx);
}

export const attack = {
  move: attackMove,
  client: false,
};

function attackMove(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  const card = opts.card;
  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

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
      damage: getMonsterAtt(G, ctx, selCard),
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [attackDecision], 'attack');
  resolveStack(G, ctx);
}

export const selectChoice = {
  move: selectChoiceMove,
  client: false,
};

function selectChoiceMove(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  if (!opts || !opts.choice) return INVALID_MOVE;

  makeChoice(G, ctx, opts.choice);
  resolveStack(G, ctx);
}

export const confirmSkill = {
  move: confirmSkillMove,
  client: false,
};

function confirmSkillMove(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  resolveStack(G, ctx, { finished: opts?.finished });
}

export function selectTarget(G: GameState, ctx: Ctx, opts?: MoveOptions) {
  if (!opts || !opts.card) return INVALID_MOVE;

  selectCard(G, ctx, opts.card);
}

export function resetStack(G: GameState, ctx: Ctx, _opts?: MoveOptions) {
  resolveStack(G, ctx, { resetStack: true });
}

export function noAttacks(G: GameState, ctx: Ctx, _opts?: MoveOptions) {
  endAttackStage(G, ctx, true);
}

export function noLevel(G: GameState, ctx: Ctx, _opts?: MoveOptions) {
  endLevelStage(G, ctx);
}

export function noActivate(G: GameState, ctx: Ctx, _opts?: MoveOptions) {
  endActivateStage(G, ctx, true);
}

export function nullMove(opts?: MoveOptions) {
  return opts;
}
