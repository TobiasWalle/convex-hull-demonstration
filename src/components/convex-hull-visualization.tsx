import styled from '@emotion/styled';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AbstractAlgorithm, AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
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
  manuelModeActivated: boolean;
  getContinueAlgorithmFn: (continueAlgorithm: () => void) => void;
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = ({
  points,
  algorithm: Algorithm,
  width,
  height,
  getContinueAlgorithmFn: setContinueAlgorithmFn,
  manuelModeActivated
}) => {
  const {
    add: markPoint,
    remove: unmarkPoint,
    reset: resetPointMarkers,
    getColor: getPointColor,
    getText: getPointText,
    isMarked: isPointMarked,
  } = useMarker((point: Point) => `${point.x}|${point.y}`);
  const [convexHull, setConvexHull] = useState<ConvexHull | null>(null);
  useEffect(
    () => {
      setConvexHull(null);
      const algorithm = new Algorithm(
        setConvexHull,
        markPoint,
        unmarkPoint,
        undefined,
        !manuelModeActivated
      );
      setContinueAlgorithmFn(() => algorithm.continue());
      algorithm.calculateConvexHull(points)
        .then(setConvexHull)
        .catch(error => {
          if (error) {
            console.error(error);
          }
        })
      ;
      return () => {
        algorithm.cancel();
        resetPointMarkers();
      }
    },
    [points, Algorithm, manuelModeActivated, setContinueAlgorithmFn]
  );

  return (
    <div>
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
    </div>
  );
};

const Circle = styled.circle`
    transition: all 100ms;
`;

const Text = styled.text`
    transition: x 100ms, y 100ms;
`;
