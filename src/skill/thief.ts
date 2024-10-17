import { CardClasses, CardTypes } from '../card';
import { Location } from '../target';

import { Skill } from './types';

export const l10tstab: Skill[] = [
  {
    requirements: { level: 10, class: { [CardClasses.Thief]: 1 } },
    action: 'damage',
    opts: { damage: 10 },
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

export const l30tstab: Skill[] = [
  {
    action: 'damage',
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
];

export const l70ttslash: Skill[] = [
  {
    action: 'damage',
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
];

export const l20tequipx: Skill[] = [
  {
    requirements: { level: 20, class: { [CardClasses.Thief]: 1 } },
    action: 'play',
    targets: {
      level: 'CurrentLevel',
      type: CardTypes.Item,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const l40ttsneak40: Skill[] = [
  {
    requirements: { level: 40, class: { [CardClasses.Thief]: 2 } },
    action: 'play',
    targets: {
      level: 40,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const l40tttcrafty: Skill[] = [
  {
    action: 'play',
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
];

export const l70tttsneakx: Skill[] = [
  {
    action: 'play',
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
];

export const l60ttspawnequip70: Skill[] = [
  {
    action: 'play',
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
];

export const l70ttsneak70: Skill[] = [
  {
    action: 'play',
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
];

export const l10tequip20: Skill[] = [
  {
    action: 'play',
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
];

export const l20sneak20: Skill[] = [
  {
    action: 'play',
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
];

export const l40ttspawnequip30: Skill[] = [
  {
    action: 'play',
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
];

export const l30tttequipx: Skill[] = [
  {
    action: 'play',
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
];

export const l50tspawn50: Skill[] = [
  {
    action: 'play',
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
];

export const l30tequip40: Skill[] = [
  {
    action: 'play',
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
];

export const l70ttspawn90: Skill[] = [
  {
    action: 'play',
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
];

export const l30tspawnthink30: Skill[] = [
  {
    action: 'play',
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
];

export const avenger: Skill[] = [
  {
    requirements: { level: 0 },
    action: 'destroy',
    noReset: true,
    targets: {
      xor: [
        {
          quantity: 3,
          quantityUpTo: true,
          type: CardTypes.Monster,
          location: Location.OppField,
        },
      ],
    },
  },
  {
    requirements: { level: 0 },
    action: 'quest',
  },
];

export const l70tthink90: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 70,
      class: {
        [CardClasses.Thief]: 1,
      },
    },
    targets: {
      level: 90,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const swipe: Skill[] = [
  {
    action: 'discard',
    dialogPrompt: 'Discard a card',
    requirements: { level: 0 },
    noReset: true,
    opts: { randomDiscard: true },
  },
];
