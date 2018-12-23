import { Point } from '../models/point';
import { AbstractAlgorithm, AbstractAlgorithmType } from './abstract-algorithm';
import { GiftWrapping } from './gift-wrapping';
import { GrahamScan } from './graham-scan';

export const pointAlgorithms: Record<string, AbstractAlgorithmType<AbstractAlgorithm<Point>>> = {
  'Gift Wrapping': GiftWrapping,
  'Graham Scan': GrahamScan,
};
