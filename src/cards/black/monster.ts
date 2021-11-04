import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Thief,
  selected: false,
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
  // TODO: de level char
  ability: {
    skills: [
      {
        action: 'destroy',
        activated: false,
        requirements: { level: 0 },
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
  ...defaultTypes,
};
