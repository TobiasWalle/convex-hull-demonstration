import { ConvexHull } from '../models/convext-hull';
import { Point } from '../models/point';
import { Type } from '../types/type';

export type MarkPoint = (point: Point, color: string, text?: string) => void;
export type UnmarkPoint = (point: Point, color: string) => void;

export type UpdateConvexHull = (ch: ConvexHull) => void;

export abstract class AbstractAlgorithm {
  public abstract complexity: string;

  private cancelled = false;

  constructor(
    private onUpdateConvexHull: UpdateConvexHull,
    private onMarkPoint: MarkPoint,
    private onUnmarkPoint: UnmarkPoint,
    private timeout = 200
  ) {
  }

  public abstract async calculateConvexHull(points: Point[]): Promise<ConvexHull>

  public cancel(): void {
    this.cancelled = true;
  }

  protected async updateConvexHull(convexHull: ConvexHull): Promise<void> {
    this.onUpdateConvexHull(convexHull);
    await this.tick();
  }

  protected async markPoint(point: Point, color: string, text?: string): Promise<void> {
    this.onMarkPoint(point, color, text);
    await this.tick();
  }

  protected async unmarkPoint(point: Point, color: string): Promise<void> {
    this.onUnmarkPoint(point, color);
    await this.tick();
  }

  private async tick() {
    this.checkIfCancelled();
    await timeout(this.timeout);
    this.checkIfCancelled();
  }

  private checkIfCancelled() {
    if (this.cancelled) {
      throw undefined;
    }
  }
}

export type AbstractAlgorithmType<T extends AbstractAlgorithm = AbstractAlgorithm> = Type<T, [UpdateConvexHull, MarkPoint, UnmarkPoint, number?]>

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
