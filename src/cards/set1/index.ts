import { Card, Set } from '../../card';

import * as black from './black';
import * as blue from './blue';
import * as green from './green';
import * as red from './red';

export const set1 = {
  ...black,
  ...blue,
  ...green,
  ...red,
};

export const defaultSet: Pick<Card, 'set' | 'selected'> = {
  set: Set.one,
  selected: false,
};
