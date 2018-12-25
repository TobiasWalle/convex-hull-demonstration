import { COLORS } from '../models/colors';
import { ConvexHull } from '../models/convext-hull';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { AbstractAlgorithm } from './abstract-algorithm';
import { getAngleInDegrees } from './general.utils';

export class GiftWrapping extends AbstractAlgorithm<Point> {
  public complexity = "O(nh)";

  public async calculateConvexHull(points: Point[]) {
    const convextHull: ConvexHull<Point> = { points: [] };
    let pointOnHull = getLeftMostPoint(points);
    let endPoint: Point;
    do {
      convextHull.points.push(pointOnHull);
      await this.markShape(pointOnHull, COLORS.GREEN, 'Added');
      await this.updateConvexHull(convextHull);
      endPoint = points[0];
      await this.markShape(endPoint, COLORS.RED, 'Favorite');
      for (let j = 1; j < points.length; j++) {
        await this.markShape(points[j], COLORS.BLUE);
        if (
          endPoint === pointOnHull
          || isLeftOfLine(points[j], { start: pointOnHull, end: endPoint })
        ) {
          await this.unmarkShape(endPoint, COLORS.RED);
          endPoint = points[j];
          await this.markShape(endPoint, COLORS.RED, 'Favorite');
        }
        await this.unmarkShape(points[j], COLORS.BLUE);
      }
      await this.unmarkShape(endPoint, COLORS.RED);
      await this.unmarkShape(pointOnHull, COLORS.GREEN);
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
  const {start, end} = line;
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

