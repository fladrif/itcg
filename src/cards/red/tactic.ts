import { CardTypes, CardClasses, Skill, Tactic } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Magician,
  selected: false,
};

const magicclawAbility: Skill = {
  requirements: { level: 0 },
  action: 'damage',
  activated: false,
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
  ...defaultTypes,
};

export const heal: Omit<Tactic, 'key' | 'owner'> = {
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
  ...defaultTypes,
};

export const magicclaw: Omit<Tactic, 'key' | 'owner'> = {
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
    skills: [magicclawAbility, { ...magicclawAbility, noReset: true }],
  },
  ...defaultTypes,
};

export const questSkill: Skill = {
  action: 'quest',
  activated: false,
  requirements: { level: 0 },
};

export const sidequest: Omit<Tactic, 'key' | 'owner'> = {
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
  ...defaultTypes,
};
