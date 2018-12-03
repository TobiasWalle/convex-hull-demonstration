import { Point } from '../models/point';
import { createArray } from './array';

export function generateRandomPoints(count: number, width: number, height: number): Point[] {
  return createArray(count).map(() => generateRandomPoint(width, height));
}

export function generateRandomPoint(width: number, height: number): Point {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  }
}
