import React from 'react';
import { Point } from '../models/point';

interface MultiPointLineProps {
  points: Point[]
}

export const MultiPointLine: React.FunctionComponent<MultiPointLineProps> = ({ points }) => (
  <>
    {zipWithPrevious(points).map(([p1, p2], i) => (
      <line
        key={i}
        x1={p1.x}
        y1={p1.y}
        x2={p2.x}
        y2={p2.y}
        stroke="red"
      />
    ))}
  </>
);

function zipWithPrevious<T>(list: T[]): [T, T][] {
  const result: [T, T][] = [
    [list[list.length - 1], list[0]]
  ];
  list.forEach((e, i) => {
    if (i === 0) {
      return;
    }
    result.push([list[i - 1], e]);
  });
  return result;
}
