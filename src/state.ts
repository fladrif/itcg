import { Ctx, PlayerID } from 'boardgame.io';

import { Action, ActionTargets, Location } from './actions';
import { Monster, NonCharacter } from './card';
import { GameState } from './game';
import { checkDeadMonstersOnField } from './hook';
import { filterSelections } from './target';
import { getCardLocation } from './utils';

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

export interface GlobalState {
  owner: string;
  player: PlayerID;
  targets: ActionTargets;
  modifier: StateModifier;
}

export function getMonsterAtt(G: GameState, ctx: Ctx, card: Monster) {
  const modifiers = G.state.filter(
    (state) => state.player === card.owner && meetsTarget(G, ctx, state.targets, card)
  );

  const attMod = modifiers.reduce(
    (acc, mod) =>
      mod.modifier.monster?.attack ? acc + mod.modifier.monster.attack : acc,
    0
  );
  return attMod + card.attack;
}

export function getMonsterHealth(G: GameState, ctx: Ctx, card: Monster) {
  const modifiers = G.state.filter(
    (state) => state.player === card.owner && meetsTarget(G, ctx, state.targets, card)
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

function meetsTarget(
  G: GameState,
  ctx: Ctx,
  targets: ActionTargets,
  card: NonCharacter
): boolean {
  const cardLoc = getCardLocation(G, ctx, card.key);
  const selection = { [cardLoc]: [card] };
  const recent: [Location, NonCharacter] = [cardLoc, card];

  const response = filterSelections(targets, selection, recent);

  return response.finished;
}
