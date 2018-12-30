import React from 'react';
import { Arc } from '../models/arc';
import { degreeToCartesian } from '../utils/geometry';

interface ArcVisualizationProps {
  arc: Arc;
}

export const ArcVisualization: React.FunctionComponent<ArcVisualizationProps> = ({
  arc: {
    x,
    y,
    startAngle,
    endAngle,
    radius
  }
}) => {
  if (startAngle == 0 && endAngle == 360) {
    endAngle -= 0.01;
  }

  const start = degreeToCartesian(x, y, radius, endAngle);
  const end = degreeToCartesian(x, y, radius, startAngle);

  const largeArcFlag = getAngleDiff(startAngle, endAngle) > 180 ? 1 : 0;

  const d = [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  ].join(' ');

  return (
    <>
      <path
        d={d}
        fill="transparent"
        stroke="red"
        strokeWidth={2}
      />
    </>
  );
};

function getAngleDiff(start: number, end: number): number {
  if (end >= start) {
    return end - start;
  } else {
    return (end + 360) - start;
  }
}
