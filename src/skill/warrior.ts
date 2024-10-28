import { CardClasses, CardTypes } from '../card';
import { Location } from '../target';

import { Skill } from './types';

export const l10wbash: Skill[] = [
  {
    requirements: { level: 10, class: { [CardClasses.Warrior]: 1 } },
    action: 'damage',
    opts: { damage: 10 },
    targets: {
      xor: [
        {
          type: CardTypes.Monster,
          quantity: 1,
          location: Location.OppField,
        },
        {
          type: CardTypes.Character,
          quantity: 1,
          location: Location.OppCharacter,
        },
      ],
    },
  },
];

export const l30wwspawnx: Skill[] = [
  {
    requirements: { level: 30, class: { [CardClasses.Warrior]: 2 } },
    action: 'play',
    targets: {
      level: 'CurrentLevel',
      type: CardTypes.Monster,
      quantity: 1,
      location: Location.Hand,
    },
  },
];

export const l50wwbuff20: Skill[] = [
  {
    requirements: { level: 50, class: { [CardClasses.Warrior]: 2 } },
    action: 'buffall',
    opts: { damage: 20 },
  },
];

export const l50wwthinkequip40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 50,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
    targets: {
      xor: [
        {
          level: 40,
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
        {
          level: 40,
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
];

export const l60wwwroar: Skill[] = [
  {
    action: 'roar',
    requirements: {
      level: 60,
      class: {
        [CardClasses.Warrior]: 3,
      },
    },
    opts: {
      damage: 20,
    },
    targets: {
      xor: [
        {
          type: CardTypes.Character,
          location: Location.Character,
          quantity: 1,
        },
        {
          type: CardTypes.Character,
          location: Location.OppCharacter,
          quantity: 1,
        },
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
];

export const l50wwcrush: Skill[] = [
  {
    action: 'damage',
    requirements: {
      level: 50,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
    opts: {
      damage: 20,
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
      ],
    },
  },
];

export const l30wequip30: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 30,
      class: {
        [CardClasses.Warrior]: 1,
      },
    },
    targets: {
      level: 30,
      type: CardTypes.Item,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const pull: Skill[] = [
  {
    action: 'revealDeck',
    requirements: { level: 0 },
  },
  {
    action: 'bounce',
    requirements: { level: 0 },
    noReset: true,
    targets: {
      type: CardTypes.Monster,
      location: Location.Deck,
      quantity: 1,
      quantityUpTo: true,
    },
  },
  {
    action: 'shuffle',
    requirements: { level: 0 },
  },
];

export const l70wspawnthink90: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 70,
      class: {
        [CardClasses.Warrior]: 1,
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
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
];

export const resting: Skill[] = [
  {
    requirements: { level: 0 },
    action: 'refresh',
    opts: {
      lifegain: 20,
    },
  },
  {
    requirements: { level: 0 },
    action: 'quest',
  },
];

export const l30wwspawn40: Skill[] = [
  {
    action: 'play',
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
];

export const l70wwspawnequip90: Skill[] = [
  {
    action: 'play',
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
];

export const l50wwwspawnx: Skill[] = [
  {
    action: 'play',
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
];

export const l50wwbuff10: Skill[] = [
  {
    action: 'buffall',
    opts: { damage: 10 },
    requirements: {
      level: 50,
      class: {
        [CardClasses.Warrior]: 2,
      },
    },
  },
];

export const l60wspawnthink70: Skill[] = [
  {
    action: 'play',
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
];

export const l10wspawn20: Skill[] = [
  {
    action: 'play',
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
];

export const l40wwrefresh: Skill[] = [
  {
    action: 'refresh',
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
];

export const trainhard: Skill[] = [
  {
    action: 'trainhard',
    requirements: { level: 0, oneshot: true },
  },
];

export const l40wwthinkequip30: Skill[] = [
  {
    action: 'play',
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
];

export const l70wwwspawnequip100: Skill[] = [
  {
    action: 'play',
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
];

export const l50wwwbloodthirsty: Skill[] = [
  {
    requirements: { level: 50, class: { [CardClasses.Warrior]: 3 } },
    action: 'bloodthirsty',
    targets: {
      location: Location.CharAction,
      quantity: 1,
    },
  },
];
