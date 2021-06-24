import 'jest';

import { Selection } from './stack';
import { ensureFilter, filterSelections } from './target';
import { Location } from './actions';

import * as cards from './cards';
import { instantiateCard } from './card';
import * as fix from './target.fixtures';

describe('filterSelections', () => {
  const redsnail = instantiateCard(cards.redsnail)[0];
  const ribbonpig = instantiateCard(cards.ribbonpig)[0];
  const slime = instantiateCard(cards.slime)[0];
  const magicclaw = instantiateCard(cards.magicclaw)[0];

  it('no overflow, finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [ribbonpig],
    };

    const response = filterSelections(fix.filterFinished, complexSelection, [
      Location.Hand,
      ribbonpig,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Field]: [],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('no overflow, not finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [ribbonpig],
    };

    const response = filterSelections(fix.filterNotFinished, complexSelection, [
      Location.Hand,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Field]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow, not finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [slime, ribbonpig],
    };

    const response = filterSelections(fix.filterNotFinished, complexSelection, [
      Location.Hand,
      ribbonpig,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Field]: [slime],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow, finished', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [ribbonpig, slime],
    };

    const response = filterSelections(fix.filterFinished, complexSelection, [
      Location.Field,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Field]: [ribbonpig],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('overflow, finished, recency', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [ribbonpig, slime],
    };

    const response = filterSelections(fix.filterRecent, complexSelection, [
      Location.Field,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [redsnail],
      [Location.Field]: [],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('overflow, not finished, recency', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Field]: [slime],
    };

    const response = filterSelections(fix.filterRecent, complexSelection, [
      Location.Field,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [redsnail],
      [Location.Field]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow outside of filter, not finished', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [magicclaw],
      [Location.Field]: [],
    };

    const response = filterSelections(fix.filterRecent, complexSelection, [
      Location.Field,
      magicclaw,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [magicclaw],
      [Location.Field]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });
});

describe('ensure filter', () => {
  it('set correct current level', () => {
    const ensured = ensureFilter(fix.filterCurrentLevelBefore, fix.playerState);

    expect(ensured).toEqual(fix.filterCurrentLevelAfter);
  });
});
