import { Point } from '../models/point';

export function getAngleInDegrees(p1: Point, p2: Point) {
  return getAngleInRadians(p1, p2) * (180 / Math.PI);
}

export function getAngleInRadians(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}
