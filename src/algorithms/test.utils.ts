import { Point } from '../models/point';
import { AbstractAlgorithm, AbstractAlgorithmType } from './abstract-algorithm';

export function initAlgorithmnForTesting<T extends AbstractAlgorithm<Point>>(Alg: AbstractAlgorithmType<T>): T {
  return new Alg(
    () => {
    },
    () => {
    },
    () => {
    },
    0
  );
}

