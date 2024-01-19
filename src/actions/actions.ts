import { INVALID_MOVE } from 'boardgame.io/core';

import { FuncContext } from '../game';
import {
  CardClasses,
  Monster,
  isItem,
  isMonster,
  isTactic,
  isCharacter,
  isWarrior,
  NonCharacter,
} from '../card';
import { Choice, Decision, parseSkill, upsertStack } from '../stack';
import {
  deepCardComp,
  getLocation,
  getCardAtLocation,
  getOpponentState,
  getOpponentID,
  getRandomKey,
  rmCard,
  meetsSkillReq,
} from '../utils';
import { pushTriggerStore } from '../trigger';
import { Location } from '../target';

import { ActionOpts } from './types';
import {
  ensureDecision,
  handleAbility,
  handleCardLeaveField,
  resolveDamage,
} from './utils';

function ack(fnCtx: FuncContext, opts: ActionOpts): any {
  if (!fnCtx.G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision || !opts.source) return;

  upsertStack(fnCtx, ensureDecision(opts.dialogDecision, opts.source));
}

function assist(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack || !opts.damage || !opts.source) return;

  const playerState = G.player[opts.source.owner];

  pushTriggerStore(
    fnCtx,
    'MeditationTrigger',
    opts.source,
    { damage: resolveDamage(playerState, opts.damage) },
    { usableTurn: ctx.turn, once: true }
  );
}

function attack(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;

  (getCardAtLocation(G, ctx, Location.Field, opts.source!.key) as Monster).attacks--;

  const decision: Decision = {
    action: 'damage',
    opts,
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [decision]);
}

function bounce(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
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

        handleCardLeaveField(fnCtx, cardLoc, location);
      });
  }
}

function buff(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
  if (!G.stack || !opts.decision || !opts.damage || !opts.source) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.source || !decision.opts.damage)
    return;

  const dmgInc = resolveDamage(G.player[opts.source.owner], opts.damage);
  const decDmg = resolveDamage(
    G.player[decision.opts.source.owner],
    decision.opts.damage
  );

  decision.opts.damage = decDmg + dmgInc;
}

function buffall(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack || !opts.source || !opts.damage) return;

  const playerState = G.player[opts.source.owner];

  pushTriggerStore(
    fnCtx,
    'BuffAllTrigger',
    opts.source,
    { damage: resolveDamage(playerState, opts.damage) },
    { usableTurn: ctx.turn }
  );
}

function conjure(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
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

  if (hasMageLevel) upsertStack(fnCtx, [bounceDec]);
}

function damage(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;
  if (!opts.selection || !opts.source || opts.damage === undefined) return;

  const sourceState = G.player[opts.source.owner];
  const damage = resolveDamage(sourceState, opts.damage);

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      if (isCharacter(card)) {
        G.player[card.owner].hp -= damage;
      }

      if (isMonster(card)) {
        (getCardAtLocation(G, ctx, location, card.key) as Monster).damageTaken += damage;
      }
    });
  }
}

function destroy(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;
  if (!opts.selection) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    const cardsSel = opts.selection[location] || [];

    getLocation(G, ctx, location)
      .filter((c) => !!cardsSel.find((cs) => deepCardComp(c, cs)))
      .map((card) => {
        G.player[card.owner].discard.push(card as NonCharacter);

        handleCardLeaveField(fnCtx, card as NonCharacter, location);
      });
  }
}

function discard(fnCtx: FuncContext, opts: ActionOpts): any {
  destroy(fnCtx, opts);
}

function drinkpotion(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
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

  upsertStack(fnCtx, [healDec]);
}

const flip = (fnCtx: FuncContext, opts: ActionOpts) => {
  const { G, random } = fnCtx;

  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.source || !opts.dialogDecision) return;

  const flippedCoin = random.Die(2) == 1 ? Choice.Heads : Choice.Tails;
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

  upsertStack(fnCtx, [ackDec]);
};

function level(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;

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

      const oneshot = selCard.skill.some(
        (skill) => skill.requirements.oneshot && meetsSkillReq(skill.requirements, player)
      );
      if (oneshot) {
        selCard.skill.map((sk, idx) => {
          sk.activated = true;
          if (idx === 0) {
            upsertStack(fnCtx, [parseSkill(fnCtx, sk, card)]);
          } else {
            G.stack!.queuedDecisions.push(parseSkill(fnCtx, sk, card));
          }
        });
      }

      player.learnedSkills.push({ ...selCard });

      rmCard(G, ctx, selCard, location);

      player.level += 10;
      dec.push(refreshDec(selCard));
    });
  }

  upsertStack(fnCtx, dec);
}

