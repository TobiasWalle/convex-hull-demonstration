import { ShapeType } from '../models/shape';
import { algorithmsByType } from './index';
import {
  expectAlgorithmnToWorkWithComplexExample,
  expectAlgorithmnToWorkWithIntermediateExample,
  expectAlgorithmnToWorkWithSimpleExample
} from './test.utils';

describe('Algorithms', () => {
  Object.entries(algorithmsByType[ShapeType.Point]).forEach(([key, Algorithm]) => {
    describe(key, () => {
      it('should work with simple example', () => {
        return expectAlgorithmnToWorkWithSimpleExample(Algorithm);
      });

      it('should work with intermediate example', () => {
        return expectAlgorithmnToWorkWithIntermediateExample(Algorithm);
      });

      it('should work with complex example', () => {
        return expectAlgorithmnToWorkWithComplexExample(Algorithm);
      });
    });
  });
});


