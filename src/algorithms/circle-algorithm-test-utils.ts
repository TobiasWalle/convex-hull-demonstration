import { Arc } from '../models/arc';
import { Circle } from '../models/circle';
import { AbstractAlgorithm, AbstractAlgorithmType } from './abstract-algorithm';
import { initAlgorithmnForTesting } from './test.utils';

export async function expectCircleAlgorithmToWorkWithCircleOutsideHull(Alg: AbstractAlgorithmType<AbstractAlgorithm<Circle>>): Promise<void> {
  const circles: Circle[] = [
    { x: 10, y: 60, radius: 5 },
    { x: 40, y: 20, radius: 15 },
    { x: 70, y: 50, radius: 10 }
  ];
  const expectedArcs: Arc[] = [
    { x: 40, y: 20, radius: 15, startAngle: 228, endAngle: 308 },
    { x: 10, y: 60, radius: 5, startAngle: 75, endAngle: 228 },
    { x: 70, y: 50, radius: 10, startAngle: 308, endAngle: 75 },
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(circles);

  expect(result.arcs).toBeDeepCloseTo(expectedArcs, 0);
}
