import { Ctx, PlayerID } from 'boardgame.io';

import { GameState } from './game';
import { Action, Location } from './actions';
import { isMonster, CardTypes, Monster, NonCharacter } from './card';
import { Choice, Decision } from './stack';
import { getMonsterHealth } from './state';
import {
  deepCardComp,
  getCardLocation,
  getCardAtLocation,
  getLocation,
  getOpponentID,
  getOpponentState,
  getRandomKey,
} from './utils';

export type TriggerOwner = PlayerID | 'Global';
export type TriggerPrepostion = 'Before' | 'After';

export interface TriggerStore {
  name: TriggerNames;
  key: string;
  owner: PlayerID;
  cardOwner: string;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;
}

// TODO: dd & merge triggeroptions and triggerlifetime
export interface TriggerOptions {
  damage?: number;
}

export interface TriggerLifetime {
  /**
   * Can only trigger on this turn
   */
  usableTurn?: number;
  /**
   * Triggers once per turn
   */
  turn?: number;
}

export abstract class Trigger {
  owner: TriggerOwner;
  cardOwner: string;
  key: string;
  prep: TriggerPrepostion;
  actionTrigger: Action;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;

  constructor(
    cardOwner: string,
    preposition: TriggerPrepostion,
    actionTrigger: Action,
    key: string,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    this.cardOwner = cardOwner;
    this.owner = owner || 'Global';
    this.prep = preposition;
    this.key = key;
    this.actionTrigger = actionTrigger;
    this.opts = opts;
    this.lifetime = lifetime;
  }

  baseCheck(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean {
    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.key);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

    const baseChecks = !alreadyTriggered && rightPrep && rightAction;

    const usableTurn = this.lifetime?.usableTurn;
    const canActivateOnTurn = usableTurn ? usableTurn == ctx.turn : false;

    const onceATurn = this.lifetime?.turn;
    const canTriggerThisTurn = onceATurn ? onceATurn <= ctx.turn : false;

    if (!!usableTurn) return canActivateOnTurn && baseChecks;
    if (!!onceATurn) return canTriggerThisTurn && baseChecks;

    return baseChecks;
  }

  shouldTrigger(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean {
    if (!this.baseCheck(G, ctx, decision, prep)) return false;

    return this.shouldTriggerExtension(G, ctx, decision, prep);
  }

  isOwner(decision: Decision): boolean {
    return decision.opts?.source?.owner
      ? decision.opts.source.owner === this.owner
      : false;
  }

  abstract shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean;

  abstract createDecision(G: GameState, ctx: Ctx, decision: Decision): Decision[];
}

export class BattleBowTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'damage', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const validLocations = [
      Location.OppCharacter,
      Location.OppCharAction,
      Location.Character,
      Location.CharAction,
    ];

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    return sourceIsChar && this.isOwner(decision);
  }

  createDecision(G: GameState, ctx: Ctx, decision: Decision) {
    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
      },
      key: getRandomKey(),
    };

    const optionalDec: Decision = {
      action: 'optional',
      finished: false,
      selection: {},
      choice: [Choice.Yes, Choice.No],
      opts: {
        dialogDecision: buffDec,
        triggerKey: this.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [optionalDec];
  }
}

export class DmgDestroyTrigger extends Trigger {
  constructor(
    _cardOwner: string,
    _player: PlayerID,
    key: string,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('dmgDestroy', 'After', 'damage', key);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const validLocations = [Location.Field, Location.OppField];

    const lethalDamage = validLocations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some(
          (card) =>
            isMonster(card) &&
            getLocation(G, ctx, location)
              .filter((c) => deepCardComp(c, card))
              .some(
                (card) =>
                  (card as Monster).damageTaken >=
                  getMonsterHealth(G, ctx, card as Monster)
              )
        )
    );

    if (!lethalDamage) return false;
    return true;
  }

  createDecision(G: GameState, ctx: Ctx, decision: Decision) {
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      getLocation(G, ctx, location)
        .filter(
          (card) => !!decision.selection[location]!.find((c) => deepCardComp(c, card))
        )
        .map((card) => {
          if (isMonster(card) && card.damageTaken >= getMonsterHealth(G, ctx, card)) {
            decisions.push({
              action: 'destroy',
              opts: {
                source: decision.opts?.source,
              },
              selection: {
                [location]: [card],
              },
              finished: true,
              key: getRandomKey(),
            });
          }
        });
    });

    return decisions;
  }
}

