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
  isWarrior,
  Character,
  NonCharacter,
} from '../card';
import { Decision, Selection, parseSkill, upsertStack } from '../stack';
import {
  deepCardComp,
  getLocation,
  getCardAtLocation,
  getOpponentState,
  getOpponentID,
  getRandomKey,
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

function attack(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;

  (getCardAtLocation(G, ctx, Location.Field, opts.source!.key) as Monster).attacks--;

  const decision: Decision = {
    action: 'damage',
    opts,
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [decision]);
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

function level(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.selection) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      const player = G.player[card.owner];
      const selCard = card as NonCharacter;

      const oneshot = selCard.skill.requirements.oneshot;
      if (oneshot) upsertStack(G, ctx, [parseSkill(selCard.skill, selCard)]);

      player.learnedSkills.push({
        ...selCard,
        skill: {
          ...selCard.skill,
          requirements: { ...selCard.skill.requirements, oneshot },
        },
      });

      rmCard(G, ctx, selCard, location);

      // TODO: May want to consider handling level elsewhere, or determining it jit, (consider destroying cards under character)
      player.level += 10;
      player.hp += 20;
    });
  }
}

// TODO: extend to play cards from top of deck
function play(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection || !opts.selection[Location.Hand]) return;

  const player = G.player[ctx.currentPlayer];

  opts.selection[Location.Hand]!.map((card) => {
    if (isMonster(card) || isItem(card)) {
      card.turnETB = ctx.turn;
      player.field.push(card);
      handleAbility(G, ctx, card);
    } else if (isTactic(card)) {
      player.discard.push(card);
      handleAbility(G, ctx, card);
    }

    rmCard(G, ctx, card, Location.Hand);
  });
}

function quest(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  const owner = opts.source ? opts.source.owner : ctx.currentPlayer;
  const player = G.player[owner];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

function rainofarrows(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.source || !opts.damage) return;

  const oppCards = getOpponentState(G, ctx, opts.source.owner).hand.length;

  const decision: Decision = {
    action: 'damage',
    opts: {
      damage: oppCards * opts.damage!,
    },
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [decision]);
}

function refresh(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (opts.lifegain == undefined) return;

  G.player[ctx.currentPlayer].hp += opts.lifegain;
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

// TODO: take into account shield abilities
function shield(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.decision) return;
  const validLocations = [Location.OppCharacter, Location.Character];

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage) return;

  const selectionLocations = Object.keys(decision.selection) as Location[];
  const selectedChars = selectionLocations
    .map((loc) => (validLocations.includes(loc) ? decision.selection[loc] : []))
    .flat();
  const owner = selectedChars[0] ? selectedChars[0].owner : getOpponentID(G, ctx);

  const numMonsters = G.player[owner].field.filter((card) => isMonster(card)).length;

  decision.opts.damage -= numMonsters * 10;
  if (decision.opts.damage < 0) decision.opts.damage = 0;
}

function tough(G: GameState, _ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.decision) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage) return;

  decision.opts.damage = undefined;
}

// TODO: extend interactive options for no level option
function trainhard(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  if (!G.stack) return;

  const warriorSkills = G.player[ctx.currentPlayer].learnedSkills.filter((card) =>
    isWarrior(card)
  );
  if (warriorSkills.length < 3) return;

  const decision: Decision = {
    action: 'level',
    target: {
      location: Location.Hand,
      quantity: 1,
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [decision]);
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

export const actions = {
  attack,
  bounce,
  damage,
  destroy,
  discard,
  level,
  play,
  quest,
  rainofarrows,
  refresh,
  scout,
  shield,
  shuffle,
  tough,
  trainhard,
  tuck,
};

export type Action = keyof typeof actions;

export * from './utils';
