import type { Store, CollectionStore } from "./store.mjs";

import {ValueStore, ArrayStore, SetStore} from "./store.mjs";

export type StoresValues<S extends Store[]> = {
  [K in keyof S]: S[K] extends Store ? ReturnType<S[K]["get"]> : never
};
export type StoreDelta<T extends Store> = T extends Store ? Parameters<T["set"]>[0] : never;
export type StoresDeltas<S extends Store[]> = {
  [K in keyof S]: S[K] extends Store ? StoreDelta<S[K]> : never
};
export type OneOf<T extends any[]> = T[number];

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

/**
 * Pipe one or more source stores into target store.
 */
export function pipe<S extends Store[], T extends Store>({
  sources,
  target,
  onChange
}: {
  sources: S;
  target: T;
  onChange: (delta: OneOf<StoresDeltas<S>>, index: number) => StoreDelta<T> | null;
}) {
  sources.forEach((source, index) => {
    const handleChange = (delta: OneOf<StoresDeltas<S>>) => {
      const newDelta = onChange(delta, index);
      if (newDelta) {
        target.set(newDelta);
      }
    };
    source.on("change", handleChange);
    target._destroy.push(() => source.off("change", handleChange));
  });
}

export type FilterParam<T extends Store> = {
  store: T,
  incremental?: (delta: StoreDelta<T>) => boolean
};
export type FilterParamsStores<S extends FilterParam<Store>[]> = {
  [K in keyof S]: S[K] extends FilterParam<infer U> ? U : never
};

export function filter<T, C extends CollectionStore<T>, S extends FilterParam<Store>[]>($c: C, params: S, fn: (item: T, ...args: StoresValues<FilterParamsStores<S>>) => boolean) {
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
  $s.set(filteredDelta({
    added: [...$c.get()]
  }))
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

export function slice<T>($c: ArrayStore<T>, $range: ValueStore<[number, number]>) {
  const $s = $c.clone();

}
