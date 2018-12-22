import styled from '@emotion/styled';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { algorithms } from '../algorithms';
import { AbstractAlgorithmType } from '../algorithms/abstract-algorithm';
import { GiftWrapping } from '../algorithms/gift-wrapping';
import { useFunctionState } from '../hooks/use-function-state';
import { generateRandomPoint, generateRandomPoints } from '../utils/random';
import { Button } from './button';
import { ConvexHullVisualization } from './convex-hull-visualization';
import { Select } from './select';
import { Toggle } from './toggle';

interface AppProps {
}

export const App: React.FunctionComponent<AppProps> = () => {
  const width = 800;
  const height = 800;
  let [points, setPoints] = useState(generateRandomPoints(5, width, height));
  const [{ algorithm }, setAlgorithm] = useState({ algorithm: GiftWrapping });
  const [manuelModeActivated, setManuelModeActivated] = useState(true);

  type AlgorithmOption = [string, AbstractAlgorithmType];
  const algorithmOptions: AlgorithmOption[] = useMemo(
    () => Object.keys(algorithms).map((key): AlgorithmOption =>
      [key, algorithms[key]]
    ),
    []
  );
  const handleSelect = useCallback((item: AlgorithmOption) => {
    setAlgorithm({ algorithm: item[1] })
  }, []);
  const renderOption = useCallback((item: AlgorithmOption) => {
    return item[0]
  }, []);

  const handleGenerate = useCallback(() => {
    setPoints(generateRandomPoints(5, width, height));
  }, [width, height]);

  const handleAdd = useCallback(() => {
    setPoints([...points, generateRandomPoint(width, height)]);
  }, [width, height, points]);

  let [handleContinue, setHandleContinue] = useFunctionState(() => {});

  return (
    <div>
      <Controls>
        <Button onClick={handleGenerate}>Regenerate</Button>
        <Button onClick={handleAdd}>Add Point</Button>
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
          points={points}
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
