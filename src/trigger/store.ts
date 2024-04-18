import { PlayerID } from 'boardgame.io';

import { Action, actions } from '../actions';
import { FuncContext } from '../game';
import { Location } from '../target';
import { isMonster, CardTypes, Monster, isItem, isTactic, Tactic } from '../card';
import { Choice, Decision } from '../stack';
import { getMonsterHealth } from '../state';
import {
  deepCardComp,
  getCardLocation,
  getCardAtLocation,
  getLocation,
  getOpponentID,
  getOpponentState,
  getRandomKey,
  rmCard,
} from '../utils';

import { Trigger } from './trigger';
import {
  TriggerStore,
  TriggerOptions,
  TriggerLifetime,
  TriggerPrepostion,
} from './types';

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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
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

    return sourceIsChar && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const source = getCardAtLocation(
      G,
      ctx,
      getCardLocation(G, ctx, this.cardOwner),
      this.cardOwner
    );

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source,
      },
      key: getRandomKey(),
    };

    const optionalDec: Decision = {
      action: 'optional',
      finished: false,
      selection: {},
      choice: [Choice.Yes, Choice.No],
      noReset: true,
      dialogPrompt: `Use ${source.name}?`,
      opts: {
        dialogDecision: [buffDec],
        triggerKey: this.key,
        source,
      },
      key: getRandomKey(),
    };

    return [optionalDec];
  }
}

export class BloodSlainTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', ['attack', 'damage'], key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;

    const validLocation = [
      Location.Character,
      Location.CharAction,
      Location.OppCharacter,
      Location.OppCharAction,
    ];

    const sourceIsMonster = decision.opts?.source
      ? isMonster(decision.opts.source) && decision.action === 'attack'
      : false;

    const sourceIsCharAction = decision.opts?.source
      ? validLocation.includes(getCardLocation(G, ctx, decision.opts.source.key))
      : false;

    const sourceIsTactic = decision.opts?.source
      ? decision.opts.source.type === CardTypes.Tactic
      : false;

    return (
      (sourceIsCharAction || sourceIsMonster || sourceIsTactic) &&
      this.sourceIsOwner(decision)
    );
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
  }
}

export class BlueDirosTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'attack', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = [
      Location.Character,
      Location.OppCharacter,
      Location.Field,
      Location.OppField,
    ];

    const anyTarget = locations.some((location) => {
      return (
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.owner === this.owner)
      );
    });

    return anyTarget && !this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    if (!decision.opts?.source?.owner) return [];

    const { G, ctx } = fnCtx;

    const trigger = G.triggers.filter((trigger) => trigger.key === this.key)[0];
    if (trigger.lifetime) trigger.lifetime.turn = ctx.turn + 1;

    G.state.push({
      owner: this.cardOwner,
      player: decision.opts?.source?.owner,
      targets: {
        xor: [
          {
            location: Location.Field,
            quantity: 1,
            cardKey: [decision.opts.source.key],
          },
          {
            location: Location.OppField,
            quantity: 1,
            cardKey: [decision.opts.source.key],
          },
        ],
      },
      modifier: {
        monster: {
          attack: -10,
        },
      },
      lifetime: { turn: ctx.turn },
    });

    return [];
  }
}

export class BoneRattleTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const damageOptsExists = !!this.opts?.damage;

    const ownerMonster = decision.opts?.source
      ? decision.opts.source.owner === this.owner && isMonster(decision.opts.source)
      : false;

    return ownerMonster && damageOptsExists;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;

    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      decision.selection[location]!.forEach((card) => {
        if (!isMonster(card)) return;

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
          finished: false,
          key: getRandomKey(),
        });
      });
    });

    return decisions;
  }
}

export class BuffAllTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'attack', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    return this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
  }
}

