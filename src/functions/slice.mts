import {ArrayStore, ValueStore} from "../store.mjs";
import {pipe} from "./util.mjs";

import type {CollectionDelta} from "../store.mjs";
import type {StoreDelta} from "./util.mjs";

export function slice<T>($c: ArrayStore<T>, $range: ValueStore<[number, number]>) {
  const $s = $c.clone();
  pipe({
    sources: [$c, $range],
    target: $s,
    onChange: (delta, i) => {
      if (i === 0 && !needReslice(delta)) {
        return null;
      }
      return reslice(delta);
    }
  });
  $s.set(reslice({}));
  return $s;

  function needReslice(delta: Partial<CollectionDelta<T>>) {
    if (delta.updated && delta.updated.length) return true;
    const range = $range.get();
    if (!range) return true;
    const items = $s.get();
    const lastItem = items[range[1] - range[0] - 1];
    if (!lastItem) return true;
    if (delta.added) {
      if (delta.added.some(item => $s.cmp(item, lastItem) <= 0)) return true;
    }
    if (delta.removed) {
      if (delta.removed.some(item => $s.cmp(item, lastItem) <= 0)) return true;
    }
    return false;
  }

  function reslice(delta: StoreDelta<typeof $c> | StoreDelta<typeof $range>) {
    const range = $range.get();
    const slicedArr = range ? $c.get().slice(range[0], range[1]) : [];
    const keys = new Set(slicedArr.map(item => $c.key(item)));
    const added = [];
    const removed = [];
    const updated = [];
    for (const item of $s.get()) {
      if (!keys.has($s.key(item))) {
        removed.push(item);
      }
    }
    for (const item of slicedArr) {
      if (!$s.map.has($s.key(item))) {
        added.push(item);
      }
    }
    // FIXME: can we skip the `in` check?
    if ("updated" in delta && delta.updated) {
      for (const item of delta.updated) {
        if ($s.map.has($s.key(item)) && keys.has($s.key(item))) {
          updated.push(item);
        }
      }
    }
    return {added, removed, updated};
  }
}