function loot(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;

  const oppState = getOpponentState(G, ctx);
  if (oppState.hand.length < 3) return;

  const discardDecision: Decision = {
    action: 'discard',
    dialogPrompt: 'Discard a card',
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

  upsertStack(fnCtx, [discardDecision]);
}

function nomercy(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;

  const source = opts.source as NonCharacter;
  if (!opts.selection || opts.damage == undefined || !source) return;

  pushTriggerStore(fnCtx, 'NoMercyTrigger', source, undefined, {
    usableTurn: ctx.turn,
  });

  const decision: Decision = {
    action: 'damage',
    opts,
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [decision]);
}

function noop(_fnCtx: FuncContext, _opts: ActionOpts): any {
  return;
}

function optional(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;
  if (!opts.choiceSelection || !opts.dialogDecision || !opts.source) return;

  if (opts.choiceSelection !== Choice.Yes) return;

  const trigger = G.triggers.filter((trigger) => trigger.key === opts.triggerKey)[0];
  if (trigger?.lifetime?.turn !== undefined) trigger.lifetime.turn = ctx.turn + 1;

  upsertStack(fnCtx, ensureDecision(opts.dialogDecision, opts.source));
}

function play(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;
  if (!opts.selection) return;

  const playerID = opts.source?.owner ? opts.source.owner : ctx.currentPlayer;
  const player = G.player[playerID];
  const locations = Object.keys(opts.selection) as Location[];

  locations.forEach((location) => {
    if (!opts.selection![location]) return;

    opts.selection![location]!.map((card) => {
      if (isMonster(card) || isItem(card)) {
        card.turnETB = ctx.turn;
        player.field.push(card);
        handleAbility(fnCtx, card);
      } else if (isTactic(card)) {
        if (!card.ability.skills || card.ability.skills.length <= 0) {
          player.discard.push(card);
        } else {
          player.temporary.push(card);
        }

        handleAbility(fnCtx, card);
      }

      rmCard(G, ctx, card, location);
    });
  });
}

// TODO: generalize to card from any location (incl temp zone)?
function putIntoHand(fnCtx: FuncContext, opts: ActionOpts): any {
  quest(fnCtx, opts);
}

function putIntoPlay(fnCtx: FuncContext, opts: ActionOpts): any {
  play(fnCtx, opts);
}

function quest(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  const owner = opts.source ? opts.source.owner : ctx.currentPlayer;
  const player = G.player[owner];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.hand.push(player.deck.shift()!);
}

function rainofarrows(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack || !opts.source || !opts.damage) return;

  const oppCards = getOpponentState(G, ctx, opts.source.owner).hand.length;
  const damage = resolveDamage(G.player[opts.source.owner], opts.damage);

  const decision: Decision = {
    action: 'damage',
    opts: {
      ...opts,
      damage: oppCards * damage,
    },
    selection: { ...opts.selection } || {},
    finished: false,
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [decision]);
}

function refresh(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
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

function replacement(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
  if (!G.stack || !opts.decision) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision) return;

  decision.action = 'noop';
}

function revealDeck(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
  if (!G.stack || !opts.source) return;

  const id = opts.source.owner;

  G.player[id].deck = G.player[id].deck.map((card) => {
    return { ...card, reveal: card.reveal ? card.reveal.concat(id) : [id] };
  });
}

function roar(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
  if (!G.stack || !opts.source || !opts.damage) return;

  const playerField = G.player[opts.source.owner].field;
  const numMonsters = playerField.filter((card) => isMonster(card)).length;

  const damage = resolveDamage(G.player[opts.source.owner], opts.damage);

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

  upsertStack(fnCtx, [decision]);
}

function scout(fnCtx: FuncContext, _opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  const player = G.player[ctx.currentPlayer];

  if (player.deck.length <= 0) return INVALID_MOVE;

  player.deck[0].reveal = Object.keys(G.player);
  if (isMonster(player.deck[0])) player.hand.push(player.deck.shift()!);
}

function shuffle(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx, random } = fnCtx;
  const id = opts.source ? opts.source.owner : ctx.currentPlayer;
  const deck = G.player[id].deck;

  deck.map((card) => {
    if (card.reveal) card.reveal = undefined;
  });

  G.player[id].deck = random.Shuffle(deck);
}

function seer(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
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

  upsertStack(fnCtx, [seerChoiceDec]);
}

function seerChoice(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
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
function shield(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack || !opts.decision) return;
  const validLocations = [Location.OppCharacter, Location.Character];

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage || !decision.opts.source)
    return;

  const selectionLocations = Object.keys(decision.selection) as Location[];
  const selectedChars = selectionLocations
    .map((loc) => (validLocations.includes(loc) ? decision.selection[loc] : []))
    .flat();
  const owner = selectedChars[0] ? selectedChars[0].owner : getOpponentID(G, ctx);

  const numMonsters = G.player[owner].field.filter((card) => isMonster(card)).length;

  const decDmg = resolveDamage(
    G.player[decision.opts.source.owner],
    decision.opts.damage
  );

  decision.opts.damage = decDmg - numMonsters * 10;
  if (decision.opts.damage < 0) decision.opts.damage = 0;
}

function tough(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G } = fnCtx;
  if (!G.stack || !opts.decision) return;

  const decision = G.stack.decisions.filter((dec) => dec.key === opts.decision)[0];
  if (!decision || !decision.opts || !decision.opts.damage) return;

  decision.opts.damage = undefined;
}

function steadyhand(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;

  const source = opts.source as NonCharacter;
  const level = G.player[source.owner].level;
  if (!source || level < 50) return;

  pushTriggerStore(fnCtx, 'SteadyHandTrigger', source, undefined, {
    usableTurn: ctx.turn,
  });
}

// TODO: extend interactive options for no level option
function trainhard(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
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
      ...opts,
      dialogDecision: [levelDec],
    },
    noReset: true,
    dialogPrompt: 'Would you like to level up?',
    choice: [Choice.Yes, Choice.No],
    key: getRandomKey(),
  };

  upsertStack(fnCtx, [optDec]);
}

function tuck(fnCtx: FuncContext, opts: ActionOpts): any {
  const { G, ctx } = fnCtx;
  if (!G.stack) return;
  if (!opts.selection || !opts.position) return;

  for (const location of Object.keys(opts.selection) as Location[]) {
    opts.selection[location]!.map((card) => {
      const cardLoc = getCardAtLocation(G, ctx, location, card.key) as NonCharacter;
      cardLoc.reveal = Object.keys(G.player);

      G.player[card.owner].deck.splice(opts.position!, 0, cardLoc);

      handleCardLeaveField(fnCtx, cardLoc, location);
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
