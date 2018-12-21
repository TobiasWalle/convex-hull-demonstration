import { AbstractAlgorithmType } from './abstract-algorithm';
import { GiftWrapping } from './gift-wrapping';
import { GrahamScan } from './graham-scan';

export const algorithms: Record<string, AbstractAlgorithmType> = {
  'Gift Wrapping': GiftWrapping,
  'Graham Scan': GrahamScan,
};
