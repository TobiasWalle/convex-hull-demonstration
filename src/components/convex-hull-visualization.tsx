import React from 'react';
import { GiftWrapping } from '../algorithms/gift-wrapping';
import { useWindowSize } from '../hooks/use-window-size';
import { Point } from '../models/point';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps {
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = () => {
  const { width, height } = useWindowSize();
  const points = generateRandomPoints(width, height);
  const convexHull = new GiftWrapping().calculateConvexHull(points);

  return (
    <g>
      {points.map(point => (
        <circle
          key={`${point.x}-${point.y}`}
          r={3}
          fill="black"
          cx={point.x}
          cy={point.y}
        />
      ))}
      <MultiPointLine points={convexHull.points}/>
    </g>
  );
};

function generateRandomPoints(width: number, height: number): Point[] {
  return createArray(20).map(() => generateRandomPoint(width, height));
}

function generateRandomPoint(width: number, height: number): Point {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  }
}

function createArray(size: number): number[] {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = i;
  }
  return arr;
}
