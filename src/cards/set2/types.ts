import { Card, Set } from '../../card';

export const defaultSet: Pick<Card, 'set' | 'selected'> = {
  set: Set.two,
  selected: false,
};
