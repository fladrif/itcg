import { Card, CardClasses } from '../../../card';

import { defaultSet } from '../index';

export * from './character';
export * from './monster';
export * from './tactic';
export * from './item';

export const defaultClass: Pick<Card, 'class' | 'set' | 'selected'> = {
  ...defaultSet,
  class: CardClasses.Magician,
};
