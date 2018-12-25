import { Point } from '../models/point';

export function degreeToRadian(degree: number): number {
  return degree * (Math.PI / 180);
}

export function radianToDegree(radian: number): number {
  return radian * (180 / Math.PI);
}

export function getAngleInDegrees(p1: Point, p2: Point) {
  return radianToDegree(getAngleInRadians(p1, p2));
}

export function getAngleInRadians(p1: Point, p2: Point): number {
  const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
  if (angle < 0) {
    return (Math.PI * 2) + angle;
  }
  return angle;
}
