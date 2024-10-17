import { Item, CardTypes, CardSubTypes } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';
import { skillRef } from '../../../skill';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

export const battlebow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'battlebow',
  name: 'Battle Bow',
  image: 'BattleBow',
  level: 25,
  skill: skillRef('criticalshot'),
  ability: {
    triggers: [{ name: 'BattleBowTrigger', lifetime: { turn: 0 }, opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const blackrobinhat: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'blackrobinhat',
  name: 'Black Robin Hat',
  image: 'BlackRobinHat',
  level: 20,
  skill: skillRef('l60bbtricky'),
  ability: {
    state: {
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            subtype: [CardSubTypes.flying],
            location: Location.OppField,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            subtype: [CardSubTypes.flying],
            location: Location.Field,
            quantity: 1,
          },
        ],
      },
      modifier: { monster: { attack: 10 } },
      lifetime: {},
    },
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const bluediros: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bluediros',
  name: 'Blue Diros',
  image: 'BlueDiros',
  level: 20,
  skill: skillRef('l30bbequip30'),
  ability: {
    triggers: [
      { name: 'BlueDirosTrigger', lifetime: { turn: 0 }, opts: { damage: -10 } },
    ],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const goldencrow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'goldencrow',
  name: 'Golden Crow',
  image: 'GoldenCrow',
  level: 60,
  skill: skillRef('l50bbnomercy'),
  ability: { triggers: [{ name: 'GoldenCrowTrigger', lifetime: { turn: 0 } }] },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};
