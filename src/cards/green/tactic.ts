import { CardTypes, CardClasses, Tactic } from '../../card';
import { Choice, Decision } from '../../stack';
import { Location } from '../../target';
import { getRandomKey } from '../../utils';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Bowman,
  selected: false,
};

export const arrowblow: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'arrowblow',
  name: 'Arrow Blow',
  image: 'ArrowBlow',
  level: 10,
  skill: [
    {
      action: 'play',
      activated: false,
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

export const rainofarrows: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'rainofarrows',
  name: 'Rain Of Arrows',
  image: 'RainOfArrows',
  level: 40,
  skill: [
    {
      action: 'steadyhand',
      activated: false,
      requirements: { level: 0, oneshot: true },
    },
  ],
  ability: {
    skills: [
      {
        action: 'rainofarrows',
        activated: false,
        opts: {
          damage: 20,
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

export const soularrow: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'soularrow',
  name: 'Soul Arrow',
  image: 'SoulArrow',
  level: 30,
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
        activated: false,
        requirements: { level: 0 },
      },
      {
        action: 'discard',
        activated: false,
        requirements: { level: 0 },
        targets: {
          location: Location.Hand,
          quantity: 1,
        },
        noReset: true,
      },
    ],
  },
  ...defaultTypes,
};

export const focus: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'focus',
  name: 'Focus',
  image: 'Focus',
  level: 20,
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
        level: 40,
        type: CardTypes.Tactic,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    triggers: [
      {
        name: 'FocusTrigger',
        opts: {
          damage: 50,
        },
        lifetime: {
          usableTurn: 'ETBTurn',
          once: true,
        },
      },
    ],
  },
  ...defaultTypes,
};

export const powerknockback: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'powerknockback',
  name: 'Power Knock-Back',
  image: 'PowerKnockBack',
  level: 40,
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
    skills: [
      {
        action: 'tuck',
        activated: false,
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
    ],
  },
  ...defaultTypes,
};

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

export const riskyshot: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'riskyshot',
  name: 'Risky Shot',
  image: 'RiskyShot',
  level: 40,
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
  ability: {
    skills: [
      {
        action: 'flip',
        activated: false,
        requirements: { level: 0 },
        noReset: true,
        dialogPrompt: 'Choose heads or tails',
        choice: [Choice.Heads, Choice.Tails],
        opts: {
          dialogDecision: [questDecision, riskyshotDecision],
        },
      },
    ],
  },
  ...defaultTypes,
};
