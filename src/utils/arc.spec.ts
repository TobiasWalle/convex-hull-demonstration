import { Point } from '../models/point';
import {
  calculateArcs,
  calculateTangentsToCorrectArcs,
  correctArcs,
  getClockwiseAndCounterclockwisePointRelativeTo
} from './arc';

describe('calculateArcs', () => {
  it('should work with left/right', () => {
    expect(calculateArcs(
      { x: 1, y: 1, radius: 1 },
      { x: 3, y: 1, radius: 1 }
    )).toEqual([
      { x: 1, y: 1, radius: 1, startAngle: 90, endAngle: 270 },
      { x: 3, y: 1, radius: 1, startAngle: 270, endAngle: 90 },
    ]);

    expect(calculateArcs(
      { x: 3, y: 1, radius: 1 },
      { x: 1, y: 1, radius: 1 }
    )).toEqual([
      { x: 3, y: 1, radius: 1, startAngle: 270, endAngle: 90 },
      { x: 1, y: 1, radius: 1, startAngle: 90, endAngle: 270 },
    ]);
  });

  it('should work with bottom/top', () => {
    expect(calculateArcs(
      { x: 1, y: 1, radius: 1 },
      { x: 1, y: 3, radius: 1 }
    )).toEqual([
      { x: 1, y: 1, radius: 1, startAngle: 180, endAngle: 360 },
      { x: 1, y: 3, radius: 1, startAngle: 0, endAngle: 180 },
    ]);
  });
});

describe('correctArcs', () => {
  it('should work if circle is above arcs', () => {
    expect(correctArcs(
      { x: 3, y: 3, radius: 1 },
      { x: 1, y: 1, radius: 1, startAngle: 1, endAngle: 2 },
      { x: 3, y: 1, radius: 1, startAngle: 3, endAngle: 4 },
    )).toEqual([
      { x: 1, y: 1, radius: 1, startAngle: 1, endAngle: 135 },
      { x: 3, y: 3, radius: 1, startAngle: 135, endAngle: 0 },
      { x: 3, y: 1, radius: 1, startAngle: 0, endAngle: 4 },
    ]);
  });

  it('should work if circle is below arcs 1', () => {
    expect(correctArcs(
      { x: 3, y: 1, radius: 1 },
      { x: 3, y: 3, radius: 1, startAngle: 3, endAngle: 4 },
      { x: 1, y: 3, radius: 1, startAngle: 1, endAngle: 2 },
    )).toEqual([
      { x: 3, y: 3, radius: 1, startAngle: 3, endAngle: 0 },
      { x: 3, y: 1, radius: 1, startAngle: 0, endAngle: 225 },
      { x: 1, y: 3, radius: 1, startAngle: 225, endAngle: 2 },
    ]);
  });

  it('should work if circle is below arcs 2', () => {
    expect(correctArcs(
      { x: 5, y: 1, radius: 1 },
      { x: 3, y: 3, radius: 1, startAngle: 3, endAngle: 4 },
      { x: 1, y: 3, radius: 1, startAngle: 1, endAngle: 2 },
    )).toMatchCloseTo([
      { x: 3, y: 3, radius: 1, startAngle: 3, endAngle: 45 },
      { x: 5, y: 1, radius: 1, startAngle: 45, endAngle: 243 },
      { x: 1, y: 3, radius: 1, startAngle: 243, endAngle: 2 },
    ], 0);
  });

  it('should work if circle is left to arcs', () => {
    expect(correctArcs(
      { x: 1, y: 1, radius: 1 },
      { x: 3, y: 1, radius: 1, startAngle: 1, endAngle: 2 },
      { x: 3, y: 3, radius: 1, startAngle: 3, endAngle: 4 },
    )).toEqual([
      { x: 3, y: 1, radius: 1, startAngle: 1, endAngle: 270 },
      { x: 1, y: 1, radius: 1, startAngle: 270, endAngle: 135 },
      { x: 3, y: 3, radius: 1, startAngle: 135, endAngle: 4 },
    ]);
  });

  it('should work if circle is right to arcs', () => {
    expect(correctArcs(
      { x: 3, y: 1, radius: 1 },
      { x: 1, y: 3, radius: 1, startAngle: 1, endAngle: 2 },
      { x: 1, y: 1, radius: 1, startAngle: 3, endAngle: 4 },
    )).toEqual([
      { x: 1, y: 3, radius: 1, startAngle: 1, endAngle: 45 },
      { x: 3, y: 1, radius: 1, startAngle: 45, endAngle: 270 },
      { x: 1, y: 1, radius: 1, startAngle: 270, endAngle: 4 },
    ]);
  });
});

describe('getClockwiseAndCounterclockwiseArcRelativeTo', () => {

  function test({ pivot, c, cw }: { pivot: Point, c: Point, cw: Point }) {
    expect(getClockwiseAndCounterclockwisePointRelativeTo(pivot, c, cw)).toEqual({
      clockWise: c,
      counterClockWise: cw
    });
    expect(getClockwiseAndCounterclockwisePointRelativeTo(pivot, cw, c)).toEqual({
      clockWise: c,
      counterClockWise: cw
    });
  }

  it('should work', () => {
    test({ pivot: { x: 10, y: 10 }, c: { x: 0, y: 0 }, cw: { x: 0, y: 20 } });
    test({ pivot: { x: 0, y: 0 }, c: { x: 10, y: 20 }, cw: { x: 10, y: 0 } });
    test({ pivot: { x: 10, y: 0 }, c: { x: 0, y: 10 }, cw: { x: 20, y: 10 } });
    test({ pivot: { x: 10, y: 10 }, c: { x: 10, y: 0 }, cw: { x: 0, y: 0 } });
  });
});

