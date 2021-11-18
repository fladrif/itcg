import { Ctx, PlayerID } from 'boardgame.io';
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
import { pushTriggerStore } from '../trigger';
import { Location } from '../target';

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
  dialogDecision?: Decision[];
  /**
   * Should refresh increase hp over starting total. Defaults true if undef
   */
  overheal?: boolean;
  /**
   * Which player decision belongs to
   */
  activePlayer?: PlayerID;
}

function ack(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision) return;

  upsertStack(G, ctx, opts.dialogDecision);
}

function assist(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.damage || !opts.source) return;

  pushTriggerStore(
    G,
    ctx,
    'MeditationTrigger',
    opts.source,
    { damage: opts.damage },
    { usableTurn: ctx.turn, once: true }
  );
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
        cardLoc.reveal = Object.keys(G.player);

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

function buffall(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.source || !opts.damage) return;

  pushTriggerStore(
    G,
    ctx,
    'BuffAllTrigger',
    opts.source,
    { damage: opts.damage },
    { usableTurn: ctx.turn }
  );
}

function conjure(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.source) return;

  const bounceDec: Decision = {
    action: 'bounce',
    opts,
    noReset: true,
    selection: {},
    target: {
      class: [CardClasses.Magician],
      location: Location.CharAction,
      quantity: 1,
      excludeCardKey: [opts.source.key],
    },
    finished: false,
    key: getRandomKey(),
  };

  const hasMageLevel =
    G.player[opts.source.owner].learnedSkills.filter(
      (card) => card.class === CardClasses.Magician
    ).length >= 2;

  if (hasMageLevel) upsertStack(G, ctx, [bounceDec]);
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
      dialogDecision: didWin ? [dmgDec] : undefined,
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

function flip(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.source || !opts.dialogDecision) return;

  const flippedCoin = ctx.random!.Die(2) == 1 ? Choice.Heads : Choice.Tails;
  const didWin = flippedCoin === opts.choiceSelection;

  const ackDec: Decision = {
    action: 'ack',
    noReset: true,
    opts: {
      ...opts,
      dialogDecision: didWin ? opts.dialogDecision : undefined,
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
function level(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.selection) return;

  const dec: Decision[] = [];

  const refreshDec: (card: NonCharacter) => Decision = (card) => {
    return {
      action: 'refresh',
      selection: {},
      finished: false,
      opts: {
        lifegain: 20,
        source: card,
      },
      key: getRandomKey(),
    };
  };

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

      player.level += 10;
      dec.push(refreshDec(selCard));
    });
  }

  upsertStack(G, ctx, dec);
}

function loot(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;

  const oppState = getOpponentState(G, ctx);
  if (oppState.hand.length < 3) return;

  const discardDecision: Decision = {
    action: 'discard',
    key: getRandomKey(),
    finished: false,
    target: {
      location: Location.OppHand,
      quantity: 1,
    },
    selection: {},
    noReset: true,
    opts,
  };

  upsertStack(G, ctx, [discardDecision]);
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

function noop(_G: GameState, _ctx: Ctx, _opts: ActionOpts): any {
  return;
}

function optional(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision) return;

  if (opts.choiceSelection !== Choice.Yes) return;

  const trigger = G.triggers.filter((trigger) => trigger.key === opts.triggerKey)[0];
  if (trigger?.lifetime?.turn !== undefined) trigger.lifetime.turn = ctx.turn + 1;

  upsertStack(G, ctx, opts.dialogDecision);
}

function play(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack) return;
  if (!opts.selection) return;

  const player = G.player[ctx.currentPlayer];
  const locations = Object.keys(opts.selection) as Location[];

  locations.forEach((location) => {
    if (!opts.selection![location]) return;

    opts.selection![location]!.map((card) => {
      if (isMonster(card) || isItem(card)) {
        card.turnETB = ctx.turn;
        player.field.push(card);
        handleAbility(G, ctx, card);
      } else if (isTactic(card)) {
        if (!card.ability.skills || card.ability.skills.length <= 0) {
          player.discard.push(card);
        } else {
          player.temporary.push(card);
        }

        handleAbility(G, ctx, card);
      }

      rmCard(G, ctx, card, location);
    });
  });
}

