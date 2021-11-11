import { Ctx, PlayerID } from 'boardgame.io';

import { Action } from '../actions';
import { GameState } from '../game';
import { Decision } from '../stack';

import {
  TriggerOwner,
  TriggerOptions,
  TriggerLifetime,
  TriggerPrepostion,
} from './types';

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
