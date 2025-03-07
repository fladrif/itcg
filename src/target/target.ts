import { FuncContext, PlayerState } from '../game';
import { Character, NonCharacter } from '../card';
import { Selection } from '../stack';
import { deepCardComp, getCardLocation } from '../utils';

import { ActionTargets, FilterResponse, TargetFilter, Location } from './types';

export function mayFinished(filter?: ActionTargets): boolean {
  if (!filter) return false;

  if ('location' in filter) return isFilterMay(filter);

  if ('and' in filter) return !filter.and!.some((filt) => !mayFinished(filt));

  if ('xor' in filter) return filter.xor!.some((filt) => mayFinished(filt));

  throw new Error(`Filter composed incorrectly: ${filter}`);
}

export function ensureFilter(filter: ActionTargets, state: PlayerState): ActionTargets {
  if ('and' in filter) return { and: filter.and!.map((fil) => ensureFilter(fil, state)) };
  if ('xor' in filter) return { xor: filter.xor!.map((fil) => ensureFilter(fil, state)) };

  const level = filter.level === 'CurrentLevel' ? state.level : filter.level;
  return { ...filter, level };
}

export function meetsTarget(
  fnCtx: FuncContext,
  targets: ActionTargets,
  card: Character | NonCharacter
): boolean {
  const { G, ctx } = fnCtx;

  const cardLoc = getCardLocation(G, ctx, card.key);
  const selection = { [cardLoc]: [card] };
  const recent: [Location, Character | NonCharacter] = [cardLoc, card];

  const response = filterSelections(targets, selection, recent);

  return response.finished;
}

export function filterSelections(
  filter: ActionTargets,
  selection: Selection,
  recent: [Location, Character | NonCharacter]
): FilterResponse {
  if ('location' in filter) return handleFilter(filter, selection, recent);

  if ('and' in filter) return handleAND(filter, selection, recent);

  if ('xor' in filter) return handleXOR(filter, selection, recent);

  throw new Error(`Filter composed incorrectly: ${filter}`);
}

function handleFilter(
  filter: TargetFilter,
  selection: Selection,
  recent: [Location, Character | NonCharacter]
): FilterResponse {
  const locSelection = selection[filter.location];

  if (!locSelection) {
    return { selection, finished: false, usedRecent: false };
  }

  // Reverse assumes recent is pushed onto selection array; ie at the back
  const filteredSelection = locSelection
    .reverse()
    .filter((card) => cardInFilter(filter, card));

  const nonFilteredSelection = locSelection.filter(
    (card) => !filteredSelection.includes(card)
  );

  const finished = filter.quantityUpTo
    ? true
    : filteredSelection.length >= filter.quantity;

  filteredSelection.splice(0, filter.quantity);
  selection[filter.location] = [...filteredSelection, ...nonFilteredSelection];

  const usedRecent = !!selection[recent[0]]!.find((card) => deepCardComp(card, recent[1]))
    ? false
    : true;

  return { selection, finished, usedRecent };
}

function handleAND(
  filter: ActionTargets,
  selection: Selection,
  recent: [Location, Character | NonCharacter]
): FilterResponse {
  let finished = true;
  let recency = false;

  // TODO: need to check for order, certain filters have priority over others (more restrictive vs more permissive)
  for (const fil of filter.and!) {
    const recurRet = filterSelections(fil, selection, recent);
    finished = finished && recurRet.finished;
    recency = recency || recurRet.usedRecent;
  }

  return { selection, finished, usedRecent: recency };
}

function handleXOR(
  filter: ActionTargets,
  selection: Selection,
  recent: [Location, Character | NonCharacter]
): FilterResponse {
  let leastSel = JSON.parse(JSON.stringify(selection));
  let finished = false;
  let usedRecent = false;

  for (const fil of filter.xor!) {
    const curSel = filterSelections(fil, JSON.parse(JSON.stringify(selection)), recent);

    if (betterFit(curSel, { selection: leastSel, finished, usedRecent })) {
      leastSel = JSON.parse(JSON.stringify(curSel.selection));
      finished = curSel.finished;
      usedRecent = curSel.usedRecent;
    }
  }

  return { selection: leastSel, finished, usedRecent };
}

function cardInFilter(filter: TargetFilter, card: Character | NonCharacter): boolean {
  if (filter.cardKey && !filter.cardKey.includes(card.key)) return false;
  if (filter.excludeCardKey?.includes(card.key)) return false;
  if (filter.type && filter.type !== card.type) return false;
  if (
    filter.subtype &&
    (!('subtypes' in card) ||
      !filter.subtype.some((type) => card.subtypes.includes(type)))
  )
    return false;
  if (filter.class && !filter.class.includes(card.class)) return false;
  if (filter.level !== undefined && filter.level !== 'CurrentLevel') {
    if (
      !filter.levelHigher
        ? filter.level < (card as NonCharacter).level
        : filter.level > (card as NonCharacter).level
    )
      return false;
  }

  return true;
}

function isFilterMay(filter: TargetFilter): boolean {
  return !!filter.quantityUpTo;
}

function betterFit(current: FilterResponse, best: FilterResponse): boolean {
  if (current.usedRecent !== best.usedRecent) return current.usedRecent;

  if (selectionLength(current.selection) < selectionLength(best.selection)) return true;
  if (selectionLength(current.selection) == selectionLength(best.selection)) {
    return current.finished;
  }

  return false;
}

function selectionLength(sel: Selection): number {
  let total = 0;

  for (const loc of Object.keys(sel) as Location[]) {
    total += sel[loc]!.length;
  }

  return total;
}
