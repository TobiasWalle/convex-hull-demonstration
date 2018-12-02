import React from 'react';
import { GiftWrapping } from '../algorithms/gift-wrapping';
import { useWindowSize } from '../hooks/use-window-size';
import { generateRandomPoints } from '../utils/random';
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
          fill="#373737"
          cx={point.x}
          cy={point.y}
        />
      ))}
      <MultiPointLine points={convexHull.points}/>
    </g>
  );
};

