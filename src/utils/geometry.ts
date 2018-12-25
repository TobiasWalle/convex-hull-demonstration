import { degreeToRadian } from '../algorithms/general.utils';
import { Point } from '../models/point';

export function degreeToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): Point {
  return {
    x: centerX + (radius * Math.cos(degreeToRadian(angleInDegrees))),
    y: centerY + (radius * Math.sin(degreeToRadian(angleInDegrees)))
  };
}

export function distanceBetween(p1: Point, p2: Point): number {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

export function cartesianToPolarPhi(center: Point, point: Point): number {
  return Math.atan2(point.y - center.y, point.x - point.x);
}

export function isBetweenPolarPhis(startPhi: number, endPhi: number, phi: number): boolean {
  const startInPercent = getPositionInPercent(startPhi);
  const lowerBound = 0;
  let endInPercent = getPositionInPercent(endPhi);
  const upperBound = subtractInRange(
    endInPercent,
    startInPercent,
    1
  );
  let phiInPercent = getPositionInPercent(phi);
  const phiPosition = subtractInRange(
    phiInPercent,
    startInPercent,
    1
  );
  return phiPosition >= lowerBound && phiPosition <= upperBound;
}

function getPositionInPercent(value: number) {
  const percent = Math.abs(value) / Math.PI * .5;
  if (value <= 0) {
    return percent;
  } else {
    return 1 - percent;
  }
}

function subtractInRange(value: number, valueToSubtract: number, maxValue: number): number {
  const result = value - valueToSubtract;
  if (result >= 0) {
    return result;
  } else {
    return maxValue - (-result % maxValue);
  }
}

export function isDegreeAngleBetween(startAngle: number, endAngle: number, angle: number): boolean {
  if (endAngle < startAngle) {
    angle += 360;
    endAngle += 360;
  }
  return angle >= startAngle && angle <= endAngle;
}

