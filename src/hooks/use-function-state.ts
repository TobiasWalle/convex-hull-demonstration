import { useCallback, useState } from 'react';

export function useFunctionState<F extends Function>(initialValue: F): [F, (newFn: F) => void] {
  const [state, setState] = useState({ fn: initialValue });

  return [
    state.fn,
    useCallback(
      (newFn: F) => setState({ fn: newFn }),
      [setState]
    )
  ]
}
