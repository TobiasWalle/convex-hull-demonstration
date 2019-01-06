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
    { x: 40, y: 20, radius: 15, startAngle: 321, endAngle: 205 },
    { x: 10, y: 60, radius: 5, startAngle: 205, endAngle: 85 },
    { x: 70, y: 50, radius: 10, startAngle: 85, endAngle: 321 },
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(circles);

  expect(result.arcs).toBeDeepCloseTo(expectedArcs, 0);
}

export async function expectCircleAlgorithmToWorkWith4CirclesOfTheSameSize(Alg: AbstractAlgorithmType<AbstractAlgorithm<Circle>>): Promise<void> {
  const circles: Circle[] = [
    { x: 10, y: 10, radius: 5 },
    { x: 10, y: 30, radius: 5 },
    { x: 30, y: 10, radius: 5 },
    { x: 30, y: 30, radius: 5 },
  ];
  const expectedArcs: Arc[] = [
    { x: 30, y: 10, radius: 5, startAngle: 0, endAngle: 270 },
    { x: 10, y: 10, radius: 5, startAngle: 270, endAngle: 180 },
    { x: 10, y: 30, radius: 5, startAngle: 180, endAngle: 90 },
    { x: 30, y: 30, radius: 5, startAngle: 90, endAngle: 0 },
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(circles);

  expect(result.arcs).toBeDeepCloseTo(expectedArcs, 0);
}

export async function expectCircleAlgorithmToWork(args: {
  circles: Circle[];
  expectedArcs: Arc[];
  Alg: AbstractAlgorithmType<AbstractAlgorithm<Circle>>;
}): Promise<void> {
  const { circles, expectedArcs, Alg } = args;

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(circles);

  expect(result.arcs).toBeDeepCloseTo(expectedArcs, 0);
}
