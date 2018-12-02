import { Point } from '../models/point';
import { createArray } from './array';

export function generateRandomPoints(width: number, height: number): Point[] {
  return createArray(20).map(() => generateRandomPoint(width, height));
}

export function generateRandomPoint(width: number, height: number): Point {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  }
}
