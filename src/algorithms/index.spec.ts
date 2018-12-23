import { pointAlgorithms } from './index';
import {
  expectAlgorithmnToWorkWithComplexExample,
  expectAlgorithmnToWorkWithIntermediateExample,
  expectAlgorithmnToWorkWithSimpleExample
} from './test.utils';

describe('Algorithms', () => {
  Object.entries(pointAlgorithms).forEach(([key, Algorithm]) => {
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


