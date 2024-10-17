import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill/utils';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const nixie: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'nixie',
  name: 'Nixie',
  image: 'Nixie',
  health: 200,
  skills: [skillRef('l10beasy'), skillRef('l20quest'), skillRef('l50bbtricky')],
  ...defaultTypes,
};

export const skyhawk: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'skyhawk',
  name: 'Skyhawk',
  image: 'Skyhawk',
  health: 210,
  skills: [skillRef('l10beasy'), skillRef('l10quest'), skillRef('l60bbrapid')],
  ...defaultTypes,
};