export class DarkShadowTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'attack', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    if (!decision.selection) return false;

    const locations = [Location.Character, Location.OppCharacter];

    const charIsTarget = locations.some((location) => {
      return (
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.owner === this.owner)
      );
    });

    return charIsTarget && !this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
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
                  getMonsterHealth(fnCtx, card as Monster)
              )
        )
    );

    if (!lethalDamage) return false;
    return true;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      getLocation(G, ctx, location)
        .filter(
          (card) => !!decision.selection[location]!.find((c) => deepCardComp(c, card))
        )
        .map((card) => {
          if (isMonster(card) && card.damageTaken >= getMonsterHealth(fnCtx, card)) {
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

export class DoombringerTrigger extends Trigger {
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
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

    return sourceIsChar && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const buffDmg = this.opts?.damage || 0;

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: buffDmg,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
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
    _fnCtx: FuncContext,
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

    const damageExists = decision.opts?.damage && decision.opts.damage > 0;

    return cardIsDamaged && sourceIsMonster && !!damageExists;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
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

export class EmeraldEarringsTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const anotherItemPlayed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some(
          (card) => card.type === CardTypes.Item && card.key !== this.cardOwner
        )
    );

    return anotherItemPlayed && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const triggerOwner = decision.opts?.source?.owner;
    if (!triggerOwner) return [];

    const player = G.player[triggerOwner];
    player.deck[0].reveal = Object.keys(G.player);

    const dec: Decision = {
      action: 'putIntoHand',
      selection: {},
      finished: false,
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

    if (isItem(player.deck[0])) return [dec];
    return [];
  }
}

export class EvilTaleTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'play', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const selectionIsTactic = Object.values(decision.selection).reduce(
      (prev, arr) =>
        arr.reduce((prev, targ) => targ.type === CardTypes.Tactic || prev, false) || prev,
      false
    );

    return selectionIsTactic && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;
    if (!this.opts?.damage) return [];

    const cardLoc = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, cardLoc, this.cardOwner);

    const dec: Decision = {
      action: 'damage',
      selection: {},
      noReset: true,
      target: {
        xor: [
          {
            location: Location.Character,
            quantity: 1,
          },
          {
            location: Location.OppCharacter,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.Field,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
        ],
      },
      finished: false,
      opts: { source: card, damage: this.opts.damage },
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
    fnCtx: FuncContext,
    _decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { ctx } = fnCtx;
    const isOppTurn = this.owner !== ctx.currentPlayer;

    return isOppTurn;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

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

export class FocusTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', ['attack', 'damage'], key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
    const validLocation = [
      Location.Character,
      Location.CharAction,
      Location.OppCharacter,
      Location.OppCharAction,
    ];

    const sourceIsMonster = decision.opts?.source
      ? isMonster(decision.opts.source) && decision.action === 'attack'
      : false;

    const sourceIsCharAction = decision.opts?.source
      ? validLocation.includes(getCardLocation(G, ctx, decision.opts.source.key))
      : false;

    return (sourceIsCharAction || sourceIsMonster) && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
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
    _fnCtx: FuncContext,
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

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

    const dec: Decision = {
      action: 'quest',
      selection: {},
      opts: {
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
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

    return sourceIsChar && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const decisionDmg = decision.opts?.damage || 0;
    const source = getCardAtLocation(
      G,
      ctx,
      getCardLocation(G, ctx, this.cardOwner),
      this.cardOwner
    );

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: decisionDmg,
        decision: decision.key,
        source,
      },
      key: getRandomKey(),
    };

    const optionalDec: Decision = {
      action: 'optional',
      finished: false,
      selection: {},
      choice: [Choice.Yes, Choice.No],
      dialogPrompt: `Use ${source.name}?`,
      noReset: true,
      opts: {
        dialogDecision: [buffDec],
        triggerKey: this.key,
        source,
      },
      key: getRandomKey(),
    };

    return [optionalDec];
  }
}

export class KumbiTrigger extends Trigger {
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
    if (!decision.opts?.source) return false;

    const sourceLoc = [
      Location.Character,
      Location.OppCharacter,
      Location.CharAction,
      Location.OppCharAction,
    ];

    const targetLoc = [Location.Character, Location.OppCharacter];

    const dmgSourceLoc = getCardLocation(G, ctx, decision.opts.source.key);
    const sourceIsChar = sourceLoc.includes(dmgSourceLoc);
    const charIsTarget = targetLoc.some((location) => {
      return (
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.owner === this.owner)
      );
    });

    const damageExists = decision.opts?.damage && decision.opts.damage > 0;

    return (
      !this.sourceIsOwner(decision) && sourceIsChar && !!damageExists && charIsTarget
    );
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const charTarget = G.player[decision.opts!.source!.owner].character;
    const cardLoc = getCardLocation(G, ctx, charTarget.key);

    const isDamaged = decision.opts?.damage ? decision.opts.damage > 0 : false;
    if (!isDamaged) return [];

    const dec: Decision = {
      action: 'damage',
      selection: {
        [cardLoc]: [charTarget],
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
    const locations = Object.keys(decision.selection) as Location[];
    const cardIsPlayed = locations.some(
      (loc) =>
        decision.selection[loc] &&
        decision.selection[loc]!.some((card) => card.key === this.cardOwner)
    );
    const oppHandSize = G.player[getOpponentID(G, ctx, this.owner)].hand.length >= 3;

    return cardIsPlayed && oppHandSize;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

    const dec: Decision = {
      action: 'discard',
      dialogPrompt: 'Discard a card',
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

export class MapleStaffTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'quest', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    return this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const triggerOwner = decision.opts?.source?.owner;
    if (!triggerOwner) return [];

    const source = getCardAtLocation(
      G,
      ctx,
      getCardLocation(G, ctx, this.cardOwner),
      this.cardOwner
    );

    const replaceDec: Decision = {
      action: 'replacement',
      selection: {},
      finished: false,
      opts: {
        decision: decision.key,
        source,
      },
      key: getRandomKey(),
    };

    const seerDec: Decision = {
      action: 'seer',
      selection: {},
      finished: false,
      opts: {
        source,
      },
      key: getRandomKey(),
    };

    const optionDec: Decision = {
      action: 'optional',
      selection: {},
      choice: [Choice.Yes, Choice.No],
      finished: false,
      dialogPrompt: `Use ${source.name}?`,
      noReset: true,
      opts: {
        dialogDecision: [seerDec, replaceDec],
        source,
      },
      key: getRandomKey(),
    };

    return [optionDec];
  }
}

export class MeditationTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', ['attack', 'damage'], key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
    const sourceIsMonster = decision.opts?.source
      ? isMonster(decision.opts.source) && decision.action === 'attack'
      : false;

    const sourceIsTactic = decision.opts?.source
      ? decision.opts.source.type === CardTypes.Tactic
      : false;

    const CharAction = [Location.CharAction, Location.OppCharAction];
    const sourceIsNotCharAction = decision.opts?.source
      ? !CharAction.includes(getCardLocation(G, ctx, decision.opts.source.key))
      : false;

    return (
      (sourceIsTactic || sourceIsMonster) &&
      sourceIsNotCharAction &&
      this.sourceIsOwner(decision)
    );
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;

    const buffDec: Decision = {
      action: 'buff',
      finished: false,
      selection: {},
      opts: {
        damage: this.opts?.damage ? this.opts.damage : 0,
        decision: decision.key,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [buffDec];
  }
}

export class MysticPowerTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'attack', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const isSource = decision.opts?.source
      ? decision.opts.source.key === this.cardOwner
      : false;

    return isSource && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

    const healDec: Decision = {
      action: 'refresh',
      selection: {},
      finished: false,
      opts: {
        lifegain: this.opts?.lifegain,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [healDec];
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const isSource = decision.opts?.source
      ? decision.opts.source.key === this.cardOwner
      : false;

    return isSource;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

    const dec: Decision = {
      action: 'damage',
      selection: {},
      finished: false,
      noReset: true,
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = [Location.Field, Location.OppField];
    const monsterDestroyed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.cardOwner)
    );

    return monsterDestroyed;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

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

export class RedApprenticeHatTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const levelIsOwner = locations.some(
      (location) =>
        decision.selection[location] &&
        decision.selection[location]!.some((card) => card.owner === this.owner)
    );

    return levelIsOwner;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

    const healDec: Decision = {
      action: 'refresh',
      selection: {},
      finished: false,
      opts: {
        lifegain: 10,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    return [healDec];
  }
}

export class RedNightTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = [Location.Field, Location.OppField];
    const isOwnersMonster = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some(
          (card) => card.owner === this.owner && isMonster(card)
        )
    );

    return isOwnersMonster;
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;
    const targetLocation =
      this.owner === ctx.currentPlayer ? Location.OppHand : Location.Hand;

    const discardDec: Decision = {
      action: 'discard',
      dialogPrompt: 'Discard a card',
      selection: {},
      finished: false,
      noReset: true,
      target: {
        location: targetLocation,
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

    const flipDec: Decision = {
      action: 'flip',
      selection: {},
      finished: false,
      dialogPrompt: 'Choose heads or tails',
      choice: [Choice.Heads, Choice.Tails],
      noReset: true,
      opts: {
        activePlayer: this.owner,
        dialogDecision: [discardDec],
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    const isHandEmpty = getLocation(G, ctx, targetLocation).length <= 0;

    return isHandEmpty ? [] : [flipDec];
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const damageOptsExists = !!this.opts?.damage;

    const monsterDestroyed = decision.opts?.source
      ? decision.opts.source.key === this.cardOwner
      : false;

    return monsterDestroyed && damageOptsExists;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      decision.selection[location]!.forEach((card) => {
        if (!isMonster(card)) return;

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
          finished: false,
          key: getRandomKey(),
        });
      });
    });

    return decisions;
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
    super(cardOwner, 'Before', 'play', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    return !this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    if (!this.opts?.damage) return [];

    const cardLoc = getCardLocation(G, ctx, this.cardOwner);
    const card = getCardAtLocation(G, ctx, cardLoc, this.cardOwner);

    const oppLoc =
      decision.opts!.source!.owner === ctx.currentPlayer
        ? Location.Character
        : Location.OppCharacter;
    const oppChar = getOpponentState(G, ctx, this.owner).character;

    const dec: Decision = {
      action: 'damage',
      selection: { [oppLoc]: [oppChar] },
      finished: false,
      opts: { source: card, damage: this.opts.damage },
      key: getRandomKey(),
    };

    return [dec];
  }
}

export class SerpentsTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const ownerMonster = decision.opts?.source
      ? decision.opts.source.owner === this.owner && isMonster(decision.opts.source)
      : false;

    return ownerMonster;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      decision.selection[location]!.forEach((card) => {
        if (!isMonster(card)) return;

        const thisCard = getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        );

        decisions.push({
          action: 'refresh',
          opts: {
            lifegain: this.opts!.lifegain,
            source: thisCard,
          },
          selection: {},
          finished: false,
          key: getRandomKey(),
        });
      });
    });

    return decisions;
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
    _fnCtx: FuncContext,
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

  createDecision(_fnCtx: FuncContext, decision: Decision) {
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
    super(cardOwner, 'After', 'destroy', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
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

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx } = fnCtx;

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
      dialogPrompt: 'Choose heads or tails',
      opts: {
        dialogDecision: [slipperyDecision],
        activePlayer: this.owner,
        source: card,
      },
      noReset: true,
      finished: false,
      key: getRandomKey(),
    };

    return [flipDecision];
  }
}

