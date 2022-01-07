import { Monster, CardTypes, CardSubTypes, CardClasses } from '../../card';
import { Location } from '../../target';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Warrior,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const blockgolem: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'blockgolem',
  name: 'Block Golem',
  image: 'BlockGolem',
  level: 42,
  attack: 40,
  health: 40,
  skill: [
    {
      action: 'scout',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.guardian],
  ...defaultTypes,
};

export const fireboar: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'fireboar',
  name: 'Fire Boar',
  image: 'FireBoar',
  level: 32,
  attack: 10,
  health: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      targets: {
        level: 40,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: { keywords: ['fierce'] },
  subtypes: [CardSubTypes.fire, CardSubTypes.boar],
  ...defaultTypes,
};

export const greenmushroom: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'greenmushroom',
  name: 'Green Mushroom',
  image: 'GreenMushroom',
  level: 15,
  attack: 10,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 90,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 90,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.mushroom],
  ...defaultTypes,
};

export const grizzly: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'grizzly',
  name: 'Grizzly',
  image: 'Grizzly',
  level: 56,
  attack: 50,
  health: 60,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Warrior]: 3,
        },
      },
      targets: {
        level: 'CurrentLevel',
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.bear],
  ...defaultTypes,
};

export const jryeti: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'jryeti',
  name: 'Jr. Yeti',
  image: 'JrYeti',
  level: 50,
  attack: 20,
  health: 50,
  skill: [
    {
      action: 'damage',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      opts: { damage: 20 },
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
        ],
      },
    },
  ],
  ability: { keywords: ['fierce'] },
  subtypes: [CardSubTypes.ice, CardSubTypes.beast],
  ...defaultTypes,
};

export const officerskeleton: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'officerskeleton',
  name: 'Officer Skeleton',
  image: 'OfficerSkeleton',
  level: 63,
  attack: 50,
  health: 60,
  skill: [
    {
      action: 'buffall',
      activated: false,
      opts: { damage: 10 },
      requirements: {
        level: 50,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
    },
  ],
  ability: {
    triggers: [{ name: 'BoneRattleTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.undead, CardSubTypes.soldier],
  ...defaultTypes,
};
export const pepe: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'pepe',
  name: 'Pepe',
  image: 'Pepe',
  level: 60,
  attack: 40,
  health: 70,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Warrior]: 1,
        },
      },
      targets: {
        xor: [
          {
            level: 70,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 70,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    triggers: [{ name: 'RelentlessTrigger', opts: { damage: 10 } }],
  },
  subtypes: [CardSubTypes.king, CardSubTypes.ice, CardSubTypes.bird],
  ...defaultTypes,
};

export const ribbonpig: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'ribbonpig',
  name: 'Ribbon Pig',
  image: 'RibbonPig',
  level: 10,
  attack: 20,
  health: 20,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 10,
        class: {
          [CardClasses.Warrior]: 1,
        },
      },
      targets: {
        level: 20,
        type: CardTypes.Monster,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.boar],
  ...defaultTypes,
};

export const sentinel: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'sentinel',
  name: 'Sentinel',
  image: 'Sentinel',
  level: 30,
  attack: 20,
  health: 30,
  skill: [
    {
      action: 'scout',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.mechanical, CardSubTypes.guardian],
  ...defaultTypes,
};

export const slime: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'slime',
  name: 'Slime',
  image: 'Slime',
  level: 6,
  attack: 10,
  health: 10,
  skill: [
    {
      action: 'refresh',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      opts: {
        lifegain: 10,
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'destroy',
        requirements: { level: 0 },
        targets: {
          location: Location.OppField,
          type: CardTypes.Item,
          quantity: 1,
          quantityUpTo: true,
        },
        noReset: true,
        activated: false,
      },
    ],
  },
  subtypes: [CardSubTypes.goo],
  ...defaultTypes,
};

export const stonegolem: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'stonegolem',
  name: 'Stone Golem',
  image: 'StoneGolem',
  level: 55,
  attack: 40,
  health: 70,
  skill: [
    {
      action: 'scout',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: { triggers: [{ name: 'RelentlessTrigger', opts: { damage: 40 } }] },
  subtypes: [CardSubTypes.goo],
  ...defaultTypes,
};

export const tauromacis: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'tauromacis',
  name: 'Tauromacis',
  image: 'Tauromacis',
  level: 70,
  attack: 50,
  health: 40,
  skill: [
    {
      action: 'trainhard',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {
    triggers: [{ name: 'PrevailTrigger' }],
  },
  subtypes: [CardSubTypes.bull, CardSubTypes.human],
  ...defaultTypes,
};

export const wildboar: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'wildboar',
  name: 'Wild Boar',
  image: 'WildBoar',
  level: 25,
  attack: 30,
  health: 30,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Warrior]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 30,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 30,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {},
  subtypes: [CardSubTypes.boar],
  ...defaultTypes,
};

export const yetipepe: Omit<Monster, 'key' | 'owner'> = {
  canonicalName: 'yetipepe',
  name: 'Yeti & Pepe',
  image: 'YetiPepe',
  level: 78,
  attack: 50,
  health: 80,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Warrior]: 3,
        },
      },
      targets: {
        xor: [
          {
            level: 100,
            type: CardTypes.Item,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 100,
            type: CardTypes.Monster,
            location: Location.Hand,
            quantity: 1,
          },
        ],
      },
    },
  ],
  ability: {
    keywords: ['fierce'],
    triggers: [{ name: 'RelentlessTrigger', opts: { damage: 20 } }],
  },
  subtypes: [CardSubTypes.ice, CardSubTypes.bird, CardSubTypes.beast],
  ...defaultTypes,
};
