import { Kind } from '../common';

export type MapFn<TValue, TResult> = (value: TValue, index: number) => TResult;
export type Map<TValue, TResult> = {
  kind: Kind.MAP;
  run: MapFn<TValue, TResult>;
};

export function map<TValue, TResult>(
  fn: MapFn<TValue, TResult>
): Map<TValue, TResult> {
  return {
    kind: Kind.MAP,
    run: fn
  };
}

// const cb = map((x: number) => String(x));
// const res = cb.run(2, 0);
