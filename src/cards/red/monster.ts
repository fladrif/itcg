import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Magician,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const bellflowerroot: Omit<Monster, 'key' | 'owner'> = {
  name: 'Bellflower Root',
  image: 'BellflowerRoot',
  level: 53,
  attack: 40,
  health: 60,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 50,
        class: {
          [CardClasses.Magician]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 50,
            type: CardTypes.Tactic,
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

export const darkaxestump: Omit<Monster, 'key' | 'owner'> = {
  name: 'Dark Axe Stump',
  image: 'DarkAxeStump',
  level: 22,
  attack: 10,
  health: 40,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 40,
        class: {
          [CardClasses.Magician]: 2,
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
  ability: {},
  ...defaultTypes,
};

export const jrnecki: Omit<Monster, 'key' | 'owner'> = {
  name: 'Jr. Necki',
  image: 'JrNecki',
  level: 21,
  attack: 30,
  health: 30,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 30,
        class: {
          [CardClasses.Magician]: 1,
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
  ability: {},
  ...defaultTypes,
};

export const lioner: Omit<Monster, 'key' | 'owner'> = {
  name: 'Lioner',
  image: 'Lioner',
  level: 53,
  attack: 50,
  health: 50,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 70,
        class: {
          [CardClasses.Magician]: 2,
        },
      },
      targets: {
        xor: [
          {
            level: 90,
            type: CardTypes.Tactic,
            location: Location.Hand,
            quantity: 1,
          },
          {
            level: 90,
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

export const octopus: Omit<Monster, 'key' | 'owner'> = {
  name: 'Octopus',
  image: 'Octopus',
  level: 12,
  attack: 10,
  health: 10,
  skill: [
    {
      action: 'quest',
      requirements: {
        level: 0,
        oneshot: true,
      },
      activated: false,
    },
  ],
  ability: {
    triggers: [{ name: 'GeniusTrigger' }],
  },
  ...defaultTypes,
};

export const peachmonkey: Omit<Monster, 'key' | 'owner'> = {
  name: 'Peach Monkey',
  image: 'PeachMonkey',
  level: 62,
  attack: 60,
  health: 60,
  skill: [
    {
      action: 'play',
      activated: false,
      requirements: {
        level: 80,
        class: { [CardClasses.Magician]: 2 },
      },
      targets: {
        level: 120,
        type: CardTypes.Monster,
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
        targets: {
          xor: [
            {
              type: CardTypes.Item,
              location: Location.Field,
              quantity: 1,
              quantityUpTo: true,
            },
            {
              type: CardTypes.Item,
              location: Location.OppField,
              quantity: 1,
              quantityUpTo: true,
            },
          ],
        },
      },
    ],
  },
  ...defaultTypes,
};

export const zetagray: Omit<Monster, 'key' | 'owner'> = {
  name: 'Zeta Gray',
  image: 'ZetaGray',
  level: 42,
  attack: 20,
  health: 20,
  skill: [
    {
      action: 'quest',
      requirements: { level: 0, oneshot: true },
      activated: false,
    },
  ],
  ability: {
    triggers: [{ name: 'GeniusTrigger' }],
  },
  ...defaultTypes,
};

export const zombielupin: Omit<Monster, 'key' | 'owner'> = {
  name: 'Zombie Lupin',
  image: 'ZombieLupin',
  level: 40,
  attack: 20,
  health: 20,
  skill: [
    {
      action: 'drinkpotion',
      requirements: { level: 0, oneshot: true },
      activated: false,
    },
  ],
  ability: {
    skills: [
      {
        action: 'bounce',
        activated: false,
        requirements: { level: 0 },
        targets: {
          type: CardTypes.Tactic,
          location: Location.Discard,
          quantity: 1,
          quantityUpTo: true,
        },
      },
    ],
  },
  ...defaultTypes,
};
