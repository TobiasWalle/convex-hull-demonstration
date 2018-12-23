import React from 'react';
import { Arc } from '../models/arc';
import { polarToCartesian } from '../utils/geometry';

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
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  const d = [
    `M ${start.x} ${start.y}`,
    `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  ].join(' ');

  return (
    <path
      d={d}
      fill="transparent"
      stroke="black"
      strokeWidth={2}
    />
  );
};

