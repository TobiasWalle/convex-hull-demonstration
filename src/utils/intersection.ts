import { object } from 'prop-types';
import { getAngleInDegrees } from '../algorithms/general.utils';
import { Arc } from '../models/arc';
import { Line } from '../models/line';
import { Point } from '../models/point';
import { isDegreeAngleBetween } from './geometry';

export function calculateIntersectionPointWithLine(line1: Line, line2: Line): Point | null {
  const point = {
    x: (
      (line1.start.x * line1.end.y - line1.start.y * line1.end.x) * (line2.start.x - line2.end.x) -
      (line1.start.x - line1.end.x) * (line2.start.x * line2.end.y - line2.start.y * line2.end.x)
    ) / (
      (line1.start.x - line1.end.x) * (line2.start.y - line2.end.y) -
      (line1.start.y - line1.end.y) * (line2.start.x - line2.end.x)
    ),
    y: (
      (line1.start.x * line1.end.y - line1.start.y * line1.end.x) * (line2.start.y - line2.end.y) -
      (line1.start.y - line1.end.y) * (line2.start.x * line2.end.y - line2.start.y * line2.end.x)
    ) / (
      (line1.start.x - line1.end.x) * (line2.start.y - line2.end.y) -
      (line1.start.y - line1.end.y) * (line2.start.x - line2.end.x)
    )
  };
  if (isNaN(point.x) || isNaN(point.y)) {
    return null;
  }
  return point;
}

export function calculateIntersectionPointWithArc(arc: Arc, line: Line): Point | null {
  const d = {
    x: line.end.x - line.start.x,
    y: line.end.y - line.start.y
  };
  const a = d.x * d.x + d.y * d.y;
  const b = 2 * (d.x * (line.start.x - arc.x) + d.y * (line.start.y - arc.y));
  const c =
    (line.start.x - arc.x) ** 2
    + (line.start.y - arc.y) ** 2
    - arc.radius ** 2;
  const det = b ** 2 - 4 * a * c;

  if (a <= 0.000001 || det < 0) {
    return null;
  } else if (det === 0) {
    const t = -b / (2 * a);
    const point = {
      x: line.start.x + t * d.x,
      y: line.start.y + t * d.y
    };
    if (pointIntersectsArc(point, arc)) {
      return point;
    } else {
      return null;
    }
  } else {
    const upperDistance = (-b + Math.sqrt(det)) / (2 * a);
    const lowerDistance = (-b - Math.sqrt(det)) / (2 * a);
    const upperPoint = {
      x: line.start.x + upperDistance * d.x,
      y: line.start.y + upperDistance * d.y,
    };
    const lowerPoint = {
      x: line.start.x + lowerDistance * d.x,
      y: line.start.y + lowerDistance * d.y,
    };
    if (pointIntersectsArc(lowerPoint, arc)) {
      return lowerPoint;
    } else if (pointIntersectsArc(upperPoint, arc)) {
      return upperPoint;
    } else {
      return null;
    }
  }
}

function pointIntersectsArc(point: Point, arc: Arc): boolean {
  const angle = getAngleInDegrees(arc, point);
  return isDegreeAngleBetween(arc.startAngle, arc.endAngle, angle);
}
