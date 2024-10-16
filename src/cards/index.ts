import * as set1 from './set1';
import * as set2 from './set2';

import { blankCard } from '../card';

export const cards = {
  ...set1,
  ...set2,
  blankCard,
};

export type CardName = keyof typeof cards;
