import { isBetweenPolarPhis, isDegreeAngleBetween } from './geometry';

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
  });
});
