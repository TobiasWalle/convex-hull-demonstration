import styled from '@emotion/styled';
import React, { useCallback, useMemo, useState } from 'react';
import { algorithmsByType } from '../algorithms';
import { AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { useFunctionState } from '../hooks/use-function-state';
import { Shape, ShapeType } from '../models/shape';
import {
  generateRandomCircle,
  generateRandomCircles,
  generateRandomPoint,
  generateRandomPoints
} from '../utils/random';
import { Button } from './button';
import { ConvexHullVisualization } from './convex-hull-visualization';
import { Select } from './select';
import { Toggle } from './toggle';

interface AppProps {
}

export const App: React.FunctionComponent<AppProps> = () => {
  const shapeType = ShapeType.Point;
  const algorithms = algorithmsByType[shapeType];
  const width = 800;
  const height = 800;

  const {
    shapes,
    regenerateShapes,
    addShape
  } = useRandomShapes(shapeType, width, height);

  const [manuelModeActivated, setManuelModeActivated] = useState(true);
  const [algorithm, setAlgorithm] = useFunctionState(Object.values(algorithms)[0]);

  type AlgorithmOption = [string, AbstractAlgorithmType];
  const algorithmOptions: AlgorithmOption[] = useMemo(
    () => Object.keys(algorithms).map((key): AlgorithmOption =>
      [key, algorithms[key]]
    ),
    []
  );
  const handleSelect = useCallback((item: AlgorithmOption) => {
    setAlgorithm(item[1])
  }, [setAlgorithm]);
  const renderOption = useCallback((item: AlgorithmOption) => {
    return item[0]
  }, []);


  let [handleContinue, setHandleContinue] = useFunctionState(() => {
  });

  return (
    <div>
      <Controls>
        <Button onClick={regenerateShapes}>Regenerate</Button>
        <Button onClick={addShape}>Add</Button>
        <Select
          options={algorithmOptions}
          onSelect={handleSelect}
          renderOption={renderOption}
        />
        <Button onClick={handleContinue}>Continue</Button>
        <Toggle
          value={manuelModeActivated}
          onChange={setManuelModeActivated}
        >Manuel</Toggle>
      </Controls>
      <VisualizationWrapper>
        <ConvexHullVisualization
          width={width}
          height={height}
          shapes={shapes}
          algorithm={algorithm}
          manuelModeActivated={manuelModeActivated}
          getContinueAlgorithmFn={setHandleContinue}
        />
      </VisualizationWrapper>
    </div>
  );
};

const Controls = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
`;

const VisualizationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

interface UseRandomShapesResult {
  shapes: Shape[];
  regenerateShapes: () => void;
  addShape: () => void;
}

function useRandomShapes(type: ShapeType, width: number, height: number): UseRandomShapesResult {
  const generateShapes = useCallback(
    (n: number) => type === ShapeType.Point
      ? generateRandomPoints(n, width, height)
      : generateRandomCircles(n, width, height),
    [type, width, height]
  );
    const generateItem = useCallback(
    () => type === ShapeType.Point
      ? generateRandomPoint(width, height)
      : generateRandomCircle(width, height),
    [type, width, height]
  );

  let [shapes, setShapes] = useState<Shape[]>(generateShapes(5));

  const regenerateShapes = useCallback(() => {
    setShapes(generateShapes(5));
  }, [setShapes, generateShapes]);

  const addShape = useCallback(() => {
    setShapes([...shapes, generateItem()]);
  }, [setShapes, generateItem, shapes]);

  return {
    shapes,
    regenerateShapes,
    addShape
  }
}
