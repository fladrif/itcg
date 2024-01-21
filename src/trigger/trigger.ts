import { PlayerID } from 'boardgame.io';

import { Action } from '../actions';
import { FuncContext } from '../game';
import { Decision } from '../stack';

import {
  TriggerOwner,
  TriggerOptions,
  TriggerLifetime,
  TriggerPrepostion,
} from './types';

export abstract class Trigger {
  // player
  owner: TriggerOwner;
  // card
  cardOwner: string;
  key: string;
  prep: TriggerPrepostion;
  actionTrigger: Action[];
  opts?: TriggerOptions;
  lifetime?: TriggerLifetime;

  constructor(
    cardOwner: string,
    preposition: TriggerPrepostion,
    actionTrigger: Action | Action[],
    key: string,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    this.cardOwner = cardOwner;
    this.owner = owner || 'Global';
    this.prep = preposition;
    this.key = key;
    this.actionTrigger = Array.isArray(actionTrigger) ? actionTrigger : [actionTrigger];
    this.opts = opts;
    this.lifetime = lifetime;
  }

  baseCheck(fnCtx: FuncContext, decision: Decision, prep: TriggerPrepostion): boolean {
    const { G, ctx } = fnCtx;

    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.key);
    const rightPrep = prep === this.prep;
    const rightAction = this.actionTrigger.includes(decision.action);

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
    fnCtx: FuncContext,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean {
    if (!this.baseCheck(fnCtx, decision, prep)) return false;

    return this.shouldTriggerExtension(fnCtx, decision, prep);
  }

  sourceIsOwner(decision: Decision): boolean {
    return decision.opts?.source?.owner
      ? decision.opts.source.owner === this.owner
      : false;
  }

  abstract shouldTriggerExtension(
    fnCtx: FuncContext,
    decision: Decision,
    prep: TriggerPrepostion
  ): boolean;

  abstract createDecision(fnCtx: FuncContext, decision: Decision): Decision[];
}
