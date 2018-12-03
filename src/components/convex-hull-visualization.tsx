import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { makePromiseCancable } from '../utils/promise';
import { MultiPointLine } from './multi-point-line';

interface ConvexHullVisualizationProps {
  points: Point[];
  algorithm: AbstractAlgorithmType;
  width: number;
  height: number;
}

export const ConvexHullVisualization: React.FunctionComponent<ConvexHullVisualizationProps> = ({ points, algorithm: Algorithmn, width, height }) => {
  const [markedPoints, {
    add: addMarkedPoint,
    remove: removeMarkedPoint,
    reset: resetMarkedPoints
  }] = useSetReducer();
  const [selectedPoints, {
    add: addSelectedPoint,
    remove: removeSelectedPoint,
    reset: resetSelectedPoint
  }] = useSetReducer();

  const [convexHull, setConvexHull] = useState<ConvexHull | null>(null);
  useEffect(
    () => {
      setConvexHull(null);
      const algorithmn = new Algorithmn(
        setConvexHull,
        addMarkedPoint,
        removeMarkedPoint,
        addSelectedPoint,
        removeSelectedPoint
      );
      const [promise, cancel] = makePromiseCancable(algorithmn.calculateConvexHull(points));
      promise
        .then(setConvexHull)
        .catch(error => {
          if (error) {
            console.error(error);
          }
        })
      ;
      return () => {
        cancel();
        algorithmn.cancel();
        resetMarkedPoints();
        resetSelectedPoint();
      }
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
            r={isMarked || isSelected ? 6 : 3}
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

interface ResetAction {
  type: 'RESET'
}

type SetActions<T> = AddItemAction<T> | RemoveItemAction<T> | ResetAction;

function setReducer<T>(set: Set<T>, action: SetActions<T>): Set<T> {
  switch (action.type) {
    case 'ADD':
      set = new Set(set);
      set.add(action.item);
      break;
    case 'DELETE':
      set = new Set(set);
      set.delete(action.item);
      break;
    case 'RESET':
      set = new Set();
      break;
  }
  return set;
}

type ItemDispatch<T> = (item: T) => void;

function useSetReducer<T>(initialSet: Set<T> = new Set()): [Set<T>, { add: ItemDispatch<T>, remove: ItemDispatch<T>, reset: () => void }] {
  const [set, dispatch] = useReducer<Set<T>, SetActions<T>>(setReducer, initialSet);
  const add = useCallback((item: T) => dispatch({ type: 'ADD', item }), []);
  const remove = useCallback((item: T) => dispatch({ type: 'DELETE', item }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);
  return [set, { add, remove, reset }];
}

