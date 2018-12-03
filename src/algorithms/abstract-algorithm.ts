import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { Type } from '../types/type';

export type MarkPoint = (point: Point) => void;

export type UpdateConvexHull = (ch: ConvexHull) => void;

export abstract class AbstractAlgorithm {
  private TIMEOUT = 200;
  constructor(
    private onUpdateConvexHull: UpdateConvexHull,
    private onMarkPointAsActive: MarkPoint,
    private onUnmarkPointAsActive: MarkPoint,
    private onMarkPointAsSelected: MarkPoint,
    private onUnmarkPointAsSelected: MarkPoint
  ) {
  }

  public abstract async calculateConvexHull(points: Point[]): Promise<ConvexHull>

  protected async updateConvexHull(convexHull: ConvexHull): Promise<void> {
    await timeout(this.TIMEOUT);
    this.onUpdateConvexHull(convexHull);
  }

  protected async markPointAsActive(point: Point): Promise<void> {
    await timeout(this.TIMEOUT);
    this.onMarkPointAsActive(point);
  }

  protected async unmarkPointAsActive(point: Point): Promise<void> {
    await timeout(this.TIMEOUT);
    this.onUnmarkPointAsActive(point);
  }

  protected async markPointAsSelected(point: Point): Promise<void> {
    this.onMarkPointAsSelected(point);
  }

  protected async unmarkPointAsSelected(point: Point): Promise<void> {
    await timeout(this.TIMEOUT);
    this.onUnmarkPointAsSelected(point);
  }
}

export type AbstractAlgorithmType = Type<AbstractAlgorithm, [UpdateConvexHull, MarkPoint, MarkPoint, MarkPoint, MarkPoint]>

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