export class StartleTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'Before', 'attack', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = [Location.Character, Location.OppCharacter];
    const oppCharAttacked = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.owner !== this.owner)
    );

    return oppCharAttacked && this.sourceIsCard(decision);
  }

  createDecision(fnCtx: FuncContext, _decision: Decision) {
    const { G, ctx, random } = fnCtx;
    const oppHand = getOpponentState(G, ctx, this.owner).hand;
    if (oppHand.length <= 0) return [];

    const randomIndex = random.Die(oppHand.length);
    const card = oppHand[randomIndex - 1];

    const discardDec: Decision = {
      action: 'discard',
      dialogPrompt: 'Discard a card',
      selection: { [getCardLocation(G, ctx, card.key)]: [card] },
      finished: false,
      key: getRandomKey(),
      opts: {
        source: card,
      },
    };

    return [discardDec];
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
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
    const validLocations = [Location.CharAction, Location.Character];

    const sourceLocation = decision.opts?.source
      ? getCardLocation(G, ctx, decision.opts.source.key)
      : false;
    const sourceIsChar = sourceLocation ? validLocations.includes(sourceLocation) : false;

    return sourceIsChar;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;

    const retDec: Decision = {
      action: 'buff',
      opts: {
        decision: decision.key,
        damage: 10,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      selection: {},
      finished: false,
      key: getRandomKey(),
    };

    return [retDec];
  }
}

