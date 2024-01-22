import { Item, CardTypes, CardSubTypes, CardClasses } from '../../../card';
import { Location } from '../../../target';
import { Choice, Decision } from '../../../stack';
import { getRandomKey } from '../../../utils';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Item,
};

const battleBowDecision: Decision = {
  action: 'damage',
  selection: {},
  noReset: true,
  opts: { damage: 'CurrentLevel' },
  target: {
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
  finished: false,
  key: getRandomKey(),
};

export const battlebow: Omit<Item, 'key' | 'owner'> = {
  canonicalName: 'battlebow',
  name: 'Battle Bow',
  image: 'BattleBow',
  level: 25,
  skill: [
    {
      action: 'flip',
      activated: false,
      requirements: { level: 0, oneshot: true },
      noReset: true,
      dialogPrompt: 'Choose heads or tails',
      choice: [Choice.Heads, Choice.Tails],
      opts: {
        dialogDecision: [battleBowDecision],
      },
    },
  ],
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
  skill: [
    {
      action: 'damage',
      activated: false,
      requirements: {
        level: 60,
        class: {
          [CardClasses.Bowman]: 2,
        },
      },
      opts: { damage: 20 },
      targets: {
        xor: [
          {
            type: CardTypes.Monster,
            location: Location.OppField,
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
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
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
  skill: [
    {
      action: 'nomercy',
      activated: false,
      opts: { damage: 10 },
      requirements: {
        level: 50,
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
  ability: { triggers: [{ name: 'GoldenCrowTrigger' }] },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};
