import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const bruno: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'bruno',
  name: 'Bruno',
  image: 'Bruno',
  health: 220,
  skills: [skillRef('l10wbash'), skillRef('l20quest'), skillRef('l50wwwbloodthirsty')],
  ...defaultTypes,
};
