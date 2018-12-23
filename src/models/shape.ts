import { Circle } from './circle';
import { Point } from './point';

export type Shape = Circle | Point;

export enum ShapeType {
  Circle,
  Point
}

export function isShapeCircle(shape: Shape): shape is Circle {
  return 'radius' in shape;
}

export function isShapePoint(shape: Shape): shape is Point {
  return !isShapeCircle(shape);
}
