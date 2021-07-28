import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Warrior,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const wildboar: Omit<Monster, 'key' | 'owner'> = {
  name: 'Wild Boar',
  image: 'WildBoar',
  level: 25,
  attack: 30,
  health: 30,
  skill: {
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
  ability: {},
  ...defaultTypes,
};

export const slime: Omit<Monster, 'key' | 'owner'> = {
  name: 'Slime',
  image: 'Slime',
  level: 6,
  attack: 10,
  health: 10,
  skill: {
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
  ability: {}, // TODO: destroy item
  ...defaultTypes,
};

export const greenmushroom: Omit<Monster, 'key' | 'owner'> = {
  name: 'Green Mushroom',
  image: 'GreenMushroom',
  level: 15,
  attack: 10,
  health: 40,
  skill: {
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
  ability: {},
  ...defaultTypes,
};

export const ribbonpig: Omit<Monster, 'key' | 'owner'> = {
  name: 'Ribbon Pig',
  image: 'RibbonPig',
  level: 10,
  attack: 20,
  health: 20,
  skill: {
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
  ability: {},
  ...defaultTypes,
};

export const fireboar: Omit<Monster, 'key' | 'owner'> = {
  name: 'Fire Boar',
  image: 'FireBoar',
  level: 32,
  attack: 10,
  health: 50,
  skill: {
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
  ability: { keywords: ['fierce'] },
  ...defaultTypes,
};

export const grizzly: Omit<Monster, 'key' | 'owner'> = {
  name: 'Grizzly',
  image: 'Grizzly',
  level: 56,
  attack: 50,
  health: 60,
  skill: {
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
  ability: {},
  ...defaultTypes,
};

export const blockgolem: Omit<Monster, 'key' | 'owner'> = {
  name: 'Block Golem',
  image: 'BlockGolem',
  level: 42,
  attack: 40,
  health: 40,
  skill: {
    action: 'scout',
    activated: false,
    requirements: { level: 0, turn: -1 },
  },
  ability: {},
  ...defaultTypes,
};

export const stonegolem: Omit<Monster, 'key' | 'owner'> = {
  name: 'Stone Golem',
  image: 'StoneGolem',
  level: 55,
  attack: 40,
  health: 70,
  skill: {
    action: 'scout',
    activated: false,
    requirements: { level: 0, turn: -1 },
  },
  ability: { triggers: [{ name: 'RelentlessTrigger', opts: { damage: 40 } }] },
  ...defaultTypes,
};

export const tauromacis: Omit<Monster, 'key' | 'owner'> = {
  name: 'Tauromacis',
  image: 'Tauromacis',
  level: 70,
  attack: 50,
  health: 40,
  skill: {
    action: 'trainHard',
    activated: false,
    requirements: { level: 0, turn: -1 },
  },
  ability: {
    triggers: [{ name: 'PrevailTrigger' }],
  },
  ...defaultTypes,
};

export const yetipepe: Omit<Monster, 'key' | 'owner'> = {
  name: 'Yeti & Pepe',
  image: 'YetiPepe',
  level: 78,
  attack: 50,
  health: 80,
  skill: {
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
  ability: {
    keywords: ['fierce'],
    triggers: [{ name: 'RelentlessTrigger', opts: { damage: 20 } }],
  },
  ...defaultTypes,
};
