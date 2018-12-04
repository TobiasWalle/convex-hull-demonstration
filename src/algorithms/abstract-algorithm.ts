import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { Type } from '../types/type';

export type MarkPoint = (point: Point, color: string, text?: string) => void;
export type UnmarkPoint = (point: Point, color: string) => void;

export type UpdateConvexHull = (ch: ConvexHull) => void;

export abstract class AbstractAlgorithm {
  private TIMEOUT = 200;
  private cancelled = false;

  constructor(
    private onUpdateConvexHull: UpdateConvexHull,
    private onMarkPoint: MarkPoint,
    private onUnmarkPoint: UnmarkPoint,
  ) {
  }

  public abstract async calculateConvexHull(points: Point[]): Promise<ConvexHull>

  public cancel(): void {
    this.cancelled = true;
  }

  protected async updateConvexHull(convexHull: ConvexHull): Promise<void> {
    await this.tick();
    this.onUpdateConvexHull(convexHull);
  }

  protected async markPoint(point: Point, color: string, text?: string): Promise<void> {
    await this.tick();
    this.onMarkPoint(point, color, text);
  }

  protected async unmarkPoint(point: Point, color: string): Promise<void> {
    await this.tick();
    this.onUnmarkPoint(point, color);
  }

  private async tick() {
    this.checkIfCancelled();
    await timeout(this.TIMEOUT);
    this.checkIfCancelled();
  }

  private checkIfCancelled() {
    if (this.cancelled) {
      throw undefined;
    }
  }
}

export type AbstractAlgorithmType = Type<AbstractAlgorithm, [UpdateConvexHull, MarkPoint, UnmarkPoint]>

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
