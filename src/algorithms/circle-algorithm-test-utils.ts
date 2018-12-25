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
    { x: 10, y: 60, radius: 5, startAngle: 165.8226738380262, endAngle: 295.33293861302855 },
    { x: 70, y: 50, radius: 10, startAngle: 51.76810136869057, endAngle: 165.8226738380262 },
    { x: 40, y: 20, radius: 15, startAngle: 295.33293861302855, endAngle: 51.76810136869057 }
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(circles);

  expect(result.arcs).toEqual(expectedArcs);
}
