import { PlayerID } from 'boardgame.io';

import { FuncContext } from '../game';

import { GenericTrigger } from './trigger';
import { TriggerOptions, TriggerLifetime, TriggerPreposition, TurnPhase } from './types';

export abstract class TurnTrigger extends GenericTrigger {
  turnTrigger: TurnPhase[];

  constructor(
    cardOwner: string,
    preposition: TriggerPreposition,
    turnTrigger: TurnPhase[],
    key: string,
    opts?: TriggerOptions,
    owner?: PlayerID,
    lifetime?: TriggerLifetime
  ) {
    super(cardOwner, preposition, key, opts, owner, lifetime);
    this.turnTrigger = turnTrigger;
  }

  baseCheck(fnCtx: FuncContext, phase: TurnPhase, prep: TriggerPreposition): boolean {
    const { G, ctx } = fnCtx;

    const turnCtxKey = `${phase}${ctx.turn}`;

    const alreadyTriggered = G.stack?.decisionTriggers[turnCtxKey].includes(this.key);
    const rightPrep = prep === this.prep;
    const rightPhase = this.turnTrigger.includes(phase);

    const baseChecks = !alreadyTriggered && rightPrep && rightPhase;

    const usableTurn = this.lifetime?.usableTurn;
    const canActivateOnTurn = usableTurn ? usableTurn === ctx.turn : false;

    const onceATurn = this.lifetime?.turn;
    const canTriggerThisTurn = onceATurn ? onceATurn <= ctx.turn : false;

    if (!!usableTurn) return canActivateOnTurn && baseChecks;
    if (!!onceATurn) return canTriggerThisTurn && baseChecks;

    return baseChecks;
  }
}
