import { PlayerID } from 'boardgame.io';

import { FuncContext } from '../game';
import { Decision } from '../stack';

import {
  TriggerContext,
  TriggerOwner,
  TriggerOptions,
  TriggerLifetime,
  TriggerPreposition,
} from './types';

export abstract class GenericTrigger {
  // player
  owner: TriggerOwner;
  // card
  cardOwner: string;
  key: string;
  // Alt for turn prep
  prep: TriggerPreposition;
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;

  constructor(
    cardOwner: string,
    preposition: TriggerPreposition,
    key: string,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    this.cardOwner = cardOwner;
    this.owner = owner || 'Global';
    this.prep = preposition;
    this.key = key;
    this.opts = opts;
    this.lifetime = lifetime;
  }

  abstract baseCheck(
    fnCtx: FuncContext,
    trigCtx: TriggerContext,
    prep: TriggerPreposition
  ): boolean;

  shouldTrigger(
    fnCtx: FuncContext,
    trigCtx: TriggerContext,
    prep: TriggerPreposition
  ): boolean {
    if (!this.baseCheck(fnCtx, trigCtx, prep)) return false;

    return this.shouldTriggerExtension(fnCtx, trigCtx, prep);
  }

  turnIsOwner(fnCtx: FuncContext): boolean {
    const { ctx } = fnCtx;

    return ctx.currentPlayer === this.owner;
  }

  sourceIsOwner(decision: Decision): boolean {
    return decision.opts?.source?.owner
      ? decision.opts.source.owner === this.owner
      : false;
  }

  sourceIsCard(decision: Decision): boolean {
    return decision.opts?.source?.key
      ? decision.opts.source.key === this.cardOwner
      : false;
  }

  abstract shouldTriggerExtension(
    fnCtx: FuncContext,
    trigCtx: TriggerContext,
    prep: TriggerPreposition
  ): boolean;

  abstract createDecision(fnCtx: FuncContext, trigCtx: TriggerContext): Decision[];
}
