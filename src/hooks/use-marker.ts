import { useCallback, useReducer } from 'react';

interface MarkItemAction<T> {
  type: 'MARK',
  item: T;
  color: string;
  text?: string;
}

interface UnmarkItemAction<T> {
  type: 'UNMARK',
  item: T;
  color: string;
}

interface ResetAction {
  type: 'RESET'
}

type MarkerActions<T> = MarkItemAction<T> | UnmarkItemAction<T> | ResetAction;

interface Marker {
  color: string;
  text?: string;
}

type MarkerMap<T> = Map<T, Marker[]>;

function markerReducer<T>(map: MarkerMap<T>, action: MarkerActions<T>): MarkerMap<T> {
  switch (action.type) {
    case 'MARK': {
      map = new Map(map);
      const markers = map.get(action.item) || [];
      const newMarker = {
        color: action.color,
        text: action.text
      };
      map.set(action.item, [newMarker, ...markers]);
      break;
    }
    case 'UNMARK': {
      map = new Map(map);
      const markers = (map.get(action.item) || []).slice();
      const index = markers.findIndex(({ color }) => color === action.color);
      markers.splice(index, 1);
      if (markers.length === 0) {
        map.delete(action.item);
      } else {
        map.set(action.item, markers);
      }
      break;
    }
    case 'RESET': {
      map = new Map();
      break;
    }
  }
  return map;
}

type MarkItemDispatch<T> = (item: T, color: string, text?: string) => void;
type UnmarkItemDispatch<T> = (item: T, color: string) => void;

interface MarkerDispatcher<T> {
  add: MarkItemDispatch<T>;
  remove: UnmarkItemDispatch<T>;
  reset: () => void;
  getColor: (item: T) => string | undefined;
  getText: (item: T) => string | undefined;
  isMarked: (item: T) => boolean;
}

export function useMarker<T>(): MarkerDispatcher<T> {
  const [map, dispatch] = useReducer<MarkerMap<T>, MarkerActions<T>>(markerReducer, new Map());

  const add: MarkItemDispatch<T> = useCallback((item, color, text) => dispatch({ type: 'MARK', item, color, text }), []);

  const remove: UnmarkItemDispatch<T> = useCallback((item, color) => dispatch({ type: 'UNMARK', item, color }), []);

  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const getColor = useCallback((item: T) => {
    const marker = (map.get(item) || [])[0];
    return marker && marker.color;
  }, [map]);

  const getText = useCallback((item: T) => {
    const marker = (map.get(item) || [])[0];
    return marker && marker.text;
  }, [map]);

  const isMarked = useCallback((item: T) => !!map.get(item), [map]);

  return { add, remove, reset, getColor, isMarked, getText };
}
