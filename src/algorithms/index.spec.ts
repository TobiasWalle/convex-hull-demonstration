import { algorithms } from './index';
import {
  expectAlgorithmnToWorkWithComplexExample,
  expectAlgorithmnToWorkWithIntermediateExample,
  expectAlgorithmnToWorkWithSimpleExample
} from './test.utils';

describe('Algorithms', () => {
  Object.entries(algorithms).forEach(([key, Algorithmn]) => {
    describe(key, () => {
      it('should work with simple example', () => {
        return expectAlgorithmnToWorkWithSimpleExample(Algorithmn);
      });

      it('should work with intermediate example', () => {
        return expectAlgorithmnToWorkWithIntermediateExample(Algorithmn);
      });

      it('should work with complex example', () => {
        return expectAlgorithmnToWorkWithComplexExample(Algorithmn);
      });
    });
  });
});


