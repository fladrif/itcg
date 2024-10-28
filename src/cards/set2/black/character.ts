import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const nova: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'nova',
  name: 'Nova',
  image: 'Nova',
  health: 200,
  skills: [skillRef('l10quest'), skillRef('l20ttmastermind'), skillRef('l40tslash')],
  ...defaultTypes,
};
