import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';

export abstract class AbstractAlgorithm {
  public abstract calculateConvexHull(points: Point[]): ConvexHull
}
