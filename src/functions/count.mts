import {CollectionStore, SetStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {CollectionDelta} from "../store.mjs";
import type {StoreDelta} from "./util.mjs";

export function count<T, E>($c: CollectionStore<T>, extract: (item: T) => Iterable<E>) {
  const $s = new SetStore<readonly [E, number]>({key: ([e]) => e});
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
    const added = new Map<E, number>();
    const removed = new Map<E, number>();
    for (const item of delta.added || []) {
      for (const e of extract(item)) {
        added.set(e, (added.get(e) ?? 0) + 1);
      }
    }
    for (const item of delta.removed || []) {
      for (const e of extract(item)) {
        removed.set(e, (removed.get(e) ?? 0) + 1);
      }
    }
    return {
      added: [...added].map(([e, n]) => [e, n] as const),
      removed: [...removed].map(([e, n]) => [e, n] as const)
    };
  }

  }
}

