import { COLORS } from '../models/colors';
import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { Stack } from '../models/stack';
import { swap } from '../utils/array';
import { AbstractAlgorithm } from './abstract-algorithm';

export class GrahamScan extends AbstractAlgorithm<Point> {
  complexity = "O(n log n)";

  async calculateConvexHull(points: Point[]): Promise<ConvexHull> {
    const N = points.length;
    this.swapFirstPointWithHighestPoint(points);
    const firstPoint = points[0];
    const otherPoints = points.slice(1)
      .map(p => ({ ...p, angle: calculatePolarAngle(firstPoint, p), distance: calculateDistance(firstPoint, p) }));
    points = [
      firstPoint,
      ...otherPoints
        .sort((a, b) => {
          if (a.angle !== b.angle) {
            return a.angle - b.angle;
          }
          return a.distance - b.distance;
        })
    ];

    await Promise.all(points.map((p, i) => this.markShape(p, COLORS.BLUE, `${i}`)));
    await Promise.all(points.map((p, i) => this.unmarkShape(p, COLORS.BLUE)));

    const stack = new Stack<Point>();
    stack.push(firstPoint);
    await this.markShape(firstPoint, COLORS.BLUE);
    stack.push(points[1]);
    await this.markShape(points[1], COLORS.BLUE);
    for (let i = 2; i < N; i++) {
      const direction = async () => {
        const direction = getDirection(stack.top, stack.secondTop, points[i]);
        await this.markShape(stack.top, COLORS.RED);
        await this.markShape(stack.secondTop, COLORS.GREEN);
        await this.markShape(points[i], COLORS.ORANGE, direction);

        await this.unmarkShape(stack.top, COLORS.RED);
        await this.unmarkShape(stack.secondTop, COLORS.GREEN);
        await this.unmarkShape(points[i], COLORS.ORANGE);
        return direction;
      };

      while (
        stack.length >= 2 &&
        [Direction.right, Direction.collision].includes(await direction())
        ) {
        const point = stack.pop();
        await this.unmarkShape(point, COLORS.BLUE);
      }


      stack.push(points[i]);
      await this.markShape(points[i], COLORS.BLUE);
    }
    return { points: stack.asArray() };
  }

  private swapFirstPointWithHighestPoint(points: Point[]): void {
    let highestPointIndex = 0;
    points.forEach((point, i) => {
      const highestPoint = points[highestPointIndex];
      if (
        point.y < highestPoint.y
        || (point.y === highestPoint.y && point.x < highestPoint.x)
      ) {
        highestPointIndex = i;
      }
    });

    swap(points, 0, highestPointIndex);
  }
}

function calculateDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function calculatePolarAngle(a: Point, b: Point): number {
  return Math.abs(Math.atan2((a.y - b.y), (a.x - b.x)));
}

function getDirection(p1: Point, p2: Point, p3: Point): Direction {
  const factor = (p2.x - p1.x) * (p3.y - p1.y) - (p2.y - p1.y) * (p3.x - p1.x);
  if (factor < 0) {
    return Direction.right;
  } else if (factor > 0) {
    return Direction.left;
  } else {
    return Direction.collision;
  }
}

enum Direction {
  right = 'right',
  left = 'left',
  collision = 'collision'
}
