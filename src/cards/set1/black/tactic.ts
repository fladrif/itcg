import { CardTypes, CardSubTypes, Tactic } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Tactic,
};

export const avenger: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'avenger',
  name: 'Avenger',
  image: 'Avenger',
  level: 70,
  skill: skillRef('l70tthink90'),
  ability: {
    skills: skillRef('avenger'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const doublestrike: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'doublestrike',
  name: 'Double Strike',
  image: 'DoubleStrike',
  level: 20,
  skill: skillRef('l70ttslash'),
  ability: {
    skills: skillRef('destroymonster'),
  },
  subtypes: [CardSubTypes.skill],
  ...defaultTypes,
};

export const swipe: Omit<Tactic, 'key' | 'owner'> = {
  canonicalName: 'swipe',
  name: 'Swipe',
  image: 'Swipe',
  level: 30,
  skill: skillRef('spy'),
  ability: {
    skills: skillRef('swipe'),
  },
  subtypes: [CardSubTypes.strategy],
  ...defaultTypes,
};
