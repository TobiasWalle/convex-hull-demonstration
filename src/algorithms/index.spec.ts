import { ShapeType } from '../models/shape';
import {
  expectCircleAlgorithmToWork,
  expectCircleAlgorithmToWorkWith4CirclesOfTheSameSize,
  expectCircleAlgorithmToWorkWithCircleOutsideHull
} from './circle-algorithm-test-utils';
import { algorithmsByType } from './index';
import {
  expectPointAlgorithmToWorkWithComplexExample,
  expectPointAlgorithmToWorkWithIntermediateExample,
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
        it('should work with two circles', () => {
          return expectCircleAlgorithmToWork({
            circles: [
              { x: 10, y: 10, radius: 5 },
              { x: 10, y: 30, radius: 5 },
            ],
            expectedArcs: [
              { x: 10, y: 10, radius: 5, startAngle: 0, endAngle: 180 },
              { x: 10, y: 30, radius: 5, startAngle: 180, endAngle: 0 },
            ],
            Alg: Algorithm
          });
        });

        it('should work with circle outside hull', () => {
          return expectCircleAlgorithmToWorkWithCircleOutsideHull(Algorithm);
        });

        it('should work with 4 circles with the same size', () => {
          return expectCircleAlgorithmToWorkWith4CirclesOfTheSameSize(Algorithm);
        });
      });
    });
  });
});


