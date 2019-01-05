import { getAngleInDegrees } from '../algorithms/general.utils';
import { Arc } from '../models/arc';
import { Circle } from '../models/circle';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { isDegreeAngleBetween, degreeToCartesian, isDegreeAngleBetweenClockwise } from './geometry';

export function getArcPoints(arc: Arc): { start: Point, end: Point } {
  return {
    start: degreeToCartesian(arc.x, arc.y, arc.radius, arc.startAngle),
    end: degreeToCartesian(arc.x, arc.y, arc.radius, arc.endAngle)
  };
}

export function correctArcs(circle: Circle, arc1: Arc, arc2: Arc): Arc[] {
  const { counterClockWise: counterClockWiseArc, clockWise: clockWiseArc } = getClockwiseAndCounterclockwisePointRelativeTo(circle, arc1, arc2);
  const {
    ccToCircle,
    circleToCw
  } = calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle);
  return [
    {
      ...counterClockWiseArc,
      endAngle: getAngleInDegrees(counterClockWiseArc, ccToCircle.start)
    },
    {
      ...circle,
      startAngle: getAngleInDegrees(circle, ccToCircle.end),
      endAngle: getAngleInDegrees(circle, circleToCw.start)
    },
    {
      ...clockWiseArc,
      startAngle: getAngleInDegrees(clockWiseArc, circleToCw.end),
    }
  ];
}

export function getClockwiseAndCounterclockwisePointRelativeTo<T extends Point>(pivot: Point, p1: T, p2: T): {
  clockWise: T;
  counterClockWise: T;
} {
  const angle1 = getAngleInDegrees(pivot, p1);
  const angle2 = getAngleInDegrees(pivot, p2);
  if (getClockwiseAngleDiff(angle1, angle2) < getClockwiseAngleDiff(angle2, angle1)) {
    return { clockWise: p1, counterClockWise: p2 };
  } else {
    return { clockWise: p2, counterClockWise: p1 };
  }
}

function getClockwiseAngleDiff(a1: number, a2: number): number {
  const diff = a1 - a2;
  if (diff < 0) {
    return 360 - diff;
  } else {
    return diff;
  }
}

export function calculateTangentsToCorrectArcs(counterClockWiseArc: Arc, clockWiseArc: Arc, circle: Circle) {
  return {
    ccToCircle: getTangentFunctionToCorrectArcs(counterClockWiseArc, clockWiseArc, circle)(counterClockWiseArc, circle),
    circleToCw: getTangentFunctionToCorrectArcs(clockWiseArc, counterClockWiseArc, circle)(circle, clockWiseArc)
  }
}

function getTangentFunctionToCorrectArcs(arc: Arc, otherArc: Arc, circle: Circle) {
  const pointBetweenArcAndCircle = calculateMiddlePoint(arc, circle);
  const angleToCircle = getAngleInDegrees(arc, circle);
  const angleToOtherArc = getAngleInDegrees(pointBetweenArcAndCircle, otherArc);
  const otherIsOnLeftSide = isDegreeAngleBetween(
    getAngleInDegrees(pointBetweenArcAndCircle, arc),
    getAngleInDegrees(pointBetweenArcAndCircle, circle),
    angleToOtherArc
  );
  if (isDegreeAngleBetween(0.00001, 179.99999, angleToOtherArc) && !(isDegreeAngleBetween(270, 360, angleToCircle) && otherIsOnLeftSide)) {
    return calculateLowerTangent;
  } else {
    return calculateUpperTangent;
  }
}

export function calculateMiddlePoint(...points: Point[]): Point {
  const sum = points.reduce((r, p) => ({ x: r.x + p.x, y: r.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

export function calculateArcs(circle1: Circle, circle2: Circle): Arc[] {
  const upperTangent = calculateUpperTangent(circle1, circle2);
  const lowerTangent = calculateLowerTangent(circle1, circle2);
  return [
    {
      ...circle1,
      ...getClearAngles(
        circle1,
        circle2,
        lowerTangent.start,
        upperTangent.start
      ),
    },
    {
      ...circle2,
      ...getClearAngles(
        circle2,
        circle1,
        lowerTangent.end,
        upperTangent.end
      ),
    },
  ];
}

function getClearAngles(
  circle1: Circle,
  circle2: Circle,
  point1: Point,
  point2: Point
): { startAngle: number, endAngle: number } {
  const angleToOtherCircle = getAngleInDegrees(circle1, circle2);
  const angle1 = getAngleInDegrees(circle1, point1);
  const angle2 = getAngleInDegrees(circle1, point2);
  if (isDegreeAngleBetweenClockwise(angle1, angle2, angleToOtherCircle)) {
    return {
      startAngle: angle2,
      endAngle: angle1
    };
  } else {
    return {
      startAngle: angle1,
      endAngle: angle2
    };
  }
}

export function calculateUpperTangent(circle1: Circle, circle2: Circle): Line {
  return calculateTangent(true, circle1, circle2);
}

function calculateLowerTangent(circle1: Circle, circle2: Circle): Line {
  return calculateTangent(false, circle1, circle2);
}

function calculateTangent(upperTangent: boolean, circle1: Circle, circle2: Circle): Line {
  const { x: x1, y: y1, radius: r } = circle1;
  const { x: x2, y: y2, radius: R } = circle2;

  const y = -Math.atan(
    (y2 - y1) /
    (x2 - x1)
  );

  const s = Math.asin(
    (R - r) /
    Math.sqrt(
      (x2 - x1) ** 2 +
      (y2 - y1) ** 2
    )
  );

  const a = y - s;

  const distanceX = Math.cos((Math.PI / 2) - a);
  const distanceY = Math.sin((Math.PI / 2) - a);

  if (upperTangent) {
    return {
      start: {
        x: x1 + r * distanceX,
        y: y1 + r * distanceY
      },
      end: {
        x: x2 + R * distanceX,
        y: y2 + R * distanceY
      }
    };
  } else {
    return {
      start: {
        x: x1 - r * distanceX,
        y: y1 - r * distanceY
      },
      end: {
        x: x2 - R * distanceX,
        y: y2 - R * distanceY
      }
    };
  }
}
