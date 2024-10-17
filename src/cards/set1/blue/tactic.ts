import { CardTypes, CardSubTypes, Tactic } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

export const itemtrade: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'itemtrade',
  name: 'Item Trade',
  image: 'ItemTrade',
  level: 30,
  skill: skillRef('drinkpotion'),
  ability: {
    skills: skillRef('destroyitem'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const pull: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'pull',
  name: 'Pull',
  image: 'Pull',
  level: 40,
  skill: skillRef('scout'),
  ability: {
    skills: skillRef('pull'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};

export const resting: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'resting',
  name: 'Resting',
  image: 'Resting',
  level: 10,
  skill: skillRef('l70wspawnthink90'),
  ability: {
    skills: skillRef('resting'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};
