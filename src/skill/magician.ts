import { CardClasses, CardTypes } from '../card';
import { Location } from '../target';

import { Skill } from './types';
import { dmg20, quest } from './common';

export const l20mfirearrow: Skill[] = [
  {
    requirements: { level: 20, class: { [CardClasses.Magician]: 1 } },
    action: 'damage',
    opts: { damage: 10 },
    targets: {
      xor: [
        {
          location: Location.Character,
          quantity: 1,
        },
        {
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

export const l30mmthinkx: Skill[] = [
  {
    requirements: { level: 30, class: { [CardClasses.Magician]: 2 } },
    action: 'play',
    targets: {
      level: 'CurrentLevel',
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const l70mmmthunderspear: Skill[] = [
  {
    requirements: { level: 70, class: { [CardClasses.Magician]: 3 } },
    action: 'damage',
    opts: { damage: 40 },
    dialogPrompt: 'Select a character',
    targets: {
      xor: [
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

export const l60mmthinkequip70: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 60,
      class: {
        [CardClasses.Magician]: 2,
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
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
];

export const l30mmthink40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 30,
      class: {
        [CardClasses.Magician]: 2,
      },
    },
    targets: {
      level: 40,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const l40mmequip40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 40,
      class: {
        [CardClasses.Magician]: 2,
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

export const l50mmthinkequip50: Skill[] = [
  {
    action: 'play',
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
];

export const l40mmspawn40: Skill[] = [
  {
    action: 'play',
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
];

export const l30mspawn30: Skill[] = [
  {
    action: 'play',
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
];

export const l70mmspawnthink90: Skill[] = [
  {
    action: 'play',
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
];

export const conjure: Skill[] = [
  {
    action: 'conjure',
    requirements: { level: 0, oneshot: true },
  },
];

export const l80mmspawn120: Skill[] = [
  {
    action: 'play',
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
];

export const devious: Skill[] = [
  {
    action: 'bounce',
    requirements: { level: 0 },
    noReset: true,
    targets: {
      type: CardTypes.Tactic,
      location: Location.Discard,
      quantity: 1,
      quantityUpTo: true,
    },
  },
];

export const l60mmspawnthink70: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 60,
      class: {
        [CardClasses.Magician]: 2,
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
          type: CardTypes.Tactic,
          location: Location.Hand,
          quantity: 1,
        },
      ],
    },
  },
];

export const l30mequip30: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 30,
      class: {
        [CardClasses.Magician]: 1,
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

export const heal: Skill[] = [
  {
    action: 'refresh',
    opts: { lifegain: 80, overheal: false },
    requirements: { level: 0 },
  },
];

export const l40mmmthinkx: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 40,
      class: {
        [CardClasses.Magician]: 3,
      },
    },
    targets: {
      level: 'CurrentLevel',
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const knowledge: Skill[] = [
  {
    action: 'revealDeck',
    requirements: { level: 0 },
  },
  {
    action: 'bounce',
    requirements: { level: 0 },
    noReset: true,
    targets: {
      type: CardTypes.Tactic,
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

export const l20mthink30: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 20,
      class: {
        [CardClasses.Magician]: 1,
      },
    },
    targets: {
      level: 30,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const magicclaw: Skill[] = [...dmg20, ...dmg20];

export const l10massist: Skill[] = [
  {
    action: 'assist',
    requirements: {
      level: 10,
      class: {
        [CardClasses.Magician]: 1,
      },
    },
    opts: { damage: 10 },
  },
];

export const jumble: Skill[] = [
  {
    action: 'jumble',
    requirements: { level: 0, oneshot: true },
  },
];

export const mpeater: Skill[] = [
  {
    action: 'mpeater',
    requirements: { level: 0 },
    opts: { allOppMonster: true },
    noReset: true,
  },
  {
    action: 'damage',
    opts: { damage: 50 },
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

export const l30mthink40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 30,
      class: {
        [CardClasses.Magician]: 1,
      },
    },
    targets: {
      level: 40,
      type: CardTypes.Tactic,
      location: Location.Hand,
      quantity: 1,
    },
  },
];

export const sidequest: Skill[] = [...quest, ...quest];

export const l60mmmblast: Skill[] = [
  {
    action: 'damage',
    opts: { damage: 30 },
    requirements: {
      level: 60,
      class: {
        [CardClasses.Magician]: 3,
      },
    },
    targets: {
      location: Location.OppCharacter,
      quantity: 1,
    },
  },
];

export const thunderbolt: Skill[] = [
  {
    action: 'damage',
    opts: { damage: 50, allOppMonster: true },
    requirements: { level: 0 },
  },
  {
    action: 'damage',
    opts: { damage: 50, oppCharacter: true },
    requirements: { level: 0 },
  },
];
