import { apply, pipe } from 'ramda';

export function pipeThru(start, fns) {
  return apply(pipe, fns)(start);
}