export class EarthquakeTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'damage', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsDamaged = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.cardOwner)
    );

    const dmgSource = decision.opts?.source;
    const sourceIsMonster = dmgSource ? dmgSource.type === CardTypes.Monster : false;

    const triggerDamageExists = this.opts?.damage;

    return cardIsDamaged && sourceIsMonster && !!triggerDamageExists;
  }

  createDecision(G: GameState, ctx: Ctx, decision: Decision) {
    const source = decision.opts!.source!;

    const cardLoc = getCardLocation(G, ctx, source.key);
    const card = getCardAtLocation(G, ctx, cardLoc, source.key);

    const isDamaged = decision.opts?.damage ? decision.opts.damage > 0 : false;
    if (!isDamaged) return [];

    const dec: Decision = {
      action: 'damage',
      selection: {
        [cardLoc]: [card],
      },
      finished: false,
      opts: {
        damage: this.opts!.damage,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class FairyTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'level', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    ctx: Ctx,
    _decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const isOppTurn = this.owner !== ctx.currentPlayer;

    return isOppTurn;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const cardLoc = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, cardLoc, this.cardOwner);

    const dec: Decision = {
      action: 'bounce',
      selection: {
        [cardLoc]: [card],
      },
      finished: false,
      opts: {
        source: card,
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class GeniusTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'play', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsPlayed = locations.some(
      (loc) =>
        decision.selection[loc] &&
        decision.selection[loc]!.some((card) => card.key === this.cardOwner)
    );

    return cardIsPlayed;
  }

  createDecision(_G: GameState, _ctx: Ctx, _decision: Decision) {
    const dec: Decision = {
      action: 'quest',
      selection: {},
      finished: false,
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class GoldenCrowTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'damage', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const validLocations = [
      Location.OppCharacter,
      Location.OppCharAction,
      Location.Character,
      Location.CharAction,
    ];

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    return sourceIsChar && this.isOwner(decision);
  }

  createDecision(G: GameState, ctx: Ctx, decision: Decision) {
    const decisionDmg = decision.opts?.damage || 0;

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: decisionDmg,
        decision: decision.key,
      },
      key: getRandomKey(),
    };

    const optionalDec: Decision = {
      action: 'optional',
      finished: false,
      selection: {},
      choice: [Choice.Yes, Choice.No],
      opts: {
        dialogDecision: buffDec,
        triggerKey: this.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [optionalDec];
  }
}

export class LootTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'play', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsPlayed = locations.some(
      (loc) =>
        decision.selection[loc] &&
        decision.selection[loc]!.some((card) => card.key === this.cardOwner)
    );
    const oppHandSize = G.player[getOpponentID(G, ctx, this.owner)].hand.length >= 3;

    return cardIsPlayed && oppHandSize;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const dec: Decision = {
      action: 'discard',
      selection: {},
      finished: false,
      noReset: true,
      target: {
        location: Location.OppHand,
        quantity: 1,
      },
      opts: {
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class NoMercyTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'destroy', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const isSource = decision.opts?.source
      ? decision.opts.source.key === this.cardOwner
      : false;

    return isSource;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const dec: Decision = {
      action: 'damage',
      selection: {},
      finished: false,
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
      opts: {
        damage: 10,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class RevengeTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'play', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    ctx: Ctx,
    _decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const isOppTurn = this.owner !== ctx.currentPlayer;
    return isOppTurn;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const cardLoc = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, cardLoc, this.cardOwner);

    const dec: Decision = {
      action: 'damage',
      selection: {
        [Location.Character]: [G.player[ctx.currentPlayer].character],
      },
      finished: false,
      opts: {
        source: card,
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

// TODO: Currently triggers on the entire damage decision, should split damage decision into constituent parts so shield triggers only on character damage (for damage decisions that affect characters and monsters)
// Perhaps replace decision instead of modifying, creates issue with triggering itself
export class ShieldTrigger extends Trigger {
  constructor(
    _cardOwner: string,
    _player: PlayerID,
    key: string,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('shield', 'Before', 'damage', key);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const charSelection = decision.selection[Location.Character];
    const oppSelection = decision.selection[Location.OppCharacter];

    const targettingChar = !!charSelection && charSelection.length > 0;
    const targettingOpp = !!oppSelection && oppSelection.length > 0;

    const targetsAChar = targettingChar || targettingOpp;

    return targetsAChar;
  }

  createDecision(_G: GameState, _ctx: Ctx, decision: Decision) {
    const validLocations = [Location.Character, Location.OppCharacter];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      decisions.push({
        action: 'shield',
        selection: {},
        finished: false,
        key: getRandomKey(),
        opts: {
          decision: decision.key,
        },
      });
    });

    return decisions;
  }
}

export class SlipperyTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'destroy', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const monsterDestroyed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.cardOwner)
    );

    return monsterDestroyed;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const currentLocation = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, currentLocation, this.cardOwner);

    const slipperyDecision: Decision = {
      action: 'putIntoPlay',
      selection: { [currentLocation]: [card] },
      finished: false,
      key: getRandomKey(),
      opts: {
        source: card,
      },
    };

    const flipDecision: Decision = {
      action: 'flip',
      selection: {},
      choice: [Choice.Heads, Choice.Tails],
      opts: {
        dialogDecision: slipperyDecision,
        source: card,
      },
      finished: false,
      key: getRandomKey(),
    };

    return [flipDecision];
  }
}

export class PrevailTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'destroy', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const monsterDestroyed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.cardOwner)
    );

    return monsterDestroyed;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const currentLocation = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, currentLocation, this.cardOwner);

    const decision: Decision = {
      action: 'bounce',
      selection: {
        [currentLocation]: [card],
      },
      finished: false,
      key: getRandomKey(),
    };

    return [decision];
  }
}

