import { GiftWrapping } from './gift-wrapping';

describe('GiftWrapping', () => {
  it('should calculate convex hull', () => {
    const points = [
      { x: 1, y: 1 },
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 2 },
      { x: 2, y: 2 },
    ];

    expect(
      new GiftWrapping().calculateConvexHull(points)
    ).toEqual({
      points: [
        { x: 0, y: 0 },
        { x: 2, y: 0 },
        { x: 2, y: 2 },
        { x: 0, y: 2 },
      ]
    })
  });
});