// TODO: generalize to card from any location (incl temp zone)?
function putIntoHand(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  quest(G, ctx, opts);
}

function putIntoPlay(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  play(G, ctx, opts);
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

  const player = opts.source?.owner ? opts.source.owner : ctx.currentPlayer;
  const doNotOverheal = opts.overheal !== undefined && opts.overheal === false;

  const curHP = G.player[player].hp;
  const maxHP = G.player[player].maxHP;
  const willOverheal = curHP + opts.lifegain > maxHP;

  if (doNotOverheal && willOverheal) {
    return (G.player[player].hp = curHP > maxHP ? curHP : maxHP);
  }

  G.player[player].hp += opts.lifegain;
}

function replacement(G: GameState, _ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.decision) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision) return;

  decision.action = 'noop';
}

function revealDeck(G: GameState, _ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.source) return;

  const id = opts.source.owner;

  G.player[id].deck = G.player[id].deck.map((card) => {
    return { ...card, reveal: card.reveal ? card.reveal.concat(id) : [id] };
  });
}

function roar(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.source) return;

  const playerField = G.player[opts.source.owner].field;
  const numMonsters = playerField.filter((card) => isMonster(card)).length;

  const damage = opts.damage ? opts.damage : 0;

  const decision: Decision = {
    action: 'damage',
    opts: {
      ...opts,
      damage: numMonsters * damage,
    },
    selection: { ...opts.selection },
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [decision]);
}

function scout(G: GameState, ctx: Ctx, _opts: ActionOpts): any {
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.deck[0].reveal = Object.keys(G.player);
  if (isMonster(player.deck[0])) player.hand.push(player.deck.shift()!);
}

function shuffle(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  const id = opts.source ? opts.source.owner : ctx.currentPlayer;
  const deck = G.player[id].deck;

  deck.map((card) => {
    if (card.reveal) card.reveal = undefined;
  });

  G.player[id].deck = ctx.random!.Shuffle!(deck);
}

function seer(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.source) return;

  const playerID = opts.source.owner;
  const state = G.player[playerID];

  if (state.deck.length == 0) return;

  if (state.deck.length <= 2) {
    state.deck[0].reveal = [playerID];
  } else {
    state.deck[0].reveal = [playerID];
    state.deck[1].reveal = [playerID];
  }

  const seerChoiceDec: Decision = {
    action: 'seerChoice',
    finished: false,
    selection: {},
    noReset: true,
    target: {
      location: playerID === ctx.currentPlayer ? Location.Deck : Location.OppDeck,
      quantity: 1,
    },
    opts: {
      ...opts,
      activePlayer: playerID,
    },
    key: getRandomKey(),
  };

  upsertStack(G, ctx, [seerChoiceDec]);
}

function seerChoice(G: GameState, ctx: Ctx, opts: ActionOpts): any {
  if (!G.stack || !opts.selection) return;

  const locations = [Location.Deck, Location.OppDeck];
  locations.forEach((location) => {
    !!opts.selection![location] &&
      opts.selection![location]!.forEach((card) => {
        const realCard = getCardAtLocation(G, ctx, location, card.key);

        G.player[card.owner].hand.push(realCard as NonCharacter);
        rmCard(G, ctx, card, location);

        if (G.player[card.owner].deck.length >= 1) {
          G.player[card.owner].discard.push(G.player[card.owner].deck.shift()!);
        }
      });
  });
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
      dialogDecision: [levelDec],
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
      cardLoc.reveal = Object.keys(G.player);

      G.player[card.owner].deck.splice(opts.position!, 0, cardLoc);

      handleCardLeaveField(G, ctx, cardLoc, location);
    });
  }
}

export const actions = {
  ack,
  assist,
  attack,
  bounce,
  buff,
  buffall,
  conjure,
  criticalshot,
  damage,
  destroy,
  discard,
  drinkpotion,
  flip,
  level,
  loot,
  nomercy,
  noop,
  optional,
  play,
  putIntoPlay,
  putIntoHand,
  quest,
  rainofarrows,
  refresh,
  replacement,
  revealDeck,
  roar,
  scout,
  seer,
  seerChoice,
  shield,
  shuffle,
  steadyhand,
  tough,
  trainhard,
  tuck,
};

export type Action = keyof typeof actions;

export * from './utils';
