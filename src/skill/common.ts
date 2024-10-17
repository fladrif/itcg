import { CardTypes } from '../card';
import { Location } from '../target';

import { Skill } from './types';

export const blank: Skill[] = [
  {
    requirements: { level: 1000 },
    action: 'quest',
  },
];

export const l10quest: Skill[] = [
  {
    requirements: { level: 10 },
    action: 'quest',
  },
];

export const l20quest: Skill[] = [
  {
    requirements: { level: 20 },
    action: 'quest',
  },
];

export const quest: Skill[] = [
  {
    action: 'quest',
    requirements: { level: 0, oneshot: true },
  },
];

export const jumpquest: Skill[] = [
  {
    action: 'quest',
    requirements: { level: 70, oneshot: true },
  },
  {
    action: 'quest',
    requirements: { level: 70, oneshot: true },
  },
];

export const spy: Skill[] = [
  {
    action: 'quest',
    requirements: {
      level: 0,
      oneshot: true,
    },
  },
  {
    action: 'discard',
    dialogPrompt: 'Discard a card',
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
];

export const loot: Skill[] = [
  {
    action: 'loot',
    requirements: { level: 0, oneshot: true },
  },
];

export const drinkpotion: Skill[] = [
  {
    action: 'drinkpotion',
    requirements: { level: 0, oneshot: true },
  },
];

export const scout: Skill[] = [
  {
    action: 'scout',
    requirements: { level: 0, oneshot: true },
  },
];

export const revive30: Skill[] = [
  {
    action: 'bounce',
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
];

export const revive50: Skill[] = [
  {
    action: 'bounce',
    requirements: { level: 0, oneshot: true },
    noReset: true,
    targets: {
      level: 50,
      levelHigher: true,
      type: CardTypes.Monster,
      location: Location.Discard,
      quantity: 1,
      quantityUpTo: true,
    },
  },
];

export const destroyskill: Skill[] = [
  {
    action: 'destroy',
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
];

export const destroyitem: Skill[] = [
  {
    requirements: { level: 0 },
    action: 'destroy',
    noReset: true,
    targets: {
      xor: [
        {
          type: CardTypes.Item,
          location: Location.Field,
          quantityUpTo: true,
          quantity: 1,
        },
        {
          type: CardTypes.Item,
          location: Location.OppField,
          quantityUpTo: true,
          quantity: 1,
        },
      ],
    },
  },
];

export const destroymonster: Skill[] = [
  {
    action: 'destroy',
    requirements: { level: 0 },
    noReset: true,
    targets: {
      xor: [
        {
          type: CardTypes.Monster,
          location: Location.Field,
          quantity: 1,
          quantityUpTo: true,
        },
        {
          type: CardTypes.Monster,
          location: Location.OppField,
          quantity: 1,
          quantityUpTo: true,
        },
      ],
    },
  },
];

export const dmg10: Skill[] = [
  {
    action: 'damage',
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
];

export const dmg20: Skill[] = [
  {
    action: 'damage',
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
];

export const dmg30: Skill[] = [
  {
    action: 'damage',
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
];

export const dmg80: Skill[] = [
  {
    action: 'damage',
    opts: { damage: 80 },
    requirements: { level: 0 },
    noReset: true,
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
];
