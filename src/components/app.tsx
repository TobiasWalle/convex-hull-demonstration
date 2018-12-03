import styled from '@emotion/styled';
import React, { useCallback, useMemo, useState } from 'react';
import { algorithms } from '../algorithms';
import { AbstractAlgorithm } from '../algorithms/abstract-algorithm';
import { GiftWrapping } from '../algorithms/gift-wrapping';
import { Type } from '../types/type';
import { generateRandomPoint, generateRandomPoints } from '../utils/random';
import { Button } from './button';
import { ConvexHullVisualization } from './convex-hull-visualization';
import { Select } from './select';

interface AppProps {
}

export const App: React.FunctionComponent<AppProps> = () => {
  const width = 500;
  const height = 500;
  let [points, setPoints] = useState(generateRandomPoints(5, width, height));
  const [{ algorithm }, setAlgorithm] = useState({ algorithm: GiftWrapping });

  type AlgorithmOption = [string, Type<AbstractAlgorithm>];
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
      </Controls>
      <VisualizationWrapper>
        <ConvexHullVisualization
          width={width}
          height={height}
          points={points}
          algorithm={algorithm}
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
