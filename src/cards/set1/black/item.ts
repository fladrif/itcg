import { Item, CardTypes, CardSubTypes } from '../../../card';
import { skillRef } from '../../../skill';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

export const bloodslain: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bloodslain',
  name: 'Blood Slain',
  image: 'BloodSlain',
  level: 50,
  skill: skillRef('l70tttsneakx'),
  ability: {
    triggers: [{ name: 'BloodSlainTrigger', opts: { damage: 10 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const bluenightfox: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bluenightfox',
  name: 'Blue Nightfox',
  image: 'BlueNightfox',
  level: 70,
  skill: skillRef('l40tttcrafty'),
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
      modifier: { monster: { keywords: ['confused'] } },
      targetOpponent: true,
      lifetime: {},
    },
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const coconutknife: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'coconutknife',
  name: 'Coconut Knife',
  image: 'CoconutKnife',
  level: 20,
  skill: skillRef('spy'),
  ability: {
    triggers: [{ name: 'BattleBowTrigger', lifetime: { turn: 0 }, opts: { damage: 10 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const darkshadow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'darkshadow',
  name: 'Dark Shadow',
  image: 'DarkShadow',
  level: 40,
  skill: skillRef('l60ttspawnequip70'),
  ability: {
    triggers: [{ name: 'DarkShadowTrigger', opts: { damage: -10 } }],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const emeraldearrings: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'emeraldearrings',
  name: 'Emerald Earrings',
  image: 'EmeraldEarrings',
  level: 30,
  skill: skillRef('l70ttsneak70'),
  ability: { triggers: [{ name: 'EmeraldEarringsTrigger' }] },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const kumbithrowingstar: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'kumbithrowingstar',
  name: 'Kumbi Throwing-Star',
  image: 'KumbiThrowingStar',
  level: 30,
  skill: skillRef('l10tequip20'),
  ability: {
    triggers: [{ name: 'KumbiTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const rednight: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'rednight',
  name: 'Red Night',
  image: 'RedNight',
  level: 10,
  skill: skillRef('spy'),
  ability: {
    triggers: [{ name: 'RedNightTrigger' }],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};
