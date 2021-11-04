import * as black from './black';
import * as blue from './blue';
import * as green from './green';
import * as red from './red';

import { blankCard } from '../card';

export const cards = {
  ...black,
  ...blue,
  ...green,
  ...red,
  blankCard,
};

export type CardName = keyof typeof cards;
