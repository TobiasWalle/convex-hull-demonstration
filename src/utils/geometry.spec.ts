import { isBetweenPolarPhis, isDegreeAngleBetween, isDegreeAngleBetweenClockwise } from './geometry';

describe('isBetweenPolarPhi', () => {
  it('should work', () => {
    expect(isBetweenPolarPhis(2, 0, 1)).toBe(true);
    expect(isBetweenPolarPhis(0, 2, 1)).toBe(false);
  });

  it('should on limit', () => {
    expect(isBetweenPolarPhis(-3, 3, Math.PI)).toBe(true);
    expect(isBetweenPolarPhis(-3, Math.PI, -2)).toBe(false);
    expect(isBetweenPolarPhis(3, -2, -1)).toBe(true);
    expect(isBetweenPolarPhis(0.7, 2.3, 1.5)).toBe(false);
    expect(isBetweenPolarPhis(0.7, 2.3, -1.5)).toBe(true);
    expect(isBetweenPolarPhis(2.3, 0.7, 1.5)).toBe(true);
  });
});

describe('isDegreeAngleBetween', () => {
  it('should work', () => {
    expect(isDegreeAngleBetween(0, 360, 100)).toBe(true);
    expect(isDegreeAngleBetween(360, 0, 100)).toBe(false);
    expect(isDegreeAngleBetween(200, 90, 0)).toBe(true);
    expect(isDegreeAngleBetween(90, 200, 0)).toBe(false);
    expect(isDegreeAngleBetween(180, 0, 270)).toBe(true);
  });
});

describe('isDegreeAngleBetweenClockwise', () => {
  it('should work', () => {
    expect(isDegreeAngleBetweenClockwise(0, 360, 100)).toBe(false);
    expect(isDegreeAngleBetweenClockwise(360, 0, 100)).toBe(true);
    expect(isDegreeAngleBetweenClockwise(200, 90, 0)).toBe(false);
    expect(isDegreeAngleBetweenClockwise(90, 200, 0)).toBe(true);
    expect(isDegreeAngleBetweenClockwise(180, 0, 270)).toBe(false);
    expect(isDegreeAngleBetweenClockwise(90, 270, 315)).toBe(true);
    expect(isDegreeAngleBetweenClockwise(90, 270, 90)).toBe(true);
    expect(isDegreeAngleBetweenClockwise(90, 270, 270)).toBe(true);
  });
});
