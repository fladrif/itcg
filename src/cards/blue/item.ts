import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Warrior,
  selected: false,
};

export const battleshield: Omit<Item, 'key' | 'owner'> = {
  name: 'Battle Shield',
  image: 'BattleShield',
  level: 35,
  skill: {
    action: 'play',
    activated: false,
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
  ability: {}, // TODO: buff hp constant trigger
  ...defaultTypes,
};

export const theninedragons: Omit<Item, 'key' | 'owner'> = {
  name: 'The Nine Dragons',
  image: 'TheNineDragons',
  level: 50,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 30,
      class: {
        [CardClasses.Warrior]: 1,
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
      ],
    },
  },
  ability: {}, // TODO: buff att constant trigger
  ...defaultTypes,
};
