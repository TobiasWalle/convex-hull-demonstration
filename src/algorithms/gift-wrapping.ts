import { Line } from '../models/line';
import { Point } from '../models/point';

interface ConvexHull {
  points: Point[];
}

export class GiftWrapping {
  public calculateConvexHull(points: Point[]): ConvexHull {
    const hull: Point[] = [];
    let pointOnHull = getLeftMostPoint(points);
    let endPoint: Point;
    do {
      hull.push(pointOnHull);
      endPoint = points[0];
      for (let j = 1; j < points.length; j++) {
        if (
          endPoint === pointOnHull
          || isLeftOfLine(points[j], [pointOnHull, endPoint])
        ) {
          endPoint = points[j];
        }
      }

      pointOnHull = endPoint;
    } while (endPoint !== hull[0]);
    return { points: hull };
  }
}

function getLeftMostPoint(points: Point[]): Point {
  let leftMostPoint = points[0];
  for (const point of points) {
    if (leftMostPoint.x > point.x) {
      leftMostPoint = point;
    }
  }
  return leftMostPoint;
}

function isLeftOfLine(p: Point, line: Line) {
  const [start, end] = line;
  if (start === p) {
    return false;
  }
  const lineAngle = getAngleInDegrees(start, end);
  const pointAngle = getAngleInDegrees(start, p);
  const normalizedAngle = substractDegree(pointAngle, lineAngle);
  return normalizedAngle > 180;
}

function substractDegree(a1: number, a2: number): number {
  let result = a1 - a2;
  if (result < 0) {
    result = 360 + result;
  }
  return result;
}

function getAngleInDegrees(p1: Point, p2: Point) {
  return getAngleInRadians(p1, p2) * (180 / Math.PI);
}

function getAngleInRadians(p1: Point, p2: Point): number {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

function orderByNumber<T>(getter: (x: T) => number): (l: T, r: T) => number {
  return (l, r) => getter(l) - getter(r);
}
