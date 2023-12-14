import { Card, Set } from '../../card';

export const defaultSet: Pick<Card, 'set' | 'selected'> = {
  set: Set.one,
  selected: false,
};
