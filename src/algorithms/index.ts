import { AbstractAlgorithm } from './abstract-algorithm';
import { GiftWrapping } from './gift-wrapping';

export const algorithms: Record<string, AbstractAlgorithm> = {
  'Gift Wrapping': new GiftWrapping()
};
