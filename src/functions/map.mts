import {CollectionStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {StoreDelta} from "./util.mjs";

// FIXME: what if a single T can be mapped to multiple E?
export function map<T, E, K>($c: CollectionStore<T>, key: (item: E) => K, fn: (oldItem: T) => E) {
  const $s = $c.clone() as unknown as CollectionStore<E>;
  $s.key = key;
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
    return {
      added: delta.added?.map(fn),
      updated: delta.updated?.map(fn),
      removed: delta.removed?.map(fn),
      ts: delta.ts
    };
  }
}

