import { Arc } from '../models/arc';
import { Circle } from '../models/circle';
import { COLORS } from '../models/colors';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { calculateArcs, calculateMiddlePoint, calculateUpperTangent, correctArcs, getArcPoints } from '../utils/arc';
import { distanceBetween, isDegreeAngleBetween, isDegreeAngleBetweenClockwise } from '../utils/geometry';
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
    result.add(circleAsArc(circles[0]));

    const pointInCh = circles[0];
    for (let i = 1; i < circles.length; i++) {
      const circle = circles[i];
      const a: Arc | null = result.findArc(circle, pointInCh);
      console.log('arc', a);
      if (a == null) {
        continue;
      }

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
        const correctedArcs = correctArcs(circle, counterClockwiseArc, clockWiseArc);
        result.addAll(correctedArcs);
      }
    }

    console.log(result.arcs);
    return {
      arcs: result.arcs
    };
  }
}

function circleAsArc(circle: Circle): Arc {
  return { ...circle, startAngle: 360, endAngle: 0 };
}

class ArcsStore {
  readonly arcs: Arc[] = [];

  public add(arc: Arc): void {
    this.arcs.push(arc);
    this.sort();
  }

  public findArc(circle: Circle, pointInCh: Point): Arc | null {
    const angleToCircle = getAngleInDegrees(pointInCh, circle);

    let resultArcIndex = 0;
    for (let i = 1; i < this.arcs.length; i++) {
      const arc = this.arcs[i];
      const angleToArc = getAngleInDegrees(pointInCh, arc);
      const hasPassedCircle = angleToCircle > angleToArc;
      if (hasPassedCircle) {
        break;
      } else {
        resultArcIndex = i;
      }
    }
    const resultArc = this.arcs[resultArcIndex];
    console.log(`Result arc at index ${resultArcIndex}`, resultArc);

    const intersectionLine: Line = {
      start: pointInCh,
      end: circle
    };
    let intersectionPoint: Point | null = null;
    const resultArcPoints = getArcPoints(resultArc);
    const resultArcStartAngleFromCenter = getAngleInDegrees(pointInCh, resultArcPoints.start);
    const resultArcEndAngleFromCenter = getAngleInDegrees(pointInCh, resultArcPoints.end);
    console.log('IS BETWEEN?', resultArcStartAngleFromCenter, resultArcEndAngleFromCenter, angleToCircle);
    if (resultArcStartAngleFromCenter === resultArcEndAngleFromCenter || isDegreeAngleBetweenClockwise(resultArcStartAngleFromCenter, resultArcEndAngleFromCenter, angleToCircle)) {
      console.log('Calculate intersection with arc');
      intersectionPoint = calculateIntersectionPointWithArc(resultArc, intersectionLine);
    } else if (this.arcs.length >= 2) {
      console.log('Calculate intersection with line');
      const arcAfterResult: Arc = this.arcs[(resultArcIndex + 1) % this.arcs.length];
      console.log(arcAfterResult);
      intersectionPoint = calculateIntersectionPointWithLine({
        start: getArcPoints(resultArc).start,
        end: getArcPoints(arcAfterResult).end
      }, intersectionLine);
    }

    if (!intersectionPoint) {
      console.log('No Intersection Point');
      return null;
    }

    if (distanceBetween(pointInCh, intersectionPoint) < distanceBetween(pointInCh, circle)) {
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
      if (newIndex < 0) {
        if (this.arcs.length === 1) {
          newIndex = 0;
        } else {
          newIndex = this.arcs.length - (-newIndex % this.arcs.length);
        }
      }
      console.log(newIndex, this.arcs.length);
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
    return calculateMiddlePoint(...this.arcs);
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
