import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Warrior,
  selected: false,
};

export const sherman: Omit<Character, 'key'> = {
  name: 'Sherman',
  image: 'Sherman',
  health: 240,
  skills: [
    {
      requirements: { level: 10 },
      action: 'quest',
      activated: false,
    },
    {
      requirements: { level: 10 },
      action: 'spawn',
      activated: false,
      targets: {
        level: 15,
        type: CardTypes.Monster,
        quantity: 1,
        location: Location.Hand,
      },
    },
    {
      requirements: { level: 30 },
      action: 'quest',
      activated: false,
    },
  ],
  ...defaultTypes,
};
