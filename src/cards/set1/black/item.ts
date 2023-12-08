import { Item, CardTypes, CardSubTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './index';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

export const bluenightfox: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bluenightfox',
  name: 'Blue Nightfox',
  image: 'BlueNightfox',
  level: 70,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Thief]: 3,
        },
      },
      targets: {
        level: 'CurrentLevel',
        class: [CardClasses.Thief],
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
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

export const bloodslain: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'bloodslain',
  name: 'Blood Slain',
  image: 'BloodSlain',
  level: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 3,
        },
      },
      targets: {
        xor: [
          {
            level: 'CurrentLevel',
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'BloodSlainTrigger', opts: { damage: 10 } }],
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const coconutknife: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'coconutknife',
  name: 'Coconut Knife',
  image: 'CoconutKnife',
  level: 20,
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
    },
    {
      action: 'discard',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
      targets: {
        location: Location.Hand,
        quantity: 1,
      },
      noReset: true,
    },
  ],
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
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 70,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 70,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
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
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        level: 70,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { triggers: [{ name: 'EmeraldEarringsTrigger' }] },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};

export const kumbithrowingstar: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'kumbithrowingstar',
  name: 'Kumbi Throwing-Star',
  image: 'KumbiThrowingStar',
  level: 30,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 10,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        xor: [
          {
            level: 20,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
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
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
    },
    {
      action: 'discard',
      activated: false,
      requirements: {
        level: 0,
        oneshot: true,
      },
      targets: {
        location: Location.Hand,
        quantity: 1,
      },
      noReset: true,
    },
  ],
  ability: {
    triggers: [{ name: 'RedNightTrigger' }],
  },
  subtypes: [CardSubTypes.armor],
  ...defaultTypes,
};
