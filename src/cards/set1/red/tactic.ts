import { CardTypes, CardSubTypes, CardClasses, Skill, Tactic } from '../../../card';
import { Location } from '../../../target';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

const magicclawAbility: Skill = {
  requirements: { level: 0 },
  action: 'damage',
  activated: false,
  noReset: true,
  opts: {
    damage: 20,
  },
  targets: {
    xor: [
      {
        quantity: 1,
        type: CardTypes.Monster,
        location: Location.OppField,
      },
      {
        quantity: 1,
        location: Location.OppCharacter,
      },
    ],
  },
};

export const energybolt: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'energybolt',
  name: 'Energy Bolt',
  image: 'EnergyBolt',
  level: 40,
  skill: [
    {
      action: 'play',
      activated: false,
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
  ],
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
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
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const heal: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'heal',
  name: 'Heal',
  image: 'Heal',
  level: 40,
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
        type: CardTypes.Item,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [
      {
        action: 'refresh',
        activated: false,
        opts: { lifegain: 80, overheal: false },
        requirements: { level: 0 },
      },
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const knowledgeispower: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'knowledgeispower',
  name: 'Knowledge Is Power',
  image: 'KnowledgeIsPower',
  level: 20,
  skill: [
    {
      action: 'play',
      activated: false,
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
  ],
  ability: {
    skills: [
      {
        action: 'revealDeck',
        activated: false,
        requirements: { level: 0 },
      },
      {
        action: 'bounce',
        activated: false,
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
        activated: false,
        requirements: { level: 0 },
      },
    ],
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const magicclaw: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'magicclaw',
  name: 'Magic Claw',
  image: 'MagicClaw',
  level: 20,
  skill: [
    {
      action: 'play',
      activated: false,
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
  ],
  ability: {
    skills: [magicclawAbility, magicclawAbility],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const meditation: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'meditation',
  name: 'Meditation',
  image: 'Meditation',
  level: 30,
  skill: [
    {
      action: 'assist',
      activated: false,
      requirements: {
        level: 10,
        class: {
          [CardClasses.Magician]: 1,
        },
      },
      opts: { damage: 10 },
    },
  ],
  ability: {
    triggers: [
      {
        name: 'MeditationTrigger',
        opts: {
          damage: 40,
        },
        lifetime: {
          usableTurn: 'ETBTurn',
          once: true,
        },
      },
    ],
    skills: [
      {
        action: 'quest',
        activated: false,
        requirements: { level: 0 },
      },
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

const questSkill: Skill = {
  action: 'quest',
  activated: false,
  requirements: { level: 0 },
};

export const sidequest: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'sidequest',
  name: 'Side Quest',
  image: 'SideQuest',
  level: 40,
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
        level: 40,
        type: CardTypes.Tactic,
        location: Location.Hand,
        quantity: 1,
      },
    },
  ],
  ability: {
    skills: [questSkill, questSkill],
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const teleport: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'teleport',
  name: 'Teleport',
  image: 'Teleport',
  level: 50,
  skill: [
    {
      action: 'quest',
      activated: false,
      requirements: { level: 70, oneshot: true },
    },
    {
      action: 'quest',
      activated: false,
      requirements: { level: 70, oneshot: true },
    },
  ],
  ability: {
    state: {
      targets: {
        xor: [
          {
            type: CardTypes.Character,
            location: Location.OppCharacter,
            quantity: 1,
          },
          {
            type: CardTypes.Character,
            location: Location.Character,
            quantity: 1,
          },
        ],
      },
      modifier: {
        target: {
          action: 'attack',
        },
      },
      lifetime: { setTurn: 'NextTurn' },
    },
  },
  subtypes: [CardSubTypes.weapon],
  ...defaultTypes,
};

export const thunderbolt: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'thunderbolt',
  name: 'Thunder Bolt',
  image: 'ThunderBolt',
  level: 60,
  skill: [
    {
      action: 'damage',
      activated: false,
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
  ],
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: { damage: 50, allOppMonster: true },
        requirements: { level: 0 },
      },
      {
        action: 'damage',
        activated: false,
        opts: { damage: 50, oppCharacter: true },
        requirements: { level: 0 },
      },
    ],
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};
