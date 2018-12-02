import React from 'react';
import { Circle, Layer } from 'react-konva';

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
    <Layer>
      {points.map(point => (
        <Circle
          radius={3}
          fill="black"
          x={point.x}
          y={point.y}
        />
      ))}
    </Layer>
  );
};
