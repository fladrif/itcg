import { Location } from './actions';
import { Monster, isMonster } from './card';
import { Decision } from './stack';
import { Trigger } from './trigger';
import { deepCardComp, getLocation, getRandomKey } from './utils';

// TODO: Currently triggers on the entire damage decision, should split damage decision into constituent parts so shield triggers only on character damage (for damage decisions that affect characters and monsters)
export const shieldTrigger: Trigger = {
  owner: 'Global',
  name: 'shield',
  shouldTrigger: (G, _ctx, decision, prep) => {
    if (
      !G.stack!.decisionTriggers[decision.key].includes('shield') &&
      prep === 'Before' &&
      decision.action === 'damage' &&
      (!!decision.selection[Location.Character] ||
        !!decision.selection[Location.OppCharacter])
    ) {
      return true;
    }

    return false;
  },
  createDecision: (_G, _ctx, decision) => {
    const newDec: Decision = {
      action: 'shield',
      selection: {},
      finished: false,
      key: getRandomKey(),
      opts: {
        decision: decision.key,
      },
    };

    return [newDec];
  },
};

export const dmgDestroyTrigger: Trigger = {
  owner: 'Global',
  name: 'dmgDestroy',
  shouldTrigger: (G, ctx, decision, prep) => {
    const validLocations = [Location.Field, Location.OppField];

    const alreadyTriggered = G.stack!.decisionTriggers[decision.key].includes(
      'dmgDestroy'
    );
    const rightPrep = prep === 'After';
    const rightAction = decision.action === 'damage';

    const lethalDamage = validLocations.some(
      (location) =>
        !!decision.selection[location] &&
        decision.selection[location]!.some(
          (card) =>
            isMonster(card) &&
            getLocation(G, ctx, location)
              .filter((c) => deepCardComp(c, card))
              .some((card) => (card as Monster).damage >= (card as Monster).health)
        )
    );

    if (alreadyTriggered || !rightPrep || !rightAction || !lethalDamage) return false;
    return true;
  },
  createDecision: (G, ctx, decision) => {
    const validLocations = [Location.Field, Location.OppField];
    const decisions: Decision[] = [];

    validLocations.map((location) => {
      if (!decision.selection[location]) return;

      getLocation(G, ctx, location)
        .filter(
          (card) => !!decision.selection[location]!.find((c) => deepCardComp(c, card))
        )
        .map((card) => {
          if (isMonster(card) && card.damage >= card.health) {
            decisions.push({
              action: 'destroy',
              opts: {
                source: decision.opts!.source,
              },
              selection: {
                [location]: [card],
              },
              finished: true,
              key: getRandomKey(),
            });
          }
        });
    });

    return decisions;
  },
};
