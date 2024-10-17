import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const sherman: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'sherman',
  name: 'Sherman',
  image: 'Sherman',
  health: 240,
  skills: [skillRef('l10wbash'), skillRef('l20quest'), skillRef('l30wwspawnx')],
  ...defaultTypes,
};

export const starblade: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'starblade',
  name: 'Starblade',
  image: 'Starblade',
  health: 260,
  skills: [skillRef('l10wbash'), skillRef('l20quest'), skillRef('l50wwbuff20')],
  ...defaultTypes,
};
