import { Arc } from '../models/arc';
import { Circle } from '../models/circle';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { calculateArcs, calculateUpperTangent, correctArcs, getArcPoints } from '../utils/arc';
import { distanceBetween, isDegreeAngleBetween, degreeToCartesian } from '../utils/geometry';
import { calculateIntersectionPointWithArc, calculateIntersectionPointWithLine } from '../utils/intersection';
import { AbstractAlgorithm } from './abstract-algorithm';
import { getAngleInDegrees } from './general.utils';

export class IncrementalAlgorithm extends AbstractAlgorithm<Circle> {
  public complexity: string = "O(n log n)";

  async calculateConvexHull(circles: Circle[]) {
    // Sort by decreasing radius
    circles = circles
      .slice().sort((c1, c2) => c2.radius - c1.radius);

    const result = new ArcsStore();
    result.addAll(calculateArcs(circles[0], circles[1]));

    for (let i = 2; i < circles.length; i++) {
      const circle = circles[i];
      const a: Arc | null = result.findArc(circle);
      if (a != null) {
        let clockWiseArc: Arc;
        const clockwiseIterator = result.getClockwiseIterator(a);
        while (true) {
          let currentArc = clockwiseIterator.next();
          if (sharesSupportingTangentClockWise(currentArc, clockwiseIterator.peakNext(), circle)) {
            clockWiseArc = currentArc;
            break;
          } else {
            result.delete(currentArc);
          }
        }

        let counterClockwiseArc: Arc;
        const counterClockwiseIterator = result.getCounterClockwiseIterator(a);
        while (true) {
          let currentArc = counterClockwiseIterator.next();
          if (sharesSupportingTangentCounterClockWise(currentArc, clockwiseIterator.peakNext(), circle)) {
            counterClockwiseArc = currentArc;
            break;
          } else {
            result.delete(currentArc);
          }
        }

        if (a === clockWiseArc && a === counterClockwiseArc) {
          result.delete(a);
          result.addAll(calculateArcs(circle, a));
        } else {
          result.delete(clockWiseArc);
          result.delete(counterClockwiseArc);
          result.addAll(correctArcs(circle, counterClockwiseArc, clockWiseArc));
        }
      }
    }

    console.log(result.arcs);
    return {
      arcs: result.arcs
    };
  }
}

function circleAsArc(circle: Circle): Arc {
  return { ...circle, startAngle: 0, endAngle: 360 };
}

class ArcsStore {
  readonly arcs: Arc[] = [];

  public add(arc: Arc): void {
    this.arcs.push(arc);
    this.sort();
  }

  public findArc(circle: Circle): Arc | null {
    const center = this.getCenter();
    const angleToCircle = getAngleInDegrees(center, circle);

    let resultArcIndex = 0;
    for (let i = 1; i < this.arcs.length; i++) {
      const arc = this.arcs[i];
      const angleToArc = getAngleInDegrees(center, arc);
      const hasPassedCircle = angleToCircle > angleToArc;
      if (hasPassedCircle) {
        break;
      } else {
        resultArcIndex = i;
      }
    }
    const resultArc = this.arcs[resultArcIndex];

    const intersectionLine: Line = {
      start: center,
      end: circle
    };
    let intersectionPoint: Point | null = null;
    const resultArcPoints = getArcPoints(resultArc);
    const resultArcStartAngleFromCenter = getAngleInDegrees(center, resultArcPoints.start);
    const resultArcEndAngleFromCenter = getAngleInDegrees(center, resultArcPoints.end);
    if (isDegreeAngleBetween(resultArcEndAngleFromCenter, resultArcStartAngleFromCenter, angleToCircle)) {
      intersectionPoint = calculateIntersectionPointWithArc(resultArc, intersectionLine);
    } else if (this.arcs.length >= 2) {
      const arcAfterResult: Arc = this.arcs[resultArcIndex + 1];
      intersectionPoint = calculateIntersectionPointWithLine({
        start: getArcPoints(resultArc).start,
        end: getArcPoints(arcAfterResult).end
      }, intersectionLine);
    }

    if (!intersectionPoint) {
      return null;
    }

    if (distanceBetween(center, intersectionPoint) < distanceBetween(center, circle)) {
      return resultArc;
    } else {
      return null;
    }
  }

  public getClockwiseIterator(start: Arc): Iterator<Arc> {
    const indexOfStart = this.arcs.findIndex(value => value === start);
    return new Iterator<Arc>(i => this.arcs[(indexOfStart + i) % this.arcs.length])
  }

  public getCounterClockwiseIterator(start: Arc): Iterator<Arc> {
    const indexOfStart = this.arcs.findIndex(value => value === start) - 1;
    return new Iterator<Arc>(i => {
      let newIndex = indexOfStart - i;
      console.log('II', newIndex, (-newIndex % this.arcs.length), this.arcs.length);
      if (newIndex < 0) {
        newIndex = this.arcs.length - (-newIndex % this.arcs.length);
      }
      console.log('III', newIndex);
      return this.arcs[newIndex];
    });
  }

  public addAll(arcs: Arc[]): void {
    this.arcs.push(...arcs);
    this.sort();
  }

  public delete(arc: Arc): void {
    const index = this.arcs.findIndex(value => value === arc);
    this.arcs.splice(index, 1);
    this.sort();
  }


  private getCenter(): Point {
    const sums = this.arcs.reduce(
      (sP, p) => ({ x: sP.x + p.x, y: sP.y + p.y }),
      { x: 0, y: 0 }
    );
    return {
      x: sums.x / this.arcs.length,
      y: sums.y / this.arcs.length
    };
  }

  private sort(): void {
    const center = this.getCenter();
    this.arcs.sort((a, b) =>
      getAngleInDegrees(center, a) -
      getAngleInDegrees(center, b)
    ).reverse()
  }
}

class Iterator<T> {
  private index = 0;

  constructor(
    private getNext: (index: number) => T
  ) {
  }

  public next(): T {
    return this.getNext(this.index++);
  }

  public peakNext(): T {
    return this.getNext(this.index);
  }
}

function sharesSupportingTangentClockWise(arc: Arc, nextArc: Arc, circle: Circle): boolean {
  const currentTangent = calculateUpperTangent(circle, arc);
  const nextTangent = calculateUpperTangent(circle, arc);
  const currentAngle = getAngleInDegrees(currentTangent.start, currentTangent.end);
  const nextAngle = getAngleInDegrees(nextTangent.start, nextTangent.end);
  return nextAngle <= currentAngle;
}

function sharesSupportingTangentCounterClockWise(arc: Arc, nextArc: Arc, circle: Circle): boolean {
  const currentTangent = calculateUpperTangent(circle, arc);
  const nextTangent = calculateUpperTangent(circle, arc);
  const currentAngle = getAngleInDegrees(currentTangent.start, currentTangent.end);
  const nextAngle = getAngleInDegrees(nextTangent.start, nextTangent.end);
  return nextAngle >= currentAngle;
}
