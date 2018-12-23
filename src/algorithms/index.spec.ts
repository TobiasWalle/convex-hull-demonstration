import { ShapeType } from '../models/shape';
import { expectCircleAlgorithmToWorkWithCircleOutsideHull } from './circle-algorithm-test-utils';
import { algorithmsByType } from './index';
import {
  expectPointAlgorithmToWorkWithComplexExample,
  expectPointAlgorithmToWorkWithIntermediateExample
} from './point-algorithm-test.utils';
import {
  expectPointAlgorithmToWorkWithSimpleExample
} from './point-algorithm-test.utils';

describe('Algorithms', () => {
  describe('Point', () => {
    Object.entries(algorithmsByType[ShapeType.Point]).forEach(([key, Algorithm]) => {
      describe(key, () => {
        it('should work with simple example', () => {
          return expectPointAlgorithmToWorkWithSimpleExample(Algorithm);
        });

        it('should work with intermediate example', () => {
          return expectPointAlgorithmToWorkWithIntermediateExample(Algorithm);
        });

        it('should work with complex example', () => {
          return expectPointAlgorithmToWorkWithComplexExample(Algorithm);
        });
      });
    });
  });

  describe('Circle', () => {
    Object.entries(algorithmsByType[ShapeType.Circle]).forEach(([key, Algorithm]) => {
      describe(key, () => {
        it('should work', () => {
          return expectCircleAlgorithmToWorkWithCircleOutsideHull(Algorithm);
        });
      });
    });
  });
});


