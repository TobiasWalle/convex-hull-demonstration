import { Point } from '../models/point';
import { AbstractAlgorithm, AbstractAlgorithmType } from './abstract-algorithm';

export function initAlgorithmnForTesting<T extends AbstractAlgorithm>(Alg: AbstractAlgorithmType<T>): T {
  return new Alg(
    () => {
    },
    () => {
    },
    () => {
    },
    0
  );
}

export async function expectAlgorithmnToWorkWithSimpleExample(Alg: AbstractAlgorithmType): Promise<void> {
  const points = [
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 2 },
    { x: 2, y: 2 },
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(points);
  sortPoints(result.points);
  expect(result).toMatchObject({
    points: sortPoints([
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 2 },
      { x: 0, y: 2 },
    ])
  });
}

export async function expectAlgorithmnToWorkWithIntermediateExample(Alg: AbstractAlgorithmType): Promise<void> {
  const points = [
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    { x: 3, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 4 },
  ];

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(points);
  sortPoints(result.points);
  expect(result).toMatchObject({
    points: sortPoints([
    { x: 0, y: 0 },
    { x: 3, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 4 },
    ])
  });
}


export async function expectAlgorithmnToWorkWithComplexExample(Alg: AbstractAlgorithmType): Promise<void> {
  const points = [
    {
      x: 611.4643860064564,
      y: 585.4202651770762
    },
    {
      x: 245.02354480184695,
      y: 693.6426331527122
    },
    {
      x: 204.2492231424591,
      y: 109.23055730104954
    },
    {
      x: 216.06824209537123,
      y: 676.6176167781883
    },
    {
      x: 337.2369705542983,
      y: 495.4193853704341
    },
    {
      x: 215.12585633475294,
      y: 653.1877118135666
    },
    {
      x: 81.06685434297097,
      y: 633.9633908893277
    },
    {
      x: 153.8495137355888,
      y: 618.5496339600312
    },
    {
      x: 116.16726791751888,
      y: 455.66162872263027
    },
    {
      x: 396.7502988084422,
      y: 58.665429085151274
    },
    {
      x: 650.6735399931936,
      y: 695.6713996280571
    },
    {
      x: 599.5637974643136,
      y: 282.21868563913233
    },
    {
      x: 432.526447761905,
      y: 698.5974548288541
    },
    {
      x: 528.1354432174586,
      y: 165.55163060069168
    },
    {
      x: 238.78447423027478,
      y: 699.9026618495786
    },
    {
      x: 90.53740066660475,
      y: 363.84172187673374
    },
    {
      x: 441.2636369974864,
      y: 161.52920058116956
    },
    {
      x: 211.6533730802986,
      y: 593.8684843076966
    },
    {
      x: 622.1470787937682,
      y: 515.9725136694376
    },
    {
      x: 237.46281212252032,
      y: 682.9864392009658
    },
    {
      x: 534.3157571431184,
      y: 256.98217897797247
    },
    {
      x: 683.9271734074138,
      y: 652.7308798770943
    },
    {
      x: 271.26007986760305,
      y: 573.2844177120618
    },
    {
      x: 704.7269236307135,
      y: 201.82802876204386
    },
    {
      x: 242.7398889425495,
      y: 556.6754170201857
    },
    {
      x: 347.377505342441,
      y: 610.1017041934582
    },
    {
      x: 560.5006490017681,
      y: 50.54428640382436
    },
    {
      x: 673.9664657205061,
      y: 471.63418041732155
    }
  ];
  const expected = sortPoints([
    {
      x: 81.06685434297097,
      y: 633.9633908893277
    },
    {
      x: 90.53740066660475,
      y: 363.84172187673374
    },
    {
      x: 204.2492231424591,
      y: 109.23055730104954
    },
    {
      x: 396.7502988084422,
      y: 58.665429085151274
    },
    {
      x: 560.5006490017681,
      y: 50.54428640382436
    },
    {
      x: 704.7269236307135,
      y: 201.82802876204386
    },
    {
      x: 683.9271734074138,
      y: 652.7308798770943
    },
    {
      x: 650.6735399931936,
      y: 695.6713996280571
    },
    {
      x: 432.526447761905,
      y: 698.5974548288541
    },
    {
      x: 238.78447423027478,
      y: 699.9026618495786
    }
  ]);

  const result = await initAlgorithmnForTesting(Alg).calculateConvexHull(points);
  sortPoints(result.points);
  expect(result).toMatchObject({
    points: expected
  });
}

function sortPoints(points: Point[]): Point[] {
  return points.sort((a, b) => {
    const xComp = a.x - b.x;
    if (xComp !== 0) {
      return xComp;
    }
    return a.y - b.y;
  });
}

