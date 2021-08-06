import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Bowman,
  selected: false,
  attacks: 1,
  damageTaken: 0,
};

export const fairy: Omit<Monster, 'key' | 'owner'> = {
  name: 'Fairy',
  image: 'Fairy',
  level: 30,
  attack: 30,
  health: 20,
  skill: {
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
      type: CardTypes.Monster,
      location: Location.Hand,
      quantity: 1,
    },
  },
  ability: {
    triggers: [{ name: 'FairyTrigger' }],
  },
  ...defaultTypes,
};

export const drake: Omit<Monster, 'key' | 'owner'> = {
  name: 'Drake',
  image: 'Drake',
  level: 50,
  attack: 30,
  health: 40,
  skill: {
    action: 'damage',
    activated: false,
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
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: {
          damage: 30,
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
    ],
  },
  ...defaultTypes,
};

export const greentrixter: Omit<Monster, 'key' | 'owner'> = {
  name: 'Green Trixter',
  image: 'GreenTrixter',
  level: 28,
  attack: 20,
  health: 20,
  skill: {
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
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: {
          damage: 10,
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
    ],
  },
  ...defaultTypes,
};

export const jrboogie: Omit<Monster, 'key' | 'owner'> = {
  name: 'Jr. Boogie',
  image: 'JrBoogie',
  level: 35,
  attack: 30,
  health: 30,
  skill: {
    action: 'bounce',
    activated: false,
    requirements: { level: 0, oneshot: true },
    noReset: true,
    targets: {
      level: 30,
      type: CardTypes.Monster,
      location: Location.Discard,
      quantity: 1,
    },
  },
  ability: { keywords: ['stealthy'] },
  ...defaultTypes,
};

export const lunarpixie: Omit<Monster, 'key' | 'owner'> = {
  name: 'Lunar Pixie',
  image: 'LunarPixie',
  level: 45,
  attack: 40,
  health: 20,
  skill: {
    action: 'bounce',
    activated: false,
    requirements: { level: 0, oneshot: true },
    noReset: true,
    targets: {
      level: 30,
      type: CardTypes.Monster,
      location: Location.Discard,
      quantity: 1,
    },
  },
  ability: {
    keywords: ['stealthy'],
    skills: [
      {
        action: 'damage',
        activated: false,
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
    ],
  },
  ...defaultTypes,
};

export const stirge: Omit<Monster, 'key' | 'owner'> = {
  name: 'Stirge',
  image: 'Stirge',
  level: 20,
  attack: 30,
  health: 20,
  skill: {
    action: 'play',
    activated: false,
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
  ability: {},
  ...defaultTypes,
};

export const tweeter: Omit<Monster, 'key' | 'owner'> = {
  name: 'Tweeter',
  image: 'Tweeter',
  level: 39,
  attack: 20,
  health: 40,
  skill: {
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
  ability: {
    triggers: [{ name: 'RevengeTrigger' }],
  },
  ...defaultTypes,
};