export class SuperGeniusTrigger extends Trigger {
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
    _fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const locations = Object.keys(decision.selection) as Location[];
    const cardPlayed = locations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some((card) => card.key === this.cardOwner)
    );

    return cardPlayed && this.sourceIsOwner(decision);
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const triggerOwner = decision.opts?.source?.owner;
    if (!triggerOwner) return [];

    const player = G.player[triggerOwner];
    player.deck[0].reveal = Object.keys(G.player);

    const putDec: Decision = {
      action: 'putIntoHand',
      selection: {},
      finished: false,
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

    const playDec: Decision = {
      action: 'play',
      selection: {
        [Location.Hand]: [player.deck[0]],
      },
      finished: false,
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

    const optionDec: Decision = {
      action: 'optional',
      selection: {},
      choice: [Choice.Yes, Choice.No],
      finished: false,
      dialogPrompt: `Play ${player.deck[0].name}?`,
      noReset: true,
      opts: {
        dialogDecision: [playDec],
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      key: getRandomKey(),
    };

    if (isTactic(player.deck[0])) return [optionDec, putDec];
    return [putDec];
  }
}

export class TacticResolutionTrigger extends Trigger {
  constructor(
    _cardOwner: string,
    _player: PlayerID,
    key: string,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('tacticRes', 'After', Object.keys(actions) as Action[], key);
  }

  shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G } = fnCtx;
    if (!G.stack) return false;

    const sourceIsResolvedTactic = decision.opts?.source
      ? isTactic(decision.opts.source) &&
        // The decision belongs to card in the temporary zone
        G.player[decision.opts.source.owner].temporary.some(
          (card) => card.key === decision.opts!.source!.key
        ) &&
        // The decision is not in decisions array
        !G.stack.decisions.some(
          (dec) => dec.opts?.source?.key === decision.opts!.source!.key
        ) &&
        // The decision is not in queued decisions array
        !G.stack.queuedDecisions.some(
          (dec) => dec.opts?.source?.key === decision.opts!.source!.key
        )
      : false;

    return sourceIsResolvedTactic;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;
    const source = decision.opts!.source! as Tactic;
    const curLocation = getCardLocation(G, ctx, source.key);

    G.player[source.owner].discard.push(
      getCardAtLocation(G, ctx, curLocation, source.key) as Tactic
    );
    rmCard(G, ctx, source, curLocation);

    return [];
  }
}

