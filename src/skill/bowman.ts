import { CardTypes, CardClasses } from '../card';
import { Choice, Decision } from '../stack';
import { Location } from '../target';
import { getRandomKey } from '../utils';

import { Skill } from './types';

export const l10beasy: Skill[] = [
  {
    requirements: { level: 10, class: { [CardClasses.Bowman]: 1 } },
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

export const l20beasy: Skill[] = [
  {
    action: 'damage',
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
];

export const l50bbtricky: Skill[] = [
  {
    requirements: { level: 50, class: { [CardClasses.Bowman]: 2 } },
    action: 'damage',
    opts: { damage: 20 },
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

export const l60bbrapid: Skill[] = [
  {
    requirements: { level: 60, class: { [CardClasses.Bowman]: 2 } },
    action: 'damage',
    opts: { damage: 20 },
    dialogPrompt: 'Select a monster',
    targets: {
      xor: [
        {
          type: CardTypes.Monster,
          location: Location.OppField,
          quantity: 1,
          quantityUpTo: true,
        },
      ],
    },
  },
  {
    requirements: { level: 60, class: { [CardClasses.Bowman]: 2 } },
    action: 'damage',
    opts: { damage: 20 },
    dialogPrompt: 'Select a character',
    noReset: true,
    targets: {
      xor: [
        {
          type: CardTypes.Character,
          location: Location.OppCharacter,
          quantity: 1,
        },
      ],
    },
  },
];

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

export const criticalshot: Skill[] = [
  {
    action: 'flip',
    requirements: { level: 0, oneshot: true },
    noReset: true,
    dialogPrompt: 'Choose heads or tails',
    choice: [Choice.Heads, Choice.Tails],
    opts: {
      dialogDecision: [battleBowDecision],
    },
  },
];

export const l60bbtricky: Skill[] = [
  {
    action: 'damage',
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
];

export const l30bbequip30: Skill[] = [
  {
    action: 'play',
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
];

export const l50bbnomercy: Skill[] = [
  {
    action: 'nomercy',
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
];

export const l80bbspawnequip120: Skill[] = [
  {
    action: 'play',
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
];

export const l50bbspawnthink40: Skill[] = [
  {
    action: 'play',
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
];

export const l80bbbdeadly: Skill[] = [
  {
    action: 'damage',
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
];

export const l30bbspawn30: Skill[] = [
  {
    action: 'play',
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
];

export const l60bbspawn70: Skill[] = [
  {
    action: 'play',
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
];

export const l40bbspawnequip30: Skill[] = [
  {
    action: 'play',
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
];

export const l60bspawnequip50: Skill[] = [
  {
    action: 'play',
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
];

export const l50bspawnthink40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 50,
      class: {
        [CardClasses.Bowman]: 1,
      },
    },
    targets: {
      xor: [
        {
          level: 40,
          type: CardTypes.Monster,
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

export const steadyhand: Skill[] = [
  {
    action: 'steadyhand',
    requirements: { level: 0, oneshot: true },
  },
];

export const rainofarrows: Skill[] = [
  {
    action: 'rainofarrows',
    opts: {
      damage: 20,
    },
    requirements: { level: 0 },
    noReset: true,
  },
];

export const l40bbthink40: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 40,
      class: {
        [CardClasses.Bowman]: 2,
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

export const powerkb: Skill[] = [
  {
    action: 'tuck',
    opts: {
      position: 1,
    },
    requirements: { level: 0 },
    noReset: true,
    targets: {
      type: CardTypes.Monster,
      location: Location.OppField,
      quantity: 1,
    },
  },
];

export const l60bbthinkequip50: Skill[] = [
  {
    action: 'play',
    requirements: {
      level: 60,
      class: {
        [CardClasses.Bowman]: 2,
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

const riskyshotDecision: Decision = {
  action: 'damage',
  selection: {},
  noReset: true,
  opts: { damage: 'CurrentLevel' },
  target: {
    type: CardTypes.Character,
    location: Location.OppCharacter,
    quantity: 1,
  },
  finished: false,
  key: getRandomKey(),
};

const questDecision: Decision = {
  action: 'quest',
  selection: {},
  finished: false,
  key: getRandomKey(),
};

export const riskyshot: Skill[] = [
  {
    action: 'flip',
    requirements: { level: 0 },
    noReset: true,
    dialogPrompt: 'Choose heads or tails',
    choice: [Choice.Heads, Choice.Tails],
    opts: {
      dialogDecision: [questDecision, riskyshotDecision],
    },
  },
];

export const soularrow: Skill[] = [
  {
    action: 'damage',
    opts: {
      damage: 40,
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
  {
    action: 'quest',
    requirements: { level: 0 },
  },
  {
    action: 'discard',
    dialogPrompt: 'Discard a card',
    requirements: { level: 0 },
    targets: {
      location: Location.Hand,
      quantity: 1,
    },
    noReset: true,
  },
];
