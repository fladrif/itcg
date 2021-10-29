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
import { Choice, Decision, Selection, parseSkill, upsertStack } from '../stack';
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
import { pushTriggerStore } from '../triggerStore';

// TODO: possible refactor, this is always relative to currentPlayer; sometimes needs to be relative to card owner or other context
// edit: or fine as is and handle relativity elsewhere
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
  choiceSelection?: Choice;
  decision?: string;
  position?: number;
  source?: Character | NonCharacter;
  triggerKey?: string;
  /**
   * Amount to regain hp. Used with refresh action
   */
  lifegain?: number;
  dialogDecision?: Decision;
  /**
   * Should refresh increase hp over starting total. Defaults true if undef
   */
  overheal?: boolean;
}

function ack(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision) return;

  upsertStack(G, ctx, [opts.dialogDecision]);
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

function buff(G: GameState, _ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.decision || !opts.damage) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage) return;

  decision.opts.damage += opts.damage;
}

function criticalshot(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.source) return;

  const flippedCoin = ctx.random!.Die(2) == 1 ? Choice.Heads : Choice.Tails;
  const didWin = flippedCoin === opts.choiceSelection;

  const dmgDec: Decision = {
    action: 'damage',
    opts: {
      ...opts,
      damage: G.player[opts.source.owner].level,
    },
    noReset: true,
    selection: {},
    target: {
      xor: [
        {
          type: CardTypes.Monster,
          location: Location.OppField,
          quantity: 1,
        },
        {
          type: CardTypes.Character,
          location: Location.OppCharacter,
          quantity: 1,
        },
      ],
    },
    finished: false,
    key: getRandomKey(),
  };

  const ackDec: Decision = {
    action: 'ack',
    noReset: true,
    opts: {
      ...opts,
      dialogDecision: didWin ? dmgDec : undefined,
    },
    dialogPrompt: didWin
      ? `${flippedCoin}, you won the flip!`
      : `${flippedCoin}, you lost the flip..`,
    choice: [Choice.Ack],
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [ackDec]);
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

function drinkpotion(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.source) return;

  const healDec: Decision = {
    action: 'refresh',
    opts: {
      ...opts,
      lifegain: G.player[opts.source.owner].level,
    },
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [healDec]);
}

function level(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.selection) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      // Iterate over all cards in selection

      const player = G.player[card.owner];
      const selCard = card as NonCharacter; // uses copy of card as canonical

      const oneshot = selCard.skill.some((skill) => skill.requirements.oneshot);
      if (oneshot) {
        upsertStack(
          G,
          ctx,
          selCard.skill.map((skill) => parseSkill(skill, selCard))
        );
      }

      player.learnedSkills.push({ ...selCard });

      rmCard(G, ctx, selCard, location);

      // TODO: May want to consider handling level elsewhere, or determining it jit, (consider destroying cards under character)
      player.level += 10;
      player.hp += 20;
    });
  }
}

function nomercy(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;

  const source = opts.source as NonCharacter;
  if (!opts.selection || opts.damage == undefined || !source) return;

  pushTriggerStore(G, ctx, 'NoMercyTrigger', source, undefined, {
    usableTurn: ctx.turn,
  });

  const decision: Decision = {
    action: 'damage',
    opts,
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [decision]);
}

function optional(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision) return;

  if (opts.choiceSelection !== Choice.Yes) return;

  const trigger = G.triggers.filter((trigger) => trigger.key === opts.triggerKey)[0];
  if (trigger?.lifetime?.turn !== undefined) trigger.lifetime.turn = ctx.turn + 1;

  upsertStack(G, ctx, [opts.dialogDecision]);
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
      // TODO: move to temporary zone first
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

  const doNotOverheal = opts.overheal !== undefined && opts.overheal === false;

  const maxHP = G.player[ctx.currentPlayer].maxHP;
  const willOverheal = G.player[ctx.currentPlayer].hp + opts.lifegain > maxHP;

  if (doNotOverheal && willOverheal) return (G.player[ctx.currentPlayer].hp = maxHP);

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

function steadyhand(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;

  const level = G.player[ctx.currentPlayer].level;
  const source = opts.source as NonCharacter;
  if (!source || level < 50) return;

  pushTriggerStore(G, ctx, 'SteadyHandTrigger', source, undefined, {
    usableTurn: ctx.turn,
  });
}

// TODO: extend interactive options for no level option
function trainhard(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;

  const warriorSkills = G.player[ctx.currentPlayer].learnedSkills.filter((card) =>
    isWarrior(card)
  );
  const handSize = G.player[ctx.currentPlayer].hand.length;
  if (warriorSkills.length < 3 || handSize <= 0) return;

  const levelDec: Decision = {
    action: 'level',
    target: {
      location: Location.Hand,
      quantity: 1,
    },
    noReset: true,
    selection: {},
    finished: false,
    key: getRandomKey(),
  };

  const optDec: Decision = {
    action: 'optional',
    selection: {},
    finished: false,
    opts: {
      dialogDecision: levelDec,
      ...opts,
    },
    noReset: true,
    dialogPrompt: 'Would you like to level up?',
    choice: [Choice.Yes, Choice.No],
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [optDec]);
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
  ack,
  attack,
  bounce,
  buff,
  criticalshot,
  damage,
  destroy,
  discard,
  drinkpotion,
  level,
  nomercy,
  optional,
  play,
  quest,
  rainofarrows,
  refresh,
  scout,
  shield,
  shuffle,
  steadyhand,
  tough,
  trainhard,
  tuck,
};

export type Action = keyof typeof actions;

export * from './utils';
