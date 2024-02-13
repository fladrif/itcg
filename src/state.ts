import { Ctx, PlayerID } from 'boardgame.io';

import { Action } from './actions';
import { Monster, Character, NonCharacter } from './card';
import { FuncContext } from './game';
import { checkDeadMonstersOnField } from './hook';
import { Keyword } from './keywords';
import { meetsTarget, ActionTargets } from './target';

export interface MonsterStateModifier {
  health?: number;
  attack?: number;
  keywords?: Keyword[];
}

export interface TargetStateModifier {
  action: Action;
}

export interface StateModifier {
  monster?: MonsterStateModifier;
  target?: TargetStateModifier;
}

export interface StateLifetime {
  turn?: number;
  setTurn?: 'ThisTurn' | 'NextTurn';
  until?: boolean;
}

export interface GlobalState {
  owner: string;
  player: PlayerID;
  targets: ActionTargets; // TODO: Location not respected in this filter
  modifier: StateModifier;
  lifetime: StateLifetime;
  targetOpponent?: boolean; // TODO: refactor out. Utilize location
}

export function getMonsterAtt(fnCtx: FuncContext, card: Monster) {
  const { G, ctx } = fnCtx;

  const modifiers = getRelevantState(ctx, G.state, card).filter((state) =>
    meetsTarget(fnCtx, state.targets, card)
  );

  const attMod = modifiers.reduce(
    (acc, mod) =>
      mod.modifier.monster?.attack ? acc + mod.modifier.monster.attack : acc,
    0
  );
  return attMod + card.attack;
}

export function getMonsterHealth(fnCtx: FuncContext, card: Monster) {
  const { G, ctx } = fnCtx;

  const modifiers = getRelevantState(ctx, G.state, card).filter((state) =>
    meetsTarget(fnCtx, state.targets, card)
  );
  const healthMod = modifiers.reduce(
    (acc, mod) =>
      mod.modifier.monster?.health ? acc + mod.modifier.monster.health : acc,
    0
  );
  return healthMod + card.health;
}

export function getMonsterKeywords(fnCtx: FuncContext, card: Monster): Keyword[] {
  const { G, ctx } = fnCtx;

  const modifiers = getRelevantState(ctx, G.state, card).filter((state) =>
    meetsTarget(fnCtx, state.targets, card)
  );

  const extraKeywords = modifiers.reduce<Keyword[]>(
    (acc, mod) =>
      mod.modifier.monster?.keywords ? acc.concat(mod.modifier.monster.keywords) : acc,
    []
  );

  return card.ability.keywords
    ? ([] as Keyword[]).concat(card.ability.keywords, extraKeywords)
    : extraKeywords;
}

export function removeGlobalState(fnCtx: FuncContext, card: NonCharacter) {
  const { G } = fnCtx;

  if (card.ability.state) {
    const index = G.state.findIndex((state) => state.owner === card.key);
    G.state.splice(index, 1);
    checkDeadMonstersOnField(fnCtx);
  }
}

export function parseStateLifetime(ctx: Ctx, lifetime: StateLifetime): StateLifetime {
  if (!lifetime.setTurn) return lifetime;

  const turn = lifetime.setTurn === 'NextTurn' ? ctx.turn + 1 : ctx.turn;

  return { turn };
}

export function pruneStateStore(fnCtx: FuncContext) {
  const { G, ctx } = fnCtx;

  const unPrunedStates = G.state.filter(
    (state) => !state.lifetime.turn || state.lifetime.turn > ctx.turn
  );

  G.state = unPrunedStates;
}

export function getRelevantState(
  ctx: Ctx,
  states: GlobalState[],
  card: Character | NonCharacter
): GlobalState[] {
  return states.filter((state) => {
    const turn = state.lifetime.turn
      ? !!state.lifetime.until
        ? state.lifetime.turn >= ctx.turn
        : state.lifetime.turn === ctx.turn
      : true;
    const applicableState = state.player === card.owner; // TODO: take into consideration location for owner. Currently targetOpponent covers this case

    return turn && applicableState;
  });
}
