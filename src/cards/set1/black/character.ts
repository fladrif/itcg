import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const ivan: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'ivan',
  name: 'Ivan',
  image: 'Ivan',
  health: 220,
  skills: [skillRef('l10tstab'), skillRef('l10quest'), skillRef('l20tequipx')],
  ...defaultTypes,
};

export const mistmoon: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'mistmoon',
  name: 'Mistmoon',
  image: 'Mistmoon',
  health: 200,
  skills: [skillRef('l10tstab'), skillRef('l20quest'), skillRef('l40ttsneak40')],
  ...defaultTypes,
};
