import { Ctx, PlayerID } from 'boardgame.io';

import { Action } from './actions';
import { Monster, Character, NonCharacter } from './card';
import { GameState } from './game';
import { checkDeadMonstersOnField } from './hook';
import { meetsTarget, ActionTargets } from './target';

export interface MonsterStateModifier {
  health?: number;
  attack?: number;
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
}

export interface GlobalState {
  owner: string;
  player: PlayerID;
  targets: ActionTargets; // TODO: Location not respected in this filter
  modifier: StateModifier;
  lifetime: StateLifetime;
  targetOpponent?: boolean;
}

export function getMonsterAtt(G: GameState, ctx: Ctx, card: Monster) {
  const modifiers = getRelevantState(ctx, G.state, card).filter((state) =>
    meetsTarget(G, ctx, state.targets, card)
  );

  const attMod = modifiers.reduce(
    (acc, mod) =>
      mod.modifier.monster?.attack ? acc + mod.modifier.monster.attack : acc,
    0
  );
  return attMod + card.attack;
}

export function getMonsterHealth(G: GameState, ctx: Ctx, card: Monster) {
  const modifiers = getRelevantState(ctx, G.state, card).filter((state) =>
    meetsTarget(G, ctx, state.targets, card)
  );
  const healthMod = modifiers.reduce(
    (acc, mod) =>
      mod.modifier.monster?.health ? acc + mod.modifier.monster.health : acc,
    0
  );
  return healthMod + card.health;
}

export function removeGlobalState(G: GameState, ctx: Ctx, card: NonCharacter) {
  if (card.ability.state) {
    const index = G.state.findIndex((state) => state.owner === card.key);
    G.state.splice(index, 1);
    checkDeadMonstersOnField(G, ctx);
  }
}

export function parseStateLifetime(ctx: Ctx, lifetime: StateLifetime): StateLifetime {
  if (!lifetime.setTurn) return lifetime;

  const turn = lifetime.setTurn === 'NextTurn' ? ctx.turn + 1 : ctx.turn;

  return { turn };
}

export function pruneStateStore(G: GameState, ctx: Ctx) {
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
    const turn = state.lifetime.turn ? state.lifetime.turn === ctx.turn : true;
    const applicableState = state.player === card.owner;

    return turn && applicableState;
  });
}
