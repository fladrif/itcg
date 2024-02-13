import { PlayerID } from 'boardgame.io';

import { FuncContext } from '../game';
import { Decision } from '../stack';
import { Action } from '../actions';

import { GenericTrigger } from './trigger';
import { TriggerOptions, TriggerLifetime, TriggerPreposition } from './types';

export abstract class ActionTrigger extends GenericTrigger {
  actionTrigger: Action[];

  constructor(
    cardOwner: string,
    preposition: TriggerPreposition,
    actionTrigger: Action[],
    key: string,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, preposition, key, opts, owner, lifetime);
    this.actionTrigger = actionTrigger;
  }

  baseCheck(fnCtx: FuncContext, decision: Decision, prep: TriggerPreposition): boolean {
    const { G, ctx } = fnCtx;

    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(this.key);
    const rightPrep = prep === this.prep;
    const rightAction = this.actionTrigger.includes(decision.action);

    const baseChecks = !alreadyTriggered && rightPrep && rightAction;

    const usableTurn = this.lifetime?.usableTurn;
    const canActivateOnTurn = usableTurn ? usableTurn === ctx.turn : false;

    const onceATurn = this.lifetime?.turn;
    const canTriggerThisTurn = onceATurn ? onceATurn <= ctx.turn : false;

    if (!!usableTurn) return canActivateOnTurn && baseChecks;
    if (!!onceATurn) return canTriggerThisTurn && baseChecks;

    return baseChecks;
  }
}
