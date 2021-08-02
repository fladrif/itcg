import { Item, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Item,
  class: CardClasses.Bowman,
  selected: false,
};

export const goldencrow: Omit<Item, 'key' | 'owner'> = {
  name: 'Golden Crow',
  image: 'GoldenCrow',
  level: 60,
  skill: {
    action: 'nomercy',
    activated: false,
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
  ability: {}, // TODO: double dmg trigger
  ...defaultTypes,
};
