import { ActionTargets, Location } from "./actions";
import { Character, NonCharacter } from "./card";
import { Selection } from "./stack";
import { deepCardComp } from "./utils";

export function filterSelections(
  filter: ActionTargets,
  sel: Selection,
  recent: [Location, Character | NonCharacter]
): [Selection, boolean, boolean] {
  if ("location" in filter) {
    if (!sel[filter.location]) return [sel, false, false];

    // Reverse assumes recent is pushed onto selection array; ie at the back
    const filteredSelection = sel[filter.location]!.reverse().filter((sel) => {
      if (filter.type && filter.type !== sel.type) return false;
      if (filter.class && !filter.class.includes(sel.class)) return false;
      if (filter.level && filter.level < (sel as NonCharacter).level) {
        return false;
      }

      return true;
    });

    const finished = filter.quantityUpTo
      ? true
      : filteredSelection.length >= filter.quantity;

    filteredSelection.splice(0, filter.quantity);
    sel[filter.location] = filteredSelection;

    const usedRecent = !!sel[recent[0]]!.find((card) => deepCardComp(card, recent[1]))
      ? false
      : true;

    return [sel, finished, usedRecent];
  }

  if ("and" in filter) {
    let finished = true;
    let recency = false;

    for (const fil of filter.and!) {
      const recurRet = filterSelections(fil, sel, recent);
      finished = finished && recurRet[1];
      recency = recency || recurRet[2];
    }

    return [sel, finished, recency];
  }

  if ("xor" in filter) {
    let leastSel = JSON.parse(JSON.stringify(sel));
    let finished = false;
    let usedRecent = false;

    for (const fil of filter.xor!) {
      const curSel = filterSelections(fil, JSON.parse(JSON.stringify(sel)), recent);

      if (betterFit(curSel, [leastSel, finished, usedRecent])) {
        leastSel = JSON.parse(JSON.stringify(curSel[0]));
        finished = curSel[1];
        usedRecent = curSel[2];
      }
    }

    return [leastSel, finished, usedRecent];
  }

  throw new Error(`Filter composed incorrectly: ${filter}`);
}

function betterFit(
  current: [Selection, boolean, boolean],
  best: [Selection, boolean, boolean]
): boolean {
  if (current[2] !== best[2]) return current[2];

  if (selectionLength(current[0]) < selectionLength(best[0])) return true;
  if (selectionLength(current[0]) == selectionLength(best[0])) return current[1];

  return false;
}

function selectionLength(sel: Selection): number {
  let total = 0;

  for (const loc of (Object.keys(sel) as unknown) as Location[]) {
    total += sel[loc]!.length;
  }

  return total;
}
