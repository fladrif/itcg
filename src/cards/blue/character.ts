import { Character, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Character,
  class: CardClasses.Warrior,
  selected: false,
};

export const sherman: Character = {
  name: 'Sherman',
  image: 'Sherman',
  health: 240,
  skills: [
    {
      requirements: { level: 10 },
      action: 'quest',
    },
    {
      requirements: { level: 10 },
      action: 'spawn',
      targets: {
        level: 30,
        type: CardTypes.Monster,
        quantity: 1,
        location: Location.Hand,
      },
    },
    {
      requirements: { level: 30 },
      action: 'quest',
    },
  ],
  ...defaultTypes,
};
