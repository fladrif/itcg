import { Monster, CardTypes, CardClasses } from '../../card';
import { Location } from '../../actions';

const defaultTypes = {
  type: CardTypes.Monster,
  class: CardClasses.Bowman,
  selected: false,
  attacks: 1,
  damage: 0,
};

export const fairy: Omit<Monster, 'key'> = {
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
  ability: {},
  ...defaultTypes,
};
