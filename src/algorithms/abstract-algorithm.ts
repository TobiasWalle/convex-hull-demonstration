import { ConvexHull } from '../models/convext-hull';
import { Shape } from '../models/shape';
import { Type } from '../types/type';

export type MarkShape = (shape: Shape, color: string, text?: string) => void;
export type UnmarkShape = (shape: Shape, color: string) => void;

export type UpdateConvexHull<S extends Shape> = (ch: ConvexHull<S>) => void;


export abstract class AbstractAlgorithm<S extends Shape> {
  public abstract complexity: string;

  private cancelled = false;
  private _continue?: () => void;

  constructor(
    private onUpdateConvexHull: UpdateConvexHull<S>,
    private onMarkShape: MarkShape,
    private onUnmarkShape: UnmarkShape,
    private timeout = 200,
    private auto = true
  ) {
  }

  public abstract async calculateConvexHull(points: S[]): Promise<ConvexHull<S>>

  public cancel(): void {
    this.cancelled = true;
  }

  public continue(): void {
    this._continue && this._continue();
  }

  protected async updateConvexHull(convexHull: ConvexHull<S>): Promise<void> {
    this.onUpdateConvexHull(convexHull);
    await this.tick();
  }

  protected async markShape(shape: S, color: string, text?: string): Promise<void> {
    this.onMarkShape(shape, color, text);
    await this.tick();
  }

  protected async unmarkShape(shape: S, color: string): Promise<void> {
    this.onUnmarkShape(shape, color);
    await this.tick();
  }

  private async tick() {
    this.checkIfCancelled();
    if (this.auto) {
      await timeout(this.timeout);
    } else {
      await new Promise(resolve => this._continue = resolve);
    }
    this.checkIfCancelled();
  }

  private checkIfCancelled() {
    if (this.cancelled) {
      throw undefined;
    }
  }
}

export type AbstractAlgorithmType<T extends AbstractAlgorithm<S> = AbstractAlgorithm<S>, S extends Shape = Shape> =
  Type<T, [UpdateConvexHull<S>, MarkShape, UnmarkShape, number?, boolean?]>

function timeout(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  })
}
