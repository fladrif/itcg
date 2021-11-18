import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Bowman,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const cerebes: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'cerebes',
  name: 'Cerebes',
  image: 'Cerebes',
  level: 72,
  attack: 70,
  health: 70,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 80,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 120,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 120,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: { triggers: [{ name: 'EarthquakeTrigger', opts: { damage: 40 } }] },
  ...defaultTypes,
};

export const curseeye: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'curseeye',
  name: 'Curse Eye',
  image: 'CurseEye',
  level: 35,
  attack: 30,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 40,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 40,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {},
  ...defaultTypes,
};

export const drake: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'drake',
  name: 'Drake',
  image: 'Drake',
  level: 50,
  attack: 30,
  health: 40,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: {
        damage: 30,
      },
      requirements: {
        level: 80,
        class: {
          [CardClasses.Bowman]: 3,
        },
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: {
          damage: 30,
        },
        requirements: { level: 0 },
        noReset: true,
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              type: CardTypes.Character,
              location: Location.OppCharacter,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};

export const fairy: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'fairy',
  name: 'Fairy',
  image: 'Fairy',
  level: 30,
  attack: 30,
  health: 20,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      targets: {
        level: 30,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    triggers: [{ name: 'FairyTrigger' }],
  },
  ...defaultTypes,
};

export const greentrixter: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'greentrixter',
  name: 'Green Trixter',
  image: 'GreenTrixter',
  level: 28,
  attack: 20,
  health: 20,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: {
        damage: 10,
      },
      requirements: {
        level: 20,
        class: {
          [CardClasses.Bowman]: 1,
        },
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: {
          damage: 10,
        },
        requirements: { level: 0 },
        noReset: true,
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              type: CardTypes.Character,
              location: Location.OppCharacter,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};

export const hector: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'hector',
  name: 'Hector',
  image: 'Hector',
  level: 50,
  attack: 50,
  health: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      targets: {
        level: 70,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    triggers: [
      {
        name: 'BuffAllTrigger',
        opts: { damage: 10 },
        lifetime: { usableTurn: 'ETBTurn' },
      },
    ],
  },
  ...defaultTypes,
};

export const hornedmushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'hornedmushroom',
  name: 'Horned Mushroom',
  image: 'HornedMushroom',
  level: 22,
  attack: 20,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Bowman]: 2,
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
  ability: {},
  ...defaultTypes,
};

export const jrboogie: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'jrboogie',
  name: 'Jr. Boogie',
  image: 'JrBoogie',
  level: 35,
  attack: 30,
  health: 30,
  skill: [
    {
      action: 'bounce',
      activated: false,
      requirements: { level: 0, oneshot: true },
      noReset: true,
      targets: {
        level: 30,
        type: CardTypes.Monster,
        location: Location.Discard,
        quantity: 1,
        quantityUpTo: true,
      },
    },
  ],
  ability: { keywords: ['stealthy'] },
  ...defaultTypes,
};

export const lunarpixie: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'lunarpixie',
  name: 'Lunar Pixie',
  image: 'LunarPixie',
  level: 45,
  attack: 40,
  health: 20,
  skill: [
    {
      action: 'bounce',
      activated: false,
      requirements: { level: 0, oneshot: true },
      noReset: true,
      targets: {
        level: 30,
        type: CardTypes.Monster,
        location: Location.Discard,
        quantity: 1,
        quantityUpTo: true,
      },
    },
  ],
  ability: {
    keywords: ['stealthy'],
    skills: [
      {
        action: 'damage',
        activated: false,
        noReset: true,
        opts: {
          damage: 20,
        },
        requirements: { level: 0 },
        targets: {
          xor: [
            {
              type: CardTypes.Monster,
              location: Location.OppField,
              quantity: 1,
            },
            {
              type: CardTypes.Character,
              location: Location.OppCharacter,
              quantity: 1,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};

export const platoonchronos: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'platoonchronos',
  name: 'Platoon Chronos',
  image: 'PlatoonChronos',
  level: 41,
  attack: 30,
  health: 40,
  skill: [
    {
      action: 'bounce',
      activated: false,
      requirements: { level: 0, oneshot: true },
      noReset: true,
      targets: {
        level: 30,
        type: CardTypes.Monster,
        location: Location.Discard,
        quantity: 1,
        quantityUpTo: true,
      },
    },
  ],
  ability: { keywords: ['stealthy'] },
  ...defaultTypes,
};

export const stirge: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'stirge',
  name: 'Stirge',
  image: 'Stirge',
  level: 20,
  attack: 30,
  health: 20,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Bowman]: 1,
        },
      },
      targets: {
        xor: [
          {
            level: 50,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 50,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {},
  ...defaultTypes,
};

export const tweeter: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'tweeter',
  name: 'Tweeter',
  image: 'Tweeter',
  level: 39,
  attack: 20,
  health: 40,
  skill: [
    {
      action: 'damage',
      activated: false,
      opts: {
        damage: 20,
      },
      requirements: {
        level: 60,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.OppField,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'RevengeTrigger' }],
  },
  ...defaultTypes,
};
