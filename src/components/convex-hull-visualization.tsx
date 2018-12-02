import React from 'react';

interface ConvexHullVisualizationProps {
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = () => {
  const points = [
    { x: 100, y: 200 },
    { x: 300, y: 220 },
    { x: 400, y: 300 },
    { x: 100, y: 340 },
  ];
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
    </g>
  );
};
