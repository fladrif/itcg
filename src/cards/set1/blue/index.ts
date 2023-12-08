import { Card, CardClasses } from '../../../card';

import { defaultSet } from '../index';

export * from './character';
export * from './item';
export * from './monster';
export * from './tactic';

export const defaultClass: Pick<Card, 'class' | 'set' | 'selected'> = {
  ...defaultSet,
  class: CardClasses.Warrior,
};
