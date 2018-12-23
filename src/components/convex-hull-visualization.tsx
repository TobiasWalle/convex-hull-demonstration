import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { AbstractAlgorithm, AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { useMarker } from '../hooks/use-marker';
import { COLORS } from '../models/colors';
import { isCircleConvexHull, UnknownConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { isShapeCircle, isShapePoint, Shape } from '../models/shape';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps<S extends Shape> {
  shapes: S[];
  algorithm: AbstractAlgorithmType<AbstractAlgorithm<S>, S>;
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
    isMarked: isShapeMarked,
  } = useMarker((shape: Shape) => `${shape.x}|${shape.y}`);
  const [convexHull, setConvexHull] = useState<UnknownConvexHull | null>(null);
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
          const isMarked = isShapeMarked(shape);
          const color = getPointColor(shape) || COLORS.GREY;
          const text = getPointText(shape);
          if (isShapeCircle(shape)) {
            return <Text x={shape.x} y={shape.y}>Circle</Text>
          } else if (isShapePoint(shape)) {
            return (
              <PointVisulization
                key={`${shape.x}-${shape.y}`}
                point={shape}
                isMarked={isMarked}
                text={text}
                color={color}
              />
            );
          }
        })}
        {convexHull && (
          isCircleConvexHull(convexHull)
          ? <g/>
          : <MultiPointLine points={convexHull.points}/>
        )
        }
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

interface PointVisualizationProps {
  point: Point;
  isMarked: boolean;
  color?: string;
  text?: string;
}

const PointVisulization = ({
  point,
  isMarked,
  text,
  color
}: PointVisualizationProps) => {
  const radius = isMarked ? 6 : 3;
  const textOffset = radius * .8;
  return (
    <g>
      <Circle
        r={radius}
        fill={color}
        cx={point.x}
        cy={point.y}
      />
      <Text
        x={point.x + textOffset + 5}
        y={point.y + textOffset}
      >{text}</Text></g>
  );
};
