import { Ctx, PlayerID } from 'boardgame.io';

import { GameState } from './game';
import { Action, Location } from './actions';
import { Monster, isMonster, NonCharacter } from './card';
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
}

export interface TriggerOptions {
  damage?: number;
}

export interface TriggerLifetime {
  turn?: number;
  stage?: string;
  once?: boolean;
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
    owner?: PlayerID
  ) {
    this.name = name;
    this.owner = owner || 'Global';
    this.prep = preposition;
    this.actionTrigger = actionTrigger;
    this.opts = opts;
  }

  abstract shouldTrigger(
    G: GameState,
    ctx: Ctx,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean;

  abstract createDecision(G: GameState, ctx: Ctx, decision: Decision): Decision[];
}

export class LootTrigger extends Trigger {
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'After', 'play', opts, player);
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

export class GeniusTrigger extends Trigger {
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'After', 'play', opts, player);
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

export class RevengeTrigger extends Trigger {
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'After', 'play', opts, player);
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
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'After', 'level', opts, player);
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
  constructor(_name: string, _player: PlayerID, _opts?: TriggerOptions) {
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
  constructor(_name: string, _player: PlayerID, _opts?: TriggerOptions) {
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
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'Before', 'destroy', opts, player);
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
  constructor(name: string, player: PlayerID, opts?: TriggerOptions) {
    super(name, 'After', 'destroy', opts, player);
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

export function pruneTriggerStore(G: GameState, _ctx: Ctx, key: string) {
  const index = G.triggers.findIndex((trig) => trig.key === key);
  if (index < 0) return;

  G.triggers.splice(index, 1);
}

export function pushTriggerStore(
  G: GameState,
  _ctx: Ctx,
  triggerRef: TriggerNames,
  card: NonCharacter,
  opts?: TriggerOptions
) {
  G.triggers.push({
    name: triggerRef,
    key: card.key,
    owner: card.owner,
    opts,
  });
}

export const triggers = {
  DmgDestroyTrigger,
  FairyTrigger,
  GeniusTrigger,
  LootTrigger,
  PrevailTrigger,
  RelentlessTrigger,
  RevengeTrigger,
  ShieldTrigger,
};

export type TriggerNames = keyof typeof triggers;

export const defaultTriggers: TriggerStore[] = [
  { name: 'ShieldTrigger', key: '_shield', owner: '-1' },
  { name: 'DmgDestroyTrigger', key: '_dmgDestroy', owner: '-1' },
];
