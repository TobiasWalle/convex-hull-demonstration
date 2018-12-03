import { Type } from '../types/type';
import { AbstractAlgorithm } from './abstract-algorithm';
import { GiftWrapping } from './gift-wrapping';

export const algorithms: Record<string, Type<AbstractAlgorithm>> = {
  'Gift Wrapping': GiftWrapping
};
