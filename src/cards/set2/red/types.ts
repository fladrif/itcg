import { Card, CardClasses } from '../../../card';

import { defaultSet } from '../types';

export const defaultClass: Pick<Card, 'class' | 'set' | 'selected'> = {
  ...defaultSet,
  class: CardClasses.Magician,
};
