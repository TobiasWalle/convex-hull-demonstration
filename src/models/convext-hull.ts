import { Arc } from './arc';
import { Circle } from './circle';
import { Point } from './point';
import { Shape } from './shape';

export interface PointConvexHull {
  points: Point[];
}

export interface CircleConvexHull {
  arcs: Arc[];
}

export type UnknownConvexHull = CircleConvexHull | PointConvexHull;
export type ConvexHull<S extends Shape> = S extends Circle ?
  CircleConvexHull
  : S extends Point
    ? PointConvexHull
    : UnknownConvexHull;


export function isCircleConvexHull(convexHull: UnknownConvexHull): convexHull is CircleConvexHull {
  return 'arcs' in convexHull;
}
