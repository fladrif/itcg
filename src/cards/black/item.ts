import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Thief,
  selected: false,
};

export const emeraldearrings: Omit<Item, 'key' | 'owner'> = {
  name: 'Emerald Earrings',
  image: 'EmeraldEarrings',
  level: 30,
  skill: {
    action: 'play',
    activated: false,
    requirements: {
      level: 70,
      class: {
        [CardClasses.Thief]: 2,
      },
    },
    targets: {
      xor: [
        {
          level: 70,
          type: CardTypes.Item,
          location: Location.Hand,
          quantity: 1,
        },
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
  // TODO: emeral earring ability
  ability: {},
  ...defaultTypes,
};
