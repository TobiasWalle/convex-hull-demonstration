import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { AbstractAlgorithm, AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { useMarker } from '../hooks/use-marker';
import { COLORS } from '../models/colors';
import { ConvexHull } from '../models/convext-hull';
import { Shape } from '../models/shape';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps<S extends Shape> {
  shapes: S[];
  algorithm: AbstractAlgorithmType<AbstractAlgorithm<S>>;
  width: number;
  height: number;
  manuelModeActivated: boolean;
  getContinueAlgorithmFn: (continueAlgorithm: () => void) => void;
}

export const ConvexHullVisualization = <S extends Shape>({
  shapes,
  algorithm: Algorithm,
  width,
  height,
  getContinueAlgorithmFn: setContinueAlgorithmFn,
  manuelModeActivated
}: ConvexHullVisualizationProps<S>) => {
  const {
    add: markShape,
    remove: unmarkShape,
    reset: resetPointMarkers,
    getColor: getPointColor,
    getText: getPointText,
    isMarked: isPointMarked,
  } = useMarker((shape: Shape) => `${shape.x}|${shape.y}`);
  const [convexHull, setConvexHull] = useState<ConvexHull | null>(null);
  useEffect(
    () => {
      setConvexHull(null);
      const algorithm = new Algorithm(
        setConvexHull,
        markShape,
        unmarkShape,
        undefined,
        !manuelModeActivated
      );
      setContinueAlgorithmFn(() => algorithm.continue());
      algorithm.calculateConvexHull(shapes)
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
    [shapes, Algorithm, manuelModeActivated, setContinueAlgorithmFn]
  );

  return (
    <div>
      <svg width={width} height={height}>
        {shapes.map(shape => {
          const radius = isPointMarked(shape) ? 6 : 3;
          const text = getPointText(shape);
          const textOffset = radius * .8;
          return (
            <g
              key={`${shape.x}-${shape.y}`}
            >
              <Circle
                r={radius}
                fill={getPointColor(shape) || COLORS.GREY}
                cx={shape.x}
                cy={shape.y}
              />
              <Text
                x={shape.x + textOffset + 5}
                y={shape.y + textOffset}
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
