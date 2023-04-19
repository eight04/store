import {CollectionStore, SetStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {CollectionDelta} from "../store.mjs";
import type {StoreDelta} from "./util.mjs";

export function count<T, E>($c: CollectionStore<T>, extract: (item: T) => Iterable<E>) {
  const $s = new SetStore<readonly [E, number]>({key: ([e]) => e});
  const cache: Map<ReturnType<typeof $c.key>, E[]> = new Map;
  pipe({
    sources: [$c],
    target: $s,
    onChange: countDelta
  });
  $s.set(countDelta({
    added: [...$c.get()]
  }));
  return $s;

  function countDelta(delta: StoreDelta<typeof $c>): CollectionDelta<readonly [E, number]> {
    const modified = new Map;
    for (const item of [...(delta.removed || []), ...(delta.updated || [])]) {
      const key = $c.key(item);
      const oldElements = cache.get(key)!;
      for (const el of oldElements) {
        modified.set(el, (modified.get(el) || 0) - 1);
      }
      cache.delete(key);
    }
    for (const item of [...(delta.updated || []), ...(delta.added || [])]) {
      const key = $c.key(item);
      const elements = [...extract(item)];
      for (const el of elements) {
        modified.set(el, (modified.get(el) || 0) + 1);
      }
      cache.set(key, elements);
    }
    return applyChange(modified, delta.ts!);
  }

  function applyChange(modified: Map<E, number>, ts: number) {
    const added = [];
    const removed = [];
    const updated = [];
    for (const [el, n] of modified) {
      if (!n) continue;
      const oldN = $s.map.has(el) ? $s.map.get(el)![1] : 0;
      if (oldN + n <= 0) {
        removed.push([el, oldN] as const);
      } else if (oldN > 0) {
        updated.push([el, oldN + n] as const);
      } else {
        added.push([el, n] as const);
      }
    }
    return {added, removed, updated, ts};
  }
}

