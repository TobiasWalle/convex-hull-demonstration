import React from 'react';
import { CircleConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { degreeToCartesian } from '../utils/geometry';
import { ArcVisualization } from './arc-visualization';
import { MultiPointLine } from './multi-point-line';

interface CircleConvexHullVisualizationProps {
  hull: CircleConvexHull;
}

export const CircleConvexHullVisualization: React.FunctionComponent<CircleConvexHullVisualizationProps> = ({
  hull
}) => {
  console.log('HULL', hull);
  const startAndEndPoints = hull.arcs.map(arc => ({
    start: degreeToCartesian(arc.x, arc.y, arc.radius, arc.startAngle),
    end: degreeToCartesian(arc.x, arc.y, arc.radius, arc.endAngle),
  }));
  if (startAndEndPoints.length === 0) {
    return <g/>;
  }
  const lines: Point[][] = [
    [ startAndEndPoints[0].start, startAndEndPoints[startAndEndPoints.length - 1].end ]
  ];
  for (let i = 1; i < startAndEndPoints.length; i++) {
    lines.push([
      startAndEndPoints[i - 1].end,
      startAndEndPoints[i].start,
    ]);
  }
  console.log(lines);
  return (
    <g>
      {hull.arcs.map((arc, i) => <ArcVisualization key={i} arc={arc}/>)}
      {lines.map((line, i) =>
        <MultiPointLine key={i} points={line}/>
      )}
    </g>
  );
};
