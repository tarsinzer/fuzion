import { Kind } from './common';
import type { Map, MapFn } from './map/map';
import type { Filter } from './filter/filter';
import type { ForEach } from './forEach/forEach';
import type { Take } from './take/take';

/**
 * Typing https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/pipe.ts
 * Reduce
 * First
 * Has
 * Find
 */
export function fuzion<T>(
  input: T[],
  ...operators: (Map<any, any> | Filter<any> | ForEach<any> | Take)[]
): T[] {
  if (input.length === 0 || operators.length === 0) {
    return input;
  }

  const output: T[] = [];
  let length = input.length;

  operators = operators.filter(operator => {
    if (operator.kind === Kind.TAKE) {
      length = Math.min(length, operator.run());
      return false;
    }

    return true;
  });

  for (let index = 0; index < length; index += 1) {
    let currentValue = input[index];
    let shouldSkip = false;

    for (const operator of operators) {
      const value = operator.run(currentValue, index);

      if (operator.kind === Kind.MAP) {
        currentValue = value;
      } else if (operator.kind === Kind.FILTER && !value) {
        // no need to run any handler next, it's abandoned value now
        shouldSkip = true;
        break;
      }
    }

    if (shouldSkip) {
      shouldSkip = false;
      continue;
    }

    output.push(currentValue);
  }

  return output;
}

/**
 * 1. inner type
 * 2. result type ?
 * 3. map result type ?
 * 4. change intermediate type after operator run
 */
