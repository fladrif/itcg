import { Move, PlayerID } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { FuncContext, GameState } from './game';
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
import {
  deepCardComp,
  getCardAtLocation,
  getLocation,
  getOpponentID,
  getRandomKey,
  passSkillReqToActivate,
} from './utils';
import { Location } from './target';
import { skillDict } from './skill';

export interface MoveOptions {
  card?: [Location, Character | NonCharacter];
  choice?: Choice;
  position?: number;
  finished?: boolean;
  playerConcession?: PlayerID;
}

export const concede: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  const { G, ctx, events } = fnCtx;
  if (!opts || !opts.playerConcession) return INVALID_MOVE;

  events.endGame({ winner: getOpponentID(G, ctx, opts?.playerConcession) });
};

export const levelUp: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  const { G, ctx } = fnCtx;
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

  upsertStack(fnCtx, [levelDecision], 'level');
  resolveStack(fnCtx);
};

export const activateSkill: Move<GameState> = (
  fnCtx: FuncContext,
  opts?: MoveOptions
) => {
  const { G, ctx } = fnCtx;
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

  const skillRef = 'skills' in selCard ? selCard.skills[opts.position] : selCard.skill;
  const skill = skillDict[skillRef.name];

  if (skill.every((skill) => !passSkillReqToActivate(skill.requirements, player))) {
    return INVALID_MOVE;
  }

  const prevPos = player.activationPos;
  player.activationPos = opts.position + 1;
  skillRef.activated = true;

  skill.forEach((sk, idx) => {
    if (idx === 0) {
      upsertStack(fnCtx, [parseSkill(fnCtx, sk, selCard, true)], 'activate', prevPos);
    } else {
      G.stack!.queuedDecisions.push(parseSkill(fnCtx, sk, selCard, true));
    }
  });
  resolveStack(fnCtx);
};

export const attack: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  const { G, ctx } = fnCtx;
  if (!opts || !opts.card) return INVALID_MOVE;

  const card = opts.card;
  const cardLoc = card[0];
  const selCard = getLocation(G, ctx, cardLoc).filter((c) => deepCardComp(c, card[1]))[0];

  if (cardLoc !== Location.Field || !isMonster(selCard) || selCard.attacks <= 0) {
    return INVALID_MOVE;
  }

  const attackDecision: Decision = {
    action: 'attack',
    dialogPrompt: 'Choose an attack target',
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
      damage: 0,
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [attackDecision], 'attack');
  resolveStack(fnCtx);
};

export const selectChoice: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  if (!opts || !opts.choice) return INVALID_MOVE;

  makeChoice(fnCtx, opts.choice);
  resolveStack(fnCtx);
};

export const selectTarget: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  if (!opts || !opts.card) return INVALID_MOVE;

  selectCard(fnCtx, opts.card);
};

export const confirmSkill: Move<GameState> = (fnCtx: FuncContext, opts?: MoveOptions) => {
  resolveStack(fnCtx, { finished: opts?.finished });
};

export const resetStack: Move<GameState> = (fnCtx: FuncContext, _opts?: MoveOptions) => {
  resolveStack(fnCtx, { resetStack: true });
};

export const noAttacks: Move<GameState> = (fnCtx: FuncContext, _opts?: MoveOptions) => {
  endAttackStage(fnCtx, true);
};

export const noLevel: Move<GameState> = (fnCtx: FuncContext, _opts?: MoveOptions) => {
  endLevelStage(fnCtx);
};

export const noActivate: Move<GameState> = (fnCtx: FuncContext, _opts?: MoveOptions) => {
  endActivateStage(fnCtx, true);
};

export function nullMove(opts?: MoveOptions) {
  return opts;
}
