import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const indigo: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'indigo',
  name: 'Indigo',
  image: 'Indigo',
  health: 210,
  skills: [skillRef('l20bbooster'), skillRef('l30quest'), skillRef('l50bbtricky')],
  ...defaultTypes,
};
