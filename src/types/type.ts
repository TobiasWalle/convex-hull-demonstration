export interface Type<T, A extends any[]> extends Function { new (...args: A): T; }
