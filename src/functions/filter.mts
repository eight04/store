import {pipe} from "./util.mjs";

import type {Store, CollectionStore} from "../store.mjs";
import type {StoresValues, StoreDelta, CollectionItem} from "./util.mjs";

export type FilterParam<T extends Store> = {
  store: T,
  incremental?: (delta: StoreDelta<T>) => boolean
};
export type FilterParamsStores<S extends FilterParam<Store>[]> = {
  [K in keyof S]: S[K] extends FilterParam<infer U> ? U : never
};

export function filter<C extends CollectionStore<any>, S extends FilterParam<Store>[], T = CollectionItem<C>>(
  $c: C,
  params: S,
  fn: (item: T, ...args: StoresValues<FilterParamsStores<S>>) => boolean
) {
  const $s = $c.clone();
  pipe({
    sources: [$c, ...params.map(p => p.store)],
    target: $s,
    onChange: (delta, i) => {
      if (i === 0) {
        return filteredDelta(delta as StoreDelta<C>);
      }
      const param = params[i - 1];
      if (param.incremental && param.incremental(delta)) {
        return refilter($s.get());
      }
      return refilter($c.get());
    }
  });
  // FIXME: why { added: T[] } cannot be assigned to StoreDelta<C>?
  $s.set(filteredDelta({
    added: [...$c.get()]
  } as StoreDelta<C>))
  return $s;

  function getParamsValues() {
    return params.map(p => p.store.get()) as StoresValues<FilterParamsStores<S>>;
  }

  function filteredDelta(delta: StoreDelta<C>) {
    const paramsValues = getParamsValues();
    if (delta.added) {
      delta.added = delta.added.filter(item => fn(item, ...paramsValues));
    }
    if (delta.updated) {
      delta.updated = delta.updated.filter(item => fn(item, ...paramsValues));
    }
    if (delta.removed) {
      delta.removed = delta.removed.filter(item => fn(item, ...paramsValues));
    }
    return delta;
  }

  function refilter(items: Iterable<T>) {
    const paramsValues = getParamsValues();
    const added = [];
    const removed = [];
    for (const item of items) {
      if (fn(item, ...paramsValues)) {
        if (!$s.map.has(item)) {
          added.push(item);
        }
      } else {
        if ($s.map.has(item)) {
          removed.push(item);
        }
      }
    }
    return {added, removed} as StoreDelta<C>;
  }
}


