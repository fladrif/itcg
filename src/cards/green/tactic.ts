import { CardTypes, CardClasses, Tactic } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Tactic,
  class: CardClasses.Bowman,
  selected: false,
};

export const arrowblow: Omit<Tactic, 'key' | 'owner'> = {
  name: 'Arrow Blow',
  image: 'ArrowBlow',
  level: 10,
  skill: {
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

export const rainofarrows: Omit<Tactic, 'key' | 'owner'> = {
  name: 'Rain Of Arrows',
  image: 'RainOfArrows',
  level: 40,
  skill: {
    // TODO: Steady Hand
    action: 'play',
    activated: false,
    requirements: { level: 0, turn: -1 },
  },
  ability: {
    skills: [
      {
        action: 'damage',
        activated: false,
        opts: {
          // TODO: for each card in opp's hand
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

export const soularrow: Omit<Tactic, 'key' | 'owner'> = {
  name: 'Soul Arrow',
  image: 'SoulArrow',
  level: 30,
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
          damage: 40,
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
      },
    ],
  },
  ...defaultTypes,
};

export const powerknockback: Omit<Tactic, 'key' | 'owner'> = {
  name: 'Power Knock-Back',
  image: 'PowerKnockBack',
  level: 40,
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
    skills: [
      {
        action: 'tuck',
        activated: false,
        opts: {
          position: 1,
        },
        requirements: { level: 0 },
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
