import { ActionTargets, Location } from './types';

export function getTargetLocations(filter?: ActionTargets): Location[] {
  if (!filter) return [];

  if ('location' in filter) return [filter.location];

  if ('and' in filter) {
    return filter.and!.reduce<Location[]>(
      (acc, filt) => acc.concat(getTargetLocations(filt)),
      []
    );
  }

  if ('xor' in filter) {
    return filter.xor!.reduce<Location[]>(
      (acc, filt) => acc.concat(getTargetLocations(filt)),
      []
    );
  }

  throw new Error(`Filter composed incorrectly: ${filter}`);
}
