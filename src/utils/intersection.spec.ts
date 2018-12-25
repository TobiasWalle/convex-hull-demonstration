import { calculateIntersectionPointWithArc, calculateIntersectionPointWithLine } from './intersection';

describe('calculateIntersectionPointWithLine', () => {
  it('should work if they intersect', () => {
    expect(calculateIntersectionPointWithLine(
      { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
      { start: { x: 0, y: 1 }, end: { x: 3, y: 1 } },
    )).toEqual({ x: 1, y: 1 });
  });
  it('should work if they not intersect', () => {
    expect(calculateIntersectionPointWithLine(
      { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
      { start: { x: 3, y: 3 }, end: { x: 3, y: 3 } },
    )).toEqual(null);
    expect(calculateIntersectionPointWithLine(
      { start: { x: 0, y: 0 }, end: { x: 2, y: 2 } },
      { start: { x: 0, y: 1 }, end: { x: 0, y: 1 } },
    )).toEqual(null);
  });
});

describe('calculateIntersectionPointWithArc', () => {
  it('should work if they intersect', () => {
    expect(calculateIntersectionPointWithArc(
      { x: 2, y: 2, startAngle: 0, endAngle: 180, radius: 1 },
      { start: { x: 2, y: 0 }, end: { x: 2, y: 4 } }
    )).toEqual({ x: 2, y: 3 });
  });

  it('should work if they not intersect', () => {
    expect(calculateIntersectionPointWithArc(
      { x: 2, y: 2, startAngle: 270, endAngle: 90, radius: 1 },
      { start: { x: 5, y: 0 }, end: { x: 5, y: 4 } }
    )).toEqual(null);
  });
});
