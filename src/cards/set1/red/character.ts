import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const maya: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'maya',
  name: 'Maya',
  image: 'Maya',
  health: 190,
  skills: [skillRef('l10quest'), skillRef('l20mfirearrow'), skillRef('l30mmthinkx')],
  ...defaultTypes,
};

export const stormwind: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'stormwind',
  name: 'Stormwind',
  image: 'Stormwind',
  health: 180,
  skills: [skillRef('l10quest'), skillRef('l30mmthinkx'), skillRef('l70mmmthunderspear')],
  ...defaultTypes,
};
