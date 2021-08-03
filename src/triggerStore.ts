import { Ctx, PlayerID } from 'boardgame.io';

import { GameState } from './game';
import { Action, Location } from './actions';
import { isMonster, CardTypes, Monster, NonCharacter } from './card';
import { Decision } from './stack';
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
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;
}

export interface TriggerOptions {
  damage?: number;
}

export interface TriggerLifetime {
  usableTurn?: number; // can only be used on this turn
  turn?: number; // once per turn; w/ once, only once on that turn
}

export abstract class Trigger {
  owner: TriggerOwner;
  name: string;
  prep: TriggerPrepostion;
  actionTrigger: Action;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;

  constructor(
    name: string,
    preposition: TriggerPrepostion,
    actionTrigger: Action,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    this.name = name;
    this.owner = owner || 'Global';
    this.prep = preposition;
    this.actionTrigger = actionTrigger;
    this.opts = opts;
    this.lifetime = lifetime;
  }

  abstract shouldTrigger(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean;

  abstract createDecision(G: GameState, ctx: Ctx, decision: Decision): Decision[];
}

export class GeniusTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'play', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, _ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsPlayed = locations.some(
      (loc) =>
        decision.selection[loc] &&
        decision.selection[loc]!.some((card) => card.key === this.name)
    );

    if (
      !G.stack!.decisionTriggers[decision.key].includes(this.name) &&
      prep === this.prep &&
      decision.action === this.actionTrigger &&
      cardIsPlayed
    ) {
      return true;
    }

    return false;
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

export class LootTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'play', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsPlayed = locations.some(
      (loc) =>
        decision.selection[loc] &&
        decision.selection[loc]!.some((card) => card.key === this.name)
    );
    const oppHandSize = G.player[getOpponentID(G, ctx, this.owner)].hand.length >= 3;

    if (
      !G.stack!.decisionTriggers[decision.key].includes(this.name) &&
      prep === this.prep &&
      decision.action === this.actionTrigger &&
      cardIsPlayed &&
      oppHandSize
    ) {
      return true;
    }

    return false;
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
        source: getCardAtLocation(G, ctx, getCardLocation(G, ctx, this.name), this.name),
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class NoMercyTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'destroy', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

    const usableTurn = this.lifetime?.usableTurn;
    const canActivateOnTurn = usableTurn ? usableTurn == ctx.turn : false;

    const isSource = decision.opts?.source
      ? decision.opts.source.key === this.name
      : false;

    if (
      alreadyTriggered ||
      !rightPrep ||
      !rightAction ||
      !isSource ||
      !canActivateOnTurn
    ) {
      return false;
    }

    return true;
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
        source: getCardAtLocation(G, ctx, getCardLocation(G, ctx, this.name), this.name),
      },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class RevengeTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'play', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    if (
      !G.stack!.decisionTriggers[decision.key].includes(this.name) &&
      prep === this.prep &&
      decision.action === this.actionTrigger &&
      this.owner !== ctx.currentPlayer
    ) {
      return true;
    }

    return false;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const cardLoc = getCardLocation(G, ctx, this.name);
    const card = getCardAtLocation(G, ctx, cardLoc, this.name);

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

export class FairyTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'level', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    if (
      !G.stack!.decisionTriggers[decision.key].includes(this.name) &&
      prep === this.prep &&
      decision.action === this.actionTrigger &&
      this.owner !== ctx.currentPlayer
    ) {
      return true;
    }

    return false;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const cardLoc = getCardLocation(G, ctx, this.name);
    const card = getCardAtLocation(G, ctx, cardLoc, this.name);

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

// TODO: Currently triggers on the entire damage decision, should split damage decision into constituent parts so shield triggers only on character damage (for damage decisions that affect characters and monsters)
// Perhaps replace decision instead of modifying, creates issue with triggering itself
export class ShieldTrigger extends Trigger {
  constructor(
    _name: string,
    _player: PlayerID,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('shield', 'Before', 'damage');
  }

