import { apply, pipe } from 'ramda';

export function pipeThru(start, fns) {
  return apply(pipe, fns)(start);
}

export function objOfKeys(ary, val) {
  let out = {};
  for (elt of ary) {
    out[elt] = val;
  }
  return out;
}

export function countTrue(predicateFn, ary) {
  return ary.reduce((acc, elt) => {
    predicateFn(elt) ? (acc+1) : acc,
    0
  });
}


export function union (set1, set2) {
  return new Set([...set1, ...set2]);
}
