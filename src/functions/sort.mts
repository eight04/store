import {CollectionStore, ArrayStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {StoreDelta} from "./util.mjs";

// FIXME: ability to use a reactive store for cmp?
export function sort<T>($c: CollectionStore<T>, cmp: (a: T, b: T) => number) {
  const $s = new ArrayStore<T>({
    key: $c.key,
    cmp
  });
  pipe({
    sources: [$c],
    target: $s,
    onChange
  });
  $s.set(onChange({
    added: [...$c.get()]
  }));
  return $s;

  function onChange(delta: StoreDelta<typeof $c>): StoreDelta<typeof $s> {
    return delta;
  }
}

