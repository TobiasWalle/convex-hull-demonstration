import React from 'react';
import { Stage } from 'react-konva';
import { useWindowSize } from '../hooks/use-window-size';
import { ConvexHullVisualization } from './convex-hull-visualization';

interface AppProps {
}

export const App: React.FunctionComponent<AppProps> = () => {
  const { width, height } = useWindowSize();

  return (
    <Stage width={width} height={height}>
      <ConvexHullVisualization/>
    </Stage>
  );
};
