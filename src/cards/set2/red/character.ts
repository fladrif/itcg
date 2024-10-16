import { Character, CardTypes } from '../../../card';
import { skillRef } from '../../../skill';

import { defaultClass } from './types';

const defaultTypes = {
  ...defaultClass,
  type: CardTypes.Character,
};

export const felix: Omit<Character, 'key' | 'owner'> = {
  canonicalName: 'felix',
  name: 'Felix',
  image: 'Felix',
  health: 170,
  skills: [
    skillRef('l10quest'),
    skillRef('l20mmpoisonmist'),
    skillRef('l40mmmspellshape'),
  ],
  ...defaultTypes,
};
