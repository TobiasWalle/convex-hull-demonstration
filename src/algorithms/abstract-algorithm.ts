import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { Type } from '../types/type';

export type MarkPoint = (point: Point) => void;

export type UpdateConvexHull = (ch: ConvexHull) => void;

export abstract class AbstractAlgorithm {
  private TIMEOUT = 200;
  private cancelled = false;

  constructor(
    private onUpdateConvexHull: UpdateConvexHull,
    private onMarkPointAsActive: MarkPoint,
    private onUnmarkPointAsActive: MarkPoint,
    private onMarkPointAsSelected: MarkPoint,
    private onUnmarkPointAsSelected: MarkPoint
  ) {
  }

  public abstract async calculateConvexHull(points: Point[]): Promise<ConvexHull>

  public cancel(): void {
    this.cancelled = true;
  }

  private async tick() {
    if (this.cancelled) {
      throw undefined;
    }
    await timeout(this.TIMEOUT);
  }

  protected async updateConvexHull(convexHull: ConvexHull): Promise<void> {
    await this.tick();
    this.onUpdateConvexHull(convexHull);
  }

  protected async markPointAsActive(point: Point): Promise<void> {
    await this.tick();
    this.onMarkPointAsActive(point);
  }

  protected async unmarkPointAsActive(point: Point): Promise<void> {
    await this.tick();
    this.onUnmarkPointAsActive(point);
  }

  protected async markPointAsSelected(point: Point): Promise<void> {
    await this.tick();
    this.onMarkPointAsSelected(point);
  }

  protected async unmarkPointAsSelected(point: Point): Promise<void> {
    await this.tick();
    this.onUnmarkPointAsSelected(point);
  }
}

export type AbstractAlgorithmType = Type<AbstractAlgorithm, [UpdateConvexHull, MarkPoint, MarkPoint, MarkPoint, MarkPoint]>

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
