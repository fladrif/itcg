import * as set1 from './set1';

import { blankCard } from '../card';

export const cards = {
  ...set1,
  blankCard,
};

export type CardName = keyof typeof cards;