export class RelentlessTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'destroy', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _G: GameState,
    _ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const damageOptsExists = !!this.opts?.damage;

    const monsterDestroyed = decision.opts?.source
      ? decision.opts.source.key === this.cardOwner
      : false;

    return monsterDestroyed && damageOptsExists;
  }

  createDecision(G: GameState, ctx: Ctx, decision: Decision) {
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      getLocation(G, ctx, location)
        .filter(
          (card) => !!decision.selection[location]!.find((c) => deepCardComp(c, card))
        )
        .map((card) => {
          if (isMonster(card)) {
            const thisCard = getCardAtLocation(
              G,
              ctx,
              getCardLocation(G, ctx, this.cardOwner),
              this.cardOwner
            );
            const oppCharCard = getOpponentState(G, ctx, this.owner).character;
            const oppCharLocation = getCardLocation(G, ctx, oppCharCard.key);

            decisions.push({
              action: 'damage',
              opts: {
                damage: this.opts!.damage,
                source: thisCard,
              },
              selection: {
                [oppCharLocation]: [oppCharCard],
              },
              finished: true,
              key: getRandomKey(),
            });
          }
        });
    });

    return decisions;
  }
}

export class SteadyHandTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'damage', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const validLocations = [Location.CharAction, Location.Character];

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    return sourceIsChar;
  }

  createDecision(_G: GameState, _ctx: Ctx, decision: Decision) {
    const retDec: Decision = {
      action: 'buff',
      opts: {
        decision: decision.key,
        damage: 10,
      },
      selection: {},
      finished: false,
      key: getRandomKey(),
    };

    return [retDec];
  }
}

export class ToughTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'damage', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const validLocations = [
      Location.OppCharacter,
      Location.OppCharAction,
      Location.Character,
      Location.CharAction,
    ];

    const locations = Object.keys(decision.selection) as Location[];
    const monsterIsTough = locations.some(
      (location) =>
        decision.selection[location] &&
        decision.selection[location]!.some(
          (card) => isMonster(card) && card.ability.keywords?.includes('tough')
        )
    );

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    return monsterIsTough && sourceIsChar;
  }

  createDecision(_G: GameState, _ctx: Ctx, decision: Decision) {
    const retDec: Decision = {
      action: 'tough',
      opts: {
        decision: decision.key,
      },
      selection: {},
      finished: false,
      key: getRandomKey(),
    };

    return [retDec];
  }
}

export function pruneTriggerStore(G: GameState, ctx: Ctx) {
  const unPrunedTriggers = G.triggers.filter((trig) => {
    const uTurn = trig.lifetime?.usableTurn;

    return !(uTurn && uTurn <= ctx.turn);
  });

  G.triggers = unPrunedTriggers;
}

export function removeTrigger(G: GameState, _ctx: Ctx, key: string) {
  const index = G.triggers.findIndex((trig) => trig.key === key);
  if (index < 0) return;

  G.triggers.splice(index, 1);
}

export function pushTriggerStore(
  G: GameState,
  _ctx: Ctx,
  triggerName: TriggerNames,
  card: NonCharacter,
  opts?: TriggerOptions,
  lifetime?: TriggerLifetime
) {
  G.triggers.push({
    name: triggerName,
    cardOwner: card.key,
    key: getRandomKey(),
    owner: card.owner,
    opts,
    lifetime,
  });
}

// TODO: Create split damage trigger
export const triggers = {
  BattleBowTrigger,
  DmgDestroyTrigger,
  EarthquakeTrigger,
  FairyTrigger,
  GeniusTrigger,
  GoldenCrowTrigger,
  LootTrigger,
  NoMercyTrigger,
  PrevailTrigger,
  RelentlessTrigger,
  RevengeTrigger,
  ShieldTrigger,
  SlipperyTrigger,
  SteadyHandTrigger,
  ToughTrigger,
};

export type TriggerNames = keyof typeof triggers;

export const defaultTriggers: TriggerStore[] = [
  { name: 'ToughTrigger', key: '_tough', cardOwner: '-1', owner: '-1' },
  { name: 'ShieldTrigger', key: '_shield', cardOwner: '-1', owner: '-1' },
  { name: 'DmgDestroyTrigger', key: '_dmgDestroy', cardOwner: '-1', owner: '-1' },
];
