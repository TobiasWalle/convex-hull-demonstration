import { ConvexHull } from '../models/convext-hull';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { AbstractAlgorithm } from './abstract-algorithm';

export class GiftWrapping extends AbstractAlgorithm {
  public async calculateConvexHull(points: Point[]): Promise<ConvexHull> {
    const convextHull: ConvexHull = { points: [] };
    let pointOnHull = getLeftMostPoint(points);
    let endPoint: Point;
    do {
      convextHull.points.push(pointOnHull);
      await this.updateConvexHull(convextHull);
      endPoint = points[0];
      await this.markPointAsSelected(endPoint);
      for (let j = 1; j < points.length; j++) {
        await this.markPointAsActive(points[j]);
        if (
          endPoint === pointOnHull
          || isLeftOfLine(points[j], [pointOnHull, endPoint])
        ) {
          await this.unmarkPointAsSelected(endPoint);
          endPoint = points[j];
          await this.markPointAsSelected(endPoint);
        }
        await this.unmarkPointAsActive(points[j]);
      }
      await this.unmarkPointAsSelected(endPoint);
      pointOnHull = endPoint;
    } while (endPoint !== convextHull.points[0]);
    return convextHull;
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
