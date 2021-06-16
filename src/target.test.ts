import 'jest';

import { Selection } from './stack';
import { filterSelections } from './target';
import { Location } from './actions';

import { redsnail, ribbonpig, slime, magicclaw } from './cards';
import * as fix from './target.fixtures';

describe('filterSelections', () => {
  it('no overflow, finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [ribbonpig],
    };

    const response = filterSelections(fix.complexFilterFinished, complexSelection, [
      Location.Hand,
      ribbonpig,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Board]: [],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('no overflow, not finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [ribbonpig],
    };

    const response = filterSelections(fix.complexFilterNotFinished, complexSelection, [
      Location.Hand,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Board]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow, not finished ', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [slime, ribbonpig],
    };

    const response = filterSelections(fix.complexFilterNotFinished, complexSelection, [
      Location.Hand,
      ribbonpig,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Board]: [slime],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow, finished', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [ribbonpig, slime],
    };

    const response = filterSelections(fix.complexFilterFinished, complexSelection, [
      Location.Board,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [],
      [Location.Board]: [ribbonpig],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('overflow, finished, recency', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [ribbonpig, slime],
    };

    const response = filterSelections(fix.complexFilterRecent, complexSelection, [
      Location.Board,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [redsnail],
      [Location.Board]: [],
    });
    expect(response).toHaveProperty('finished', true);
  });

  it('overflow, not finished, recency', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [redsnail],
      [Location.Board]: [slime],
    };

    const response = filterSelections(fix.complexFilterRecent, complexSelection, [
      Location.Board,
      slime,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [redsnail],
      [Location.Board]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });

  it('overflow outside of filter, not finished', () => {
    const complexSelection: Selection = {
      [Location.Hand]: [magicclaw],
      [Location.Board]: [],
    };

    const response = filterSelections(fix.complexFilterRecent, complexSelection, [
      Location.Board,
      magicclaw,
    ]);

    expect(response).toHaveProperty('selection', {
      [Location.Hand]: [magicclaw],
      [Location.Board]: [],
    });
    expect(response).toHaveProperty('finished', false);
  });
});
