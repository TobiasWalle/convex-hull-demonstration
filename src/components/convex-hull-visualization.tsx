import React from 'react';
import { AbstractAlgorithm } from '../algorithms/abstract-algorithm';
import { Point } from '../models/point';
import { Type } from '../types/type';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps {
  points: Point[];
  algorithm: Type<AbstractAlgorithm>;
  width: number;
  height: number;
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = ({ points, algorithm, width, height }) => {
  const convexHull = new algorithm().calculateConvexHull(points);

  return (
    <svg width={width} height={height}>
      {points.map(point => (
        <circle
          key={`${point.x}-${point.y}`}
          r={3}
          fill="#373737"
          cx={point.x}
          cy={point.y}
        />
      ))}
      <MultiPointLine points={convexHull.points}/>
    </svg>
  );
};

