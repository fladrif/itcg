import { ActionTargets, Location } from "./actions";
import { Character, NonCharacter } from "./card";
import { Selection } from "./stack";
import { deepCardComp } from "./utils";

interface FilterResponse {
  selection: Selection;
  finished: boolean;
  usedRecent: boolean;
}

export function filterSelections(
  filter: ActionTargets,
  selection: Selection,
  recent: [Location, Character | NonCharacter]
): FilterResponse {
  if ("location" in filter) {
    const locSelection = selection[filter.location];
    if (!locSelection) {
      return { selection, finished: false, usedRecent: false };
    }

    // Reverse assumes recent is pushed onto selection array; ie at the back
    const filteredSelection = locSelection.reverse().filter((selection) => {
      if (filter.type && filter.type !== selection.type) return false;
      if (filter.class && !filter.class.includes(selection.class)) return false;
      if (filter.level && filter.level < (selection as NonCharacter).level) {
        return false;
      }

      return true;
    });

    const nonFilteredSelection = locSelection.filter(
      (card) => !filteredSelection.includes(card)
    );

    const finished = filter.quantityUpTo
      ? true
      : filteredSelection.length >= filter.quantity;

    filteredSelection.splice(0, filter.quantity);
    selection[filter.location] = [...filteredSelection, ...nonFilteredSelection];

    const usedRecent = !!selection[recent[0]]!.find((card) =>
      deepCardComp(card, recent[1])
    )
      ? false
      : true;

    return { selection, finished, usedRecent };
  }

  if ("and" in filter) {
    let finished = true;
    let recency = false;

    for (const fil of filter.and!) {
      const recurRet = filterSelections(fil, selection, recent);
      finished = finished && recurRet.finished;
      recency = recency || recurRet.usedRecent;
    }

    return { selection, finished, usedRecent: recency };
  }

  if ("xor" in filter) {
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

  throw new Error(`Filter composed incorrectly: ${filter}`);
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
