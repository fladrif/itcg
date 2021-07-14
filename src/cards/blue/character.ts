import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Warrior,
  selected: false,
};

export const sherman: Omit<Character, 'key' | 'owner'> = {
  name: 'Sherman',
  image: 'Sherman',
  health: 240,
  skills: [
    {
      requirements: { level: 10, class: { [CardClasses.Warrior]: 1 } },
      action: 'damage',
      activated: false,
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
    {
      requirements: { level: 20 },
      action: 'quest',
      activated: false,
    },
    {
      requirements: { level: 30, class: { [CardClasses.Warrior]: 2 } },
      action: 'play',
      activated: false,
      targets: {
        level: 'CurrentLevel',
        type: CardTypes.Monster,
        quantity: 1,
        location: Location.Hand,
      },
    },
  ],
  ...defaultTypes,
};
