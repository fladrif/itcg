import { Item, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

export const battleshield: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'battleshield',
  name: 'Battle Shield',
  image: 'BattleShield',
  level: 35,
  skill: skillRef('l50wwthinkequip40'),
  ability: {
    state: {
      targets: {
        xor: [
          {
            location: Location.OppField,
            quantity: 1,
            type: CardTypes.Monster,
          },
          {
            location: Location.Field,
            quantity: 1,
            type: CardTypes.Monster,
          },
        ],
      },
      modifier: { monster: { health: 20 } },
      lifetime: {},
    },
  },
  subtypes: [CardSubTypes.shield],
  ...defaultTypes,
};

export const doombringer: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'doombringer',
  name: 'Doombringer',
  image: 'Doombringer',
  level: 70,
  skill: skillRef('l60wwwroar'),
  ability: {
    triggers: [{ name: 'DoombringerTrigger', opts: { damage: 30 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const serpentstongue: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'serpentstongue',
  name: "Serpent's Tongue",
  image: 'SerpentsTongue',
  level: 50,
  skill: skillRef('l50wwcrush'),
  ability: {
    triggers: [{ name: 'SerpentsTrigger', opts: { lifegain: 30 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const theninedragons: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'theninedragons',
  name: 'The Nine Dragons',
  image: 'TheNineDragons',
  level: 50,
  skill: skillRef('l30wequip30'),
  ability: {
    state: {
      targets: {
        xor: [
          {
            location: Location.OppField,
            quantity: 1,
            type: CardTypes.Monster,
          },
          {
            location: Location.Field,
            quantity: 1,
            type: CardTypes.Monster,
          },
        ],
      },
      modifier: { monster: { attack: 20 } },
      lifetime: {},
    },
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};
