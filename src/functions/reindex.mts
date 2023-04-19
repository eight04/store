import {CollectionStore, SetStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {StoreDelta} from "./util.mjs";

export function reindex<T, E>($c: CollectionStore<T>, fn: (item: T) => E) {
  const $s = new SetStore<readonly [E, T[]]>({key: t => t[0]});
  const cache: Map<ReturnType<typeof $c.key>, E> = new Map;
  pipe({
    sources: [$c],
    target: $s,
    onChange: onChange
  });
  $s.set(onChange({
    added: [...$c.get()]
  }));
  return $s;

  function onChange(delta: StoreDelta<typeof $c>): StoreDelta<typeof $s> {
    const modified = new Map<E, T[]>();

    for (const item of [...delta.updated || [], ...delta.removed || []]) {
      // FIXME: updated items will be move to the last. is that intended?
      const key = $c.key(item);
      const index = cache.get(key)!;
      if (!modified.has(index)) {
        modified.set(index, $s.map.get(index)![1]);
      }
      modified.set(index, modified.get(index)!.filter(i => key !== $c.key(i)))
      cache.delete(key);
    }

    for (const item of [...delta.updated || [], ...delta.added || []]) {
      const index = fn(item);
      const key = $c.key(item);
      if (!modified.has(index)) {
        modified.set(index, $s.map.get(index)?.[1] || []);
      }
      modified.set(index, [...modified.get(index)!, item]);
      cache.set(key, index);
    }

    const toAdd = [];
    const toUpdate = [];
    const toRemove = [];

    for (const [index, value] of modified.entries()) {
      if (!$s.map.has(index)) {
        toAdd.push([index, value] as const);
      } else if (value.length) {
        toUpdate.push([index, value] as const);
      } else {
        toRemove.push($s.map.get(index)!);
      }
    }

    return {
      added: toAdd,
      updated: toUpdate,
      removed: toRemove,
      ts: delta.ts,
    };
  }
}

