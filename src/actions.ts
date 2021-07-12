import { Ctx } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';

import { GameState } from './game';
import {
  CardTypes,
  CardClasses,
  Monster,
  isMonster,
  isCharacter,
  Character,
  NonCharacter,
  SkillRequirements,
} from './card';
import { endAttackStage } from './hook';
import { Selection } from './stack';
import {
  deepCardComp,
  getLocation,
  getLocationCard,
  getOpponentState,
  getOpponentID,
  rmCard,
} from './utils';

export enum Location {
  Field = 'Field',
  Hand = 'Hand',
  Deck = 'Deck',
  CharAction = 'CharAction',
  Character = 'Character',
  OppField = 'OppField',
  OppHand = 'OppHand',
  OppDeck = 'OppDeck',
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
  source?: Character | NonCharacter;
  lifegain?: number;
}

export function checkReqs(reqs: SkillRequirements): (G: GameState, ctx: Ctx) => boolean {
  return (G: GameState, ctx: Ctx) => {
    if (reqs.level < G.player[ctx.currentPlayer].level) return false;

    return true;
  };
}

function quest(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

function play(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || !opts.selection[Location.Hand]) return;

  const player = G.player[ctx.currentPlayer];
  opts.selection[Location.Hand]!.map((card) => {
    player.field.push(card as NonCharacter);
    rmCard(G, ctx, card, Location.Hand);
  });
}

function refresh(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (opts.lifegain == undefined) return;

  G.player[ctx.currentPlayer].hp += opts.lifegain;
}

function destroy(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection) return;

  const player = G.player[ctx.currentPlayer];

  for (const location of Object.keys(opts.selection) as Location[]) {
    const cardsSel = opts.selection[location]!; // .map((card) => {
    getLocation(G, ctx, location)
      .filter((c) => !!cardsSel.find((cs) => deepCardComp(c, cs)))
      .map((card) => {
        player.discard.push(card as NonCharacter);
        rmCard(G, ctx, card, location);
      });
  }
}

function damage(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || opts.damage == undefined) return;

  if (G.stack.currentStage == 'attack') {
    (getLocationCard(G, ctx, Location.Field, opts.source!) as Monster).attacks--;
  }

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      if (isCharacter(card)) {
        getOpponentState(G, ctx).hp -= opts.damage!;
      }
      if (isMonster(card)) {
        getLocation(G, ctx, location)
          .filter((c) => deepCardComp(c, card))
          .map((card) => ((card as Monster).damage += opts.damage!));
      }
    });
  }
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
  damage,
  destroy,
  level,
  play,
  quest,
  refresh,
  shield,
};

export type Action = keyof typeof actions;
