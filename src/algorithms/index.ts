import { Circle } from '../models/circle';
import { Point } from '../models/point';
import { ShapeType } from '../models/shape';
import { AbstractAlgorithm, AbstractAlgorithmType } from './abstract-algorithm';
import { GiftWrapping } from './gift-wrapping';
import { GrahamScan } from './graham-scan';
import { IncrementalAlgorithm } from './incremental-algorithm';

const pointAlgorithms: Record<string, AbstractAlgorithmType<AbstractAlgorithm<Point>, Point>> = {
  'Gift Wrapping': GiftWrapping,
  'Graham Scan': GrahamScan,
};

const circleAlgorithms: Record<string, AbstractAlgorithmType<AbstractAlgorithm<Circle>, Circle>> = {
  'Incremental Algorithm': IncrementalAlgorithm
};

export const algorithmsByType = {
  [ShapeType.Point]: pointAlgorithms,
  [ShapeType.Circle]: circleAlgorithms
};
