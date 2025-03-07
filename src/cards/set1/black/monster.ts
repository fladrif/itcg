import { Monster, CardTypes, CardSubTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Monster,
  attacks: 1,
  damageTaken: 0,
};

export const buffy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'buffy',
  name: 'Buffy',
  image: 'Buffy',
  level: 61,
  attack: 40,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 20,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        level: 20,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'destroy',
        activated: false,
        requirements: { level: 0 },
        noReset: true,
        targets: {
          xor: [
            {
              location: Location.OppCharAction,
              quantity: 1,
            },
            {
              location: Location.CharAction,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.clown],
  ...defaultTypes,
};

export const cico: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'cico',
  name: 'Cico',
  image: 'Cico',
  level: 25,
  attack: 30,
  health: 20,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 30,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 30,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'LootTrigger' }],
  },
  subtypes: [CardSubTypes.water, CardSubTypes.beast],
  ...defaultTypes,
};

export const croco: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'croco',
  name: 'Croco',
  image: 'Croco',
  level: 52,
  attack: 70,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Thief]: 3,
        },
      },
      targets: {
        level: 'CurrentLevel',
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.reptile],
  ...defaultTypes,
};

export const krappy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'krappy',
  name: 'Krappy',
  image: 'Krappy',
  level: 24,
  attack: 60,
  health: 30,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: { damage: 10 },
      requirements: {
        level: 30,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.Field,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
          {
            location: Location.Character,
            quantity: 1,
          },
          {
            location: Location.OppCharacter,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: { keywords: ['confused'] },
  subtypes: [CardSubTypes.water, CardSubTypes.fish],
  ...defaultTypes,
};

export const krip: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'krip',
  name: 'Krip',
  image: 'Krip',
  level: 30,
  attack: 30,
  health: 20,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: { damage: 20 },
      requirements: {
        level: 70,
        class: {
          [CardClasses.Thief]: 2,
        },
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.Field,
            quantity: 1,
          },
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
          {
            location: Location.Character,
            quantity: 1,
          },
          {
            location: Location.OppCharacter,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.water, CardSubTypes.shrimp],
  ...defaultTypes,
};

export const lorang: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lorang',
  name: 'Lorang',
  image: 'Lorang',
  level: 37,
  attack: 40,
  health: 10,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        level: 50,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { keywords: ['tough'] },
  subtypes: [CardSubTypes.water, CardSubTypes.crab],
  ...defaultTypes,
};

export const orangemushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'orangemushroom',
  name: 'Orange Mushroom',
  image: 'OrangeMushroom',
  level: 8,
  attack: 30,
  health: 10,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        level: 40,
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    triggers: [{ name: 'LootTrigger' }],
  },
  subtypes: [CardSubTypes.mushroom],
  ...defaultTypes,
};

export const pinkteddy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'pinkteddy',
  name: 'Pink Teddy',
  image: 'PinkTeddy',
  level: 32,
  attack: 30,
  health: 30,
  skill: [
    {
      action: 'loot',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.toy, CardSubTypes.bear],
  ...defaultTypes,
};

export const propelly: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'propelly',
  name: 'Propelly',
  image: 'Propelly',
  level: 37,
  attack: 50,
  health: 20,
  skill: [
    {
      action: 'loot',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.flying, CardSubTypes.toy],
  ...defaultTypes,
};

export const redsnail: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'redsnail',
  name: 'Red Snail',
  image: 'RedSnail',
  level: 4,
  attack: 10,
  health: 20,
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
        level: 90,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { keywords: ['tough'] },
  subtypes: [CardSubTypes.pest],
  ...defaultTypes,
};

export const seacle: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'seacle',
  name: 'Seacle',
  image: 'Seacle',
  level: 23,
  attack: 20,
  health: 20,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Thief]: 1,
        },
      },
      targets: {
        xor: [
          {
            level: 30,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 30,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: { triggers: [{ name: 'SlipperyTrigger' }] },
  subtypes: [CardSubTypes.water, CardSubTypes.beast],
  ...defaultTypes,
};

export const soulteddy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'soulteddy',
  name: 'Soul Teddy',
  image: 'SoulTeddy',
  level: 63,
  attack: 50,
  health: 40,
  skill: [
    {
      action: 'loot',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {
    keywords: ['tough'],
    triggers: [{ name: 'StartleTrigger' }],
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.toy, CardSubTypes.bear],
  ...defaultTypes,
};
