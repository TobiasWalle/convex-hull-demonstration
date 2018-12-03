import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps {
  points: Point[];
  algorithm: AbstractAlgorithmType;
  width: number;
  height: number;
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = ({ points, algorithm, width, height }) => {
  const [markedPoints, {
    add: addMarkedPoint,
    remove: removeMarkedPoint
  }] = useSetReducer();
  const [selectedPoints, {
    add: addSelectedPoint,
    remove: removeSelectedPoint
  }] = useSetReducer();

  const [convexHull, setConvexHull] = useState<ConvexHull | null>(null);
  useEffect(
    () => {
      setConvexHull(null);
      new algorithm(
        setConvexHull,
        addMarkedPoint,
        removeMarkedPoint,
        addSelectedPoint,
        removeSelectedPoint
      ).calculateConvexHull(points).then(setConvexHull)
    },
    [points]
  );

  const defaultColor = '#373737';
  const markedColor = '#ff1c21';
  const selectedColor = '#0ab40e';

  return (
    <svg width={width} height={height}>
      {points.map(point => {
        const isMarked = markedPoints.has(point);
        const isSelected = selectedPoints.has(point);
        return (
          <circle
            key={`${point.x}-${point.y}`}
            r={isMarked || isSelected? 6 : 3}
            fill={
              isMarked ? markedColor
                : isSelected ? selectedColor
                : defaultColor
            }
            cx={point.x}
            cy={point.y}
          />
        );
      })}
      {convexHull && <MultiPointLine points={convexHull.points}/>}
    </svg>
  );
};

interface AddItemAction<T> {
  type: 'ADD',
  item: T;
}

interface RemoveItemAction<T> {
  type: 'DELETE',
  item: T;
}

type SetActions<T> = AddItemAction<T> | RemoveItemAction<T>;

function setReducer<T>(set: Set<T>, action: SetActions<T>): Set<T> {
  set = new Set(set);
  switch (action.type) {
    case 'ADD':
      set.add(action.item);
      break;
    case 'DELETE':
      set.delete(action.item);
      break;
  }
  return set;
}

type ItemDispatch<T> = (item: T) => void;

function useSetReducer<T>(initialSet: Set<T> = new Set()): [Set<T>, { add: ItemDispatch<T>, remove: ItemDispatch<T> }] {
  const [set, dispatch] = useReducer<Set<T>, SetActions<T>>(setReducer, initialSet);
  const add = useCallback((item: T) => dispatch({ type: 'ADD', item }), []);
  const remove = useCallback((item: T) => dispatch({ type: 'DELETE', item }), []);
  return [set, { add, remove }];
}

