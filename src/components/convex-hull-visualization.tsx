import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { useMarker } from '../hooks/use-marker';
import { COLORS } from '../models/colors';
import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps {
  points: Point[];
  algorithm: AbstractAlgorithmType;
  width: number;
  height: number;
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = ({ points, algorithm: Algorithmn, width, height }) => {
  const {
    add: markPoint,
    remove: unmarkPoint,
    reset: resetPointMarkers,
    getColor: getPointColor,
    getText: getPointText,
    isMarked: isPointMarked,
  } = useMarker<Point>();

  const [convexHull, setConvexHull] = useState<ConvexHull | null>(null);
  useEffect(
    () => {
      setConvexHull(null);
      const algorithmn = new Algorithmn(
        setConvexHull,
        markPoint,
        unmarkPoint,
      );
      algorithmn.calculateConvexHull(points)
        .then(setConvexHull)
        .catch(error => {
          if (error) {
            console.error(error);
          }
        })
      ;
      return () => {
        algorithmn.cancel();
        resetPointMarkers();
      }
    },
    [points]
  );

  return (
    <svg width={width} height={height}>
      {points.map(point => {
        const radius = isPointMarked(point) ? 6 : 3;
        const text = getPointText(point);
        const textOffset = radius * .8;
        return (
          <g
            key={`${point.x}-${point.y}`}
          >
            <Circle
              r={radius}
              fill={getPointColor(point) || COLORS.GREY}
              cx={point.x}
              cy={point.y}
            />
            <Text
              x={point.x + textOffset + 5}
              y={point.y + textOffset}
            >{text}</Text>
          </g>
        );
      })}
      {convexHull && <MultiPointLine points={convexHull.points}/>}
    </svg>
  );
};

const Circle = styled.circle`
    transition: all 100ms;
`;

const Text = styled.text`
    transition: x 100ms, y 100ms;
`;
