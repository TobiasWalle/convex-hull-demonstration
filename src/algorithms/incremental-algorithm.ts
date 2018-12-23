import { Circle } from '../models/circle';
import { AbstractAlgorithm } from './abstract-algorithm';

export class IncrementalAlgorithm extends AbstractAlgorithm<Circle> {
  public complexity: string = "O(n log n)";

  async calculateConvexHull(points: Circle[]) {
    return { arcs: [] };
  }
}
