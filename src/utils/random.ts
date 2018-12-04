import { Point } from '../models/point';
import { createArray } from './array';

export function generateRandomPoints(count: number, width: number, height: number): Point[] {
  return createArray(count).map(() => generateRandomPoint(width, height));
}

export function generateRandomPoint(width: number, height: number): Point {
  const padding = 50;
  return {
    x: random(padding, width - padding),
    y: random(padding, height - padding),
  }
}

function random(min: number, max: number): number {
  return (Math.random() * (max - min)) + min;
}