describe('calculateTangentsToCorrectArcs', () => {
  it('should work with top right corner', () => {
    const counterClockWiseArc = {
      x: 10,
      y: 30,
      radius: 5
    };
    const clockWiseArc = {
      x: 30,
      y: 10,
      radius: 5
    };
    const circle = {
      x: 30,
      y: 30,
      radius: 5
    };

    expect(calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle)).toEqual({
      ccToCircle: {
        start: { x: 10, y: 35 },
        end: { x: 30, y: 35 }
      },
      circleToCw: {
        start: { x: 35, y: 30 },
        end: { x: 35, y: 10 }
      },
    });
  });

  it('should work with bottom right corner', () => {
    const counterClockWiseArc = {
      x: 30,
      y: 30,
      radius: 5
    };
    const clockWiseArc = {
      x: 10,
      y: 10,
      radius: 5
    };
    const circle = {
      x: 30,
      y: 10,
      radius: 5
    };

    expect(calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle)).toEqual({
      ccToCircle: {
        start: { x: 35, y: 30 },
        end: { x: 35, y: 10 }
      },
      circleToCw: {
        start: { x: 30, y: 5 },
        end: { x: 10, y: 5 }
      },
    });
  });

  it('should work with bottom left corner', () => {
    const counterClockWiseArc = {
      x: 30,
      y: 10,
      radius: 5
    };
    const clockWiseArc = {
      x: 10,
      y: 30,
      radius: 5
    };
    const circle = {
      x: 10,
      y: 10,
      radius: 5
    };

    expect(calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle)).toEqual({
      ccToCircle: {
        start: { x: 30, y: 5 },
        end: { x: 10, y: 5 }
      },
      circleToCw: {
        start: { x: 5, y: 10 },
        end: { x: 5, y: 30 }
      },
    });
  });

  it('should work with top left corner', () => {
    const counterClockWiseArc = {
      x: 10,
      y: 10,
      radius: 5
    };
    const clockWiseArc = {
      x: 30,
      y: 30,
      radius: 5
    };
    const circle = {
      x: 10,
      y: 30,
      radius: 5
    };

    expect(calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle)).toEqual({
      ccToCircle: {
        start: { x: 5, y: 10 },
        end: { x: 5, y: 30 }
      },
      circleToCw: {
        start: { x: 10, y: 35 },
        end: { x: 30, y: 35 }
      },
    });
  });

  it('should work with right side', () => {
    const counterClockWiseArc = {
      x: 10,
      y: 30,
      radius: 5
    };
    const clockWiseArc = {
      x: 10,
      y: 10,
      radius: 5
    };
    const circle = {
      x: 20,
      y: 20,
      radius: 5
    };

    const result = calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle);
    console.log(result);
    expect(result).toBeDeepCloseTo({
      ccToCircle: {
        start: { x: 13, y: 33 },
        end: { x: 23, y: 23 }
      },
      circleToCw: {
        start: { x: 23, y: 16 },
        end: { x: 13, y: 6 }
      },
    }, 0);
  });

  it('should work with bottom side', () => {
    const counterClockWiseArc = {
      x: 30,
      y: 20,
      radius: 5
    };
    const clockWiseArc = {
      x: 10,
      y: 20,
      radius: 5
    };
    const circle = {
      x: 20,
      y: 10,
      radius: 5
    };

    const result = calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle);
    console.log(result);
    expect(result).toBeDeepCloseTo({
      ccToCircle: {
        start: { x: 33, y: 16 },
        end: { x: 23, y: 6 }
      },
      circleToCw: {
        start: { x: 16, y: 6 },
        end: { x: 6, y: 16 }
      },
    }, 0);
  });

  it('should work with left side', () => {
    const counterClockWiseArc = {
      x: 20,
      y: 10,
      radius: 5
    };
    const clockWiseArc = {
      x: 20,
      y: 30,
      radius: 5
    };
    const circle = {
      x: 10,
      y: 20,
      radius: 5
    };

    const result = calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle);
    console.log(result);
    expect(result).toBeDeepCloseTo({
      ccToCircle: {
        start: { x: 16, y: 6 },
        end: { x: 6, y: 16 }
      },
      circleToCw: {
        start: { x: 6, y: 23 },
        end: { x: 16, y: 33 }
      },
    }, 0);
  });

  it('should work with top side', () => {
    const counterClockWiseArc = {
      x: 10,
      y: 10,
      radius: 5
    };
    const clockWiseArc = {
      x: 30,
      y: 10,
      radius: 5
    };
    const circle = {
      x: 20,
      y: 20,
      radius: 5
    };

    const result = calculateTangentsToCorrectArcs(counterClockWiseArc, clockWiseArc, circle);
    console.log(result);
    expect(result).toBeDeepCloseTo({
      ccToCircle: {
        start: { x: 6, y: 13 },
        end: { x: 16, y: 23 }
      },
      circleToCw: {
        start: { x: 23, y: 23 },
        end: { x: 33, y: 13 }
      },
    }, 0);
  });
});
