import {pipe} from "./util.mjs";
import {ValueStore} from "../store.mjs";

import type {Store} from "../store.mjs";
import type {StoresValues} from "./util.mjs";

export function derived<T, S extends Store[]>(stores: S, fn: (...args: StoresValues<S>) => T) {
  // FIXME: is typescript be able to infer tuple type after Array.prototype.map?
  // https://www.typescriptlang.org/play?#code/GYVwdgxgLglg9mABFApgZygHgGJzolAD1TABM1EBDMATwG0BdAPgApg8AuRXOASi56IA3gChE4xACcUUEJKTs4AOgC2lAA5tEAXiaJgvANwiAviKA
  const getValue = () => fn(...stores.map(s => s.get()) as StoresValues<S>);
  const $s = new ValueStore({value: getValue()});
  pipe({
    sources: stores,
    target: $s,
    onChange: (delta) => ({
      newValue: getValue(),
      ts: delta.ts
    })
  });
  return $s;
}