export class ToughTrigger extends Trigger {
  constructor(
    _cardOwner: string,
    _player: PlayerID,
    key: string,
    _opts?: TriggerOptions,
    _lifetime?: TriggerLifetime
  ) {
    super('tough', 'Before', 'damage', key);
  }

  shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const { G, ctx } = fnCtx;
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

  createDecision(_fnCtx: FuncContext, decision: Decision) {
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

export class WickedTrigger extends Trigger {
  constructor(
    cardOwner: string,
    player: PlayerID,
    key: string,
    opts?: TriggerOptions,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, 'After', 'refresh', key, opts, player, lifetime);
  }

  shouldTriggerExtension(
    { ctx }: FuncContext,
    decision: Decision,
    _prep: TriggerPrepostion
  ) {
    const sourceIsOwner = decision.opts?.source?.owner
      ? decision.opts.source.owner === this.owner
      : ctx.currentPlayer === this.owner;

    return sourceIsOwner;
  }

  createDecision(fnCtx: FuncContext, decision: Decision) {
    const { G, ctx } = fnCtx;

    const oppCharKey = getOpponentState(G, ctx, this.owner).character.key;
    const oppCharLocation = getCardLocation(G, ctx, oppCharKey);
    const oppCharacter = getCardAtLocation(G, ctx, oppCharLocation, oppCharKey);

    const retDec: Decision = {
      action: 'damage',
      opts: {
        damage: decision.opts?.lifegain,
        source: getCardAtLocation(
          G,
          ctx,
          getCardLocation(G, ctx, this.cardOwner),
          this.cardOwner
        ),
      },
      selection: { [oppCharLocation]: [oppCharacter] },
      finished: true,
      key: getRandomKey(),
    };

    return [retDec];
  }
}

// TODO: Create split damage trigger
export const triggers = {
  BattleBowTrigger,
  BloodSlainTrigger,
  BlueDirosTrigger,
  BoneRattleTrigger,
  BuffAllTrigger,
  DarkShadowTrigger,
  DmgDestroyTrigger,
  DoombringerTrigger,
  EarthquakeTrigger,
  EmeraldEarringsTrigger,
  EvilTaleTrigger,
  FairyTrigger,
  FocusTrigger,
  GeniusTrigger,
  GoldenCrowTrigger,
  KumbiTrigger,
  LootTrigger,
  MeditationTrigger,
  MysticPowerTrigger,
  NoMercyTrigger,
  MapleStaffTrigger,
  PrevailTrigger,
  RedApprenticeHatTrigger,
  RedNightTrigger,
  RelentlessTrigger,
  RevengeTrigger,
  SerpentsTrigger,
  ShieldTrigger,
  SlipperyTrigger,
  StartleTrigger,
  SteadyHandTrigger,
  SuperGeniusTrigger,
  TacticResolutionTrigger,
  ToughTrigger,
  WickedTrigger,
};

export type TriggerNames = keyof typeof triggers;

export const defaultTriggers: TriggerStore[] = [
  { name: 'TacticResolutionTrigger', key: '_tactic', cardOwner: '-1', owner: '-1' },
  { name: 'ToughTrigger', key: '_tough', cardOwner: '-1', owner: '-1' },
  { name: 'ShieldTrigger', key: '_shield', cardOwner: '-1', owner: '-1' },
  { name: 'DmgDestroyTrigger', key: '_dmgDestroy', cardOwner: '-1', owner: '-1' },
];