  shouldTrigger(G: GameState, _ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const targetingChar =
      (decision.selection[Location.Character] &&
        decision.selection[Location.Character]!.length > 0) ||
      (decision.selection[Location.OppCharacter] &&
        decision.selection[Location.OppCharacter]!.length > 0);

    if (
      !G.stack!.decisionTriggers[decision.key].includes(this.name) &&
      prep === this.prep &&
      decision.action === this.actionTrigger &&
      targetingChar
    ) {
      return true;
    }

    return false;
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

export class DmgDestroyTrigger extends Trigger {
  constructor(
    _name: string,
    _player: PlayerID,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('dmgDestroy', 'After', 'damage');
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const validLocations = [Location.Field, Location.OppField];

    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

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

    if (alreadyTriggered || !rightPrep || !rightAction || !lethalDamage) return false;
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

export class PrevailTrigger extends Trigger {
  constructor(
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'Before', 'destroy', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, _ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

    const locations = Object.keys(decision.selection) as Location[];
    const monsterDestroyed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.name)
    );

    if (alreadyTriggered || !rightPrep || !rightAction || !monsterDestroyed) return false;
    return true;
  }

  createDecision(G: GameState, ctx: Ctx, _decision: Decision) {
    const currentLocation = getCardLocation(G, ctx, this.name);
    const card = getCardAtLocation(G, ctx, currentLocation, this.name);

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
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'After', 'destroy', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, _ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;
    const damageOptsExists = this.opts?.damage;

    const monsterDestroyed = decision.opts?.source
      ? decision.opts.source.key === this.name
      : false;

    if (
      alreadyTriggered ||
      !rightPrep ||
      !rightAction ||
      !monsterDestroyed ||
      !damageOptsExists
    )
      return false;
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
          if (isMonster(card)) {
            const thisCard = getCardAtLocation(
              G,
              ctx,
              getCardLocation(G, ctx, this.name),
              this.name
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
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'Before', 'damage', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const validLocations = [Location.CharAction, Location.Character];

    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

    const usableTurn = this.lifetime?.usableTurn;
    const canActivateOnTurn = usableTurn ? usableTurn == ctx.turn : false;

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    if (
      alreadyTriggered ||
      !rightPrep ||
      !rightAction ||
      !sourceIsChar ||
      !canActivateOnTurn
    ) {
      return false;
    }

    return true;
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
    name: string,
    player: PlayerID,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(name, 'Before', 'damage', opts, player, lifetime);
  }

  shouldTrigger(G: GameState, ctx: Ctx, decision: Decision, prep: TriggerPrepostion) {
    const validLocations = [
      Location.OppCharacter,
      Location.OppCharAction,
      Location.Character,
      Location.CharAction,
    ];
    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.name);
    const rightPrep = prep === this.prep;
    const rightAction = decision.action === this.actionTrigger;

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

    if (
      alreadyTriggered ||
      !rightPrep ||
      !rightAction ||
      !monsterIsTough ||
      !sourceIsChar
    ) {
      return false;
    }

    return true;
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
  triggerRef: TriggerNames,
  card: NonCharacter,
  opts?: TriggerOptions,
  lifetime?: TriggerLifetime
) {
  G.triggers.push({
    name: triggerRef,
    key: card.key,
    owner: card.owner,
    opts,
    lifetime,
  });
}

// TODO: Create split damage trigger
export const triggers = {
  DmgDestroyTrigger,
  FairyTrigger,
  GeniusTrigger,
  LootTrigger,
  NoMercyTrigger,
  PrevailTrigger,
  RelentlessTrigger,
  RevengeTrigger,
  ShieldTrigger,
  SteadyHandTrigger,
  ToughTrigger,
};

export type TriggerNames = keyof typeof triggers;

export const defaultTriggers: TriggerStore[] = [
  { name: 'ToughTrigger', key: '_tough', owner: '-1' },
  { name: 'ShieldTrigger', key: '_shield', owner: '-1' },
  { name: 'DmgDestroyTrigger', key: '_dmgDestroy', owner: '-1' },
];
