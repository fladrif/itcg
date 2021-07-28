import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from '../game';
import {
  CardTypes,
  CardClasses,
  Monster,
  isItem,
  isMonster,
  isTactic,
  isCharacter,
  Character,
  NonCharacter,
  SkillRequirements,
} from '../card';
import { Selection } from '../stack';
import {
  deepCardComp,
  getLocation,
  getCardAtLocation,
  getOpponentState,
  getOpponentID,
  rmCard,
} from '../utils';

import { handleAbility, handleCardLeaveField } from './utils';

// TODO: possible refactor, this is always relative to currentPlayer; sometimes needs to be relative to card owner or other context
export enum Location {
  Field = 'Field',
  Hand = 'Hand',
  Deck = 'Deck',
  Discard = 'Discard',
  CharAction = 'CharAction',
  Character = 'Character',
  OppField = 'OppField',
  OppHand = 'OppHand',
  OppDeck = 'OppDeck',
  OppDiscard = 'OppDiscard',
  OppCharAction = 'OppCharAction',
  OppCharacter = 'OppCharacter',
}

export type LevelSelector = number | 'CurrentLevel';

export interface TargetFilter {
  location: Location;
  quantity: number;
  quantityUpTo?: boolean;
  level?: LevelSelector;
  type?: CardTypes;
  class?: CardClasses[];

  and?: never;
  xor?: never;
}

interface AndActionTarget {
  and: ActionTargets[];
  xor?: never;
}
interface XorActionTarget {
  xor: ActionTargets[];
  and?: never;
}

export type ActionTargets = TargetFilter | AndActionTarget | XorActionTarget;

// TODO: split into opts for ea action, wrap up into ActionOpts
export interface ActionOpts {
  damage?: number;
  selection?: Selection;
  decision?: string;
  position?: number;
  source?: Character | NonCharacter;
  lifegain?: number;
}

export function isOpponentAction(target: ActionTargets): boolean {
  if ('location' in target) return target.location === Location.OppHand;

  if ('and' in target) return target.and!.some((tar) => isOpponentAction(tar));

  if ('xor' in target) return target.xor!.some((tar) => isOpponentAction(tar));

  throw new Error(`Filter composed incorrectly: ${target}`);
}

export function checkReqs(reqs: SkillRequirements): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

function bounce(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    const cardsSel = opts.selection[location] || [];

    getLocation(G, ctx, location)
      .filter((c) => !!cardsSel.find((cs) => deepCardComp(c, cs)))
      .map((card) => {
        const cardLoc = card as NonCharacter;
        cardLoc.reveal = true;

        G.player[card.owner].hand.push(cardLoc);

        handleCardLeaveField(G, ctx, cardLoc, location);
      });
  }
}

function damage(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || opts.damage == undefined) return;

  if (G.stack.currentStage == 'attack') {
    (getCardAtLocation(G, ctx, Location.Field, opts.source!.key) as Monster).attacks--;
  }

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      if (isCharacter(card)) {
        getOpponentState(G, ctx).hp -= opts.damage!;
      }
      if (isMonster(card)) {
        getLocation(G, ctx, location)
          .filter((c) => deepCardComp(c, card))
          .map((card) => ((card as Monster).damageTaken += opts.damage!));
      }
    });
  }
}

function destroy(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    const cardsSel = opts.selection[location] || [];

    getLocation(G, ctx, location)
      .filter((c) => !!cardsSel.find((cs) => deepCardComp(c, cs)))
      .map((card) => {
        G.player[card.owner].discard.push(card as NonCharacter);

        handleCardLeaveField(G, ctx, card as NonCharacter, location);
      });
  }
}

function discard(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  destroy(G, ctx, opts);
}

// TODO: Genericize, shouldn't be only current player to draw
function quest(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

// TODO: extend to play cards from top of deck
function play(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || !opts.selection[Location.Hand]) return;

  const player = G.player[ctx.currentPlayer];

  opts.selection[Location.Hand]!.map((card) => {
    if (isMonster(card) || isItem(card)) {
      player.field.push(card);
      handleAbility(G, ctx, card);
    } else if (isTactic(card)) {
      player.discard.push(card);
      handleAbility(G, ctx, card);
    }

    rmCard(G, ctx, card, Location.Hand);
  });
}

function refresh(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (opts.lifegain == undefined) return;

  G.player[ctx.currentPlayer].hp += opts.lifegain;
}

function shield(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.decision) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage) return;

  // TODO: ensure getOpponentID of current player is correct, probably better to check decision's target and calculate # of monsters of player being targeted
  const numMonsters = G.player[getOpponentID(G, ctx)].field.filter((card) =>
    isMonster(card)
  ).length;

  decision.opts.damage -= numMonsters * 10;
  if (decision.opts.damage < 0) decision.opts.damage = 0;
}

function scout(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.deck[0].reveal = true;
  if (isMonster(player.deck[0])) player.hand.push(player.deck.shift()!);
}

function shuffle(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const id = ctx.currentPlayer;
  const deck = G.player[id].deck;

  deck.map((card) => {
    if (card.reveal) card.reveal = false;
  });

  G.player[id].deck = ctx.random!.Shuffle!(deck);
}

function tuck(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || !opts.position) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      const cardLoc = getCardAtLocation(G, ctx, location, card.key) as NonCharacter;
      cardLoc.reveal = true;

      G.player[card.owner].deck.splice(opts.position!, 0, cardLoc);

      handleCardLeaveField(G, ctx, cardLoc, location);
    });
  }
}

function level(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection) return;

  const player = G.player[ctx.currentPlayer];

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      const selCard = card as NonCharacter;

      const turn = selCard.skill.requirements.turn !== undefined ? ctx.turn : undefined;

      player.learnedSkills.push({
        ...selCard,
        skill: {
          ...selCard.skill,
          requirements: { ...selCard.skill.requirements, turn },
        },
      });

      rmCard(G, ctx, selCard, location);

      // TODO: May want to consider handling level elsewhere, or determining it jit, (consider destroying cards under character)
      player.level += 10;
      player.hp += 20;
    });
  }
}

export const actions = {
  bounce,
  damage,
  destroy,
  discard,
  level,
  play,
  quest,
  refresh,
  scout,
  shield,
  shuffle,
  tuck,
};

export type Action = keyof typeof actions;
