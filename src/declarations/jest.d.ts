declare namespace jest {
  interface Matchers<R> {
    toBeDeepCloseTo: (
      expected: number | number[] | object,
      decimals?: number
    ) => R;
    toMatchCloseTo: (
      expected: number | number[] | object,
      decimals?: number
    ) => R;
  }
}

declare module 'jest-matcher-deep-close-to';
