import Events from "event-lite";

export interface AnyStore<T> extends Events {
  addCleanup(callback: () => void): void;
  set(patcher: any, ts?: number): void;
  get(): T;
  destroy(): void;
  clone(): this;
}

type BasicDelta<Value> = {
  oldValue: Value;
  newValue: Value;
  ts: number;
};

// a reactive store
export class Store<Value = any, Delta = BasicDelta<Value>, SetParam = any> extends Events implements AnyStore<Value> {
  value: Value;
  delta?: Delta;
  ts: number = 0;
  _cleanup: Array<() => void> = [];
  constructor(value: Value) {
    super();
    this.value = value;
  }
  _assertTimestamp(ts: number) {
    if (ts < this.ts) {
      throw new Error("Cannot set a value in the past");
    }
  }
  _afterSet(ts: number, delta: Delta) {
    this.ts = ts;
    this.delta = delta;
    this.emit("change", delta);
  }
  set(value: SetParam, ts = Date.now()) {
    this._assertTimestamp(ts);
    const delta = this._set(value, ts);
    if (!delta) return;
    this._afterSet(ts, delta);
  }
  _set(value: any, ts: number): any {
    if (typeof value !== "object" && value === this.value) return;
    const delta = {oldValue: this.value, newValue: value, ts};
    this.value = value;
    return delta;
  }
  async setAsync(callbackOrPromise: Promise<SetParam> | ((value: Value) => Promise<SetParam>)) {
    const ts = Date.now();
    const promise = typeof callbackOrPromise === "function" ?
      callbackOrPromise(this.value) : callbackOrPromise;
    const value = await promise;
    this.set(value, ts);
  }
  get() {
    return this.value;
  }
  destroy() {
    while (this._cleanup.length) {
      this._cleanup.pop()();
    }
  }
  clone() {
    // @ts-ignore
    return new this.constructor;
  }
  addCleanup(cb: () => void) {
    this._cleanup.push(cb);
  }
}

type KeyGetter<T> = (item: T) => any;

type CollectionSetParam<T> = {
  added?: Array<T>;
  updated?: Array<T>;
  removed?: Array<T>;
};

type CollectionDelta<T> = {
  added: Array<T>;
  updated: Array<T>;
  removed: Array<T>;
  ts: number;
}

abstract class KeyedCollection<Item, Value> extends Store<Value, CollectionDelta<Value>, CollectionSetParam<Item>> {
  map: Map<any, Item>;
  key: KeyGetter<Item>;
  constructor({value, key}: {
    value: Value;
    key: KeyGetter<Item>;
  }) {
    super(value);
    this.map = new Map;
    this.key = key;
  }
  _set({added = [], updated = [], removed = []}: CollectionSetParam<Item>, ts: number) {
    if (!added.length && !removed.length && !updated.length) {
      return;
    }
    const delta: CollectionDelta<Item> = {
      added: [],
      removed: [],
      updated: [],
      ts
    };
    for (const item of added) {
      const key = this.key(item);
      if (this.map.has(key)) {
        throw new Error(`multiple items have the same key ${key}`);
      }
      this.map.set(key, item);
      this._addItem(item);
      delta.added.push(item);
    }
    for (const item of updated) {
      const key = this.key(item);
      if (!this.map.has(key)) continue;
      const oldItem = this.map.get(key);
      this._updateItem(oldItem, item);
      delta.updated.push(item);
    }
    for (const item of removed) {
      const key = this.key(item);
      if (!this.map.has(key)) continue;
      const oldItem = this.map.get(key);
      this.map.delete(key);
      this._removeItem(oldItem);
      delta.removed.push(oldItem);
    }
    return delta;
  }
  _updateItem(oldItem: Item, newItem: Item) {
    this._removeItem(oldItem);
    this._addItem(newItem);
  }
  abstract _addItem(item: Item): void;
  abstract _removeItem(item: Item): void;
  clone() {
    // @ts-ignore
    return new this.constructor({key: this.key});
  }
}

export class SetStore<T> extends KeyedCollection<T, Set<T>> {
  constructor({value = new Set, key}: {
    value?: Set<T>,
    key: KeyGetter<T>
  }) {
    super({value, key});
  }
  _addItem(item: T) {
    this.value.add(item);
  }
  _removeItem(item: T) {
    this.value.delete(item);
  }
}

type cmpFn<T> = (a: T, b: T) => number;

export class ArrayStore<Item> extends KeyedCollection<Item, Array<Item>> {
  cmp: cmpFn<Item>;
  _toRemove: Set<Item>;
  constructor({value = [], key, cmp}: {
    value?: Array<Item>;
    key: KeyGetter<Item>;
    cmp: cmpFn<Item>;
  }) {
    super({value, key});
    this.cmp = cmp;
    this._toRemove = new Set;
  }
  _set(input: CollectionSetParam<Item>, ts: number): CollectionDelta<Item> {
    this._toRemove.clear();
    const delta = super._set(input, ts);
    if (!delta) return;
    this.value = this.value.filter((i: Item) => !this._toRemove.has(i));
    return delta;
  }
  _addItem(item: Item) {
    binaryInsert(this.value, item, this.cmp);
  }
  _removeItem(item: Item) {
    this._toRemove.add(item);
  }
  clone() {
    // @ts-ignore
    return new this.constructor({key: this.key, cmp: this.cmp});
  }
}

type extractFn<Item, Element> = (item: Item) => Iterable<Element>;

export class Counter<Item, Element> extends KeyedCollection<Item, Map<Element, number>> {
  extract: extractFn<Item, Element>;
  _modified: Map<Element, number>;
  constructor({key, extract}: {
    key: KeyGetter<Item>;
    extract: extractFn<Item, Element>
  }) {
    super({value: new Map, key});
    this.extract = extract;
    this._modified = new Map;
  }
  _set(delta: any, ts: number) {
    this._modified.clear();
    super._set(delta, ts);
    return this._buildDelta(ts);
  }
  _addItem(item: Item) {
    this._count(item, 1);
  }
  _removeItem(item: Item) {
    this._count(item, -1);
  }
  _count(item: Item, dir: number) {
    // FIXME: should we cache extracted elements?
    // if elements are modified in-place i.e. oldItem === item,
    // we won't be able to extract them from oldItem
    for (const key of this.extract(item)) {
      const oldValue = this.value.get(key) || 0;
      if (!this._modified.has(key)) {
        this._modified.set(key, oldValue);
      }
      this.value.set(key, oldValue + dir);
    }
  }
  _buildDelta(ts: number) {
    const delta = {
      added: [],
      removed: [],
      updated: [],
      ts
    };
    for (const [key, oldN] of this._modified) {
      const n = this.value.get(key);
      if (oldN === n) {
        // this may happen when one element is moved from one item to another
      } else if (oldN === 0) {
        delta.added.push(key);
      } else if (n === 0) {
        delta.removed.push(key);
      } else {
        delta.updated.push(key);
      }
    }
    return (delta.added.length || delta.updated.length || delta.removed.length) && delta;
  }
}

function diff<Item>(mapA: Map<any, Item>, mapB: Map<any, Item>, updateFilter: {has(item: Item): boolean} = null) {
  const allKeys = new Set([...mapA.keys(), ...mapB.keys()]);
  const added = [];
  const updated = [];
  const removed = [];
  for (const key of allKeys) {
    const a = mapA.get(key);
    const b = mapB.get(key);
    if (a === undefined) {
      added.push(b);
    } else if (b === undefined) {
      removed.push(a);
    } else if (!updateFilter || updateFilter.has(key)) {
      updated.push(b);
    }
  }
  return [added, updated, removed];
}

function binaryInsert<Item>(arr: Array<Item>, item: Item, cmp: (a: Item, b: Item) => number) {
  const index = binarySearch(arr, item, cmp);
  arr.splice(index, 0, item);
}

function binarySearch<Item>(arr: Array<Item>, item: Item, cmp: (a: Item, b: Item) => number) {
  let low = 0;
  let high = arr.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    const c = cmp(arr[mid], item);
    if (c < 0) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }
  return low;
}

type Stores = AnyStore<any> | [AnyStore<any>, ...AnyStore<any>[]] | AnyStore<any>[];
type StoresValues<T> = T extends AnyStore<infer U> ? [U] :
  {[K in keyof T]: T[K] extends AnyStore<infer U> ? U : never};

// FIXME: what happened here? why do we need two declaration?
// https://github.com/sveltejs/svelte/blob/master/src/runtime/store/index.ts
export function derived<S extends Stores, Value>(stores: S, fn: (...values: StoresValues<S>) => Value): Store<Value>;
export function derived<Value>(stores: Stores, fn: (...values: any) => Value) {
  const storeArr = Array.isArray(stores) ? stores : [stores];
  const $s = new Store<Value>(get());
  const onChange = () => $s.set(get());
  for (const store of storeArr) {
    store.on("change", onChange);
    $s._cleanup.push(() => store.off("change", onChange));
  }
  return $s;

  function get() {
    return fn(...storeArr.map(s => s.get()));
  }
}

export function filter(stores: [], test) {
  if (!Array.isArray(stores)) {
    stores = [stores];
  }
  const [$c, ...$ss] = stores;
  const $s = $c.clone();
  // FIXME: dirty flag?
  $s.set(get());
  $c.on("change", onCollectionChange);
  $s._cleanup.push(() => $c.off("change", onCollectionChange));
  for (const store of $ss) {
    store.on("change", onStoreChange);
    $s._cleanup.push(() => store.off("change", onStoreChange));
  }
  return $s;

  function get(items = $c.get()) {
    const added = [];
    const removed = [];
    const params = $ss.map(s => s.get());
    for (const item of items) {
      const oldItem = $s.index.get($s.key(item));
      const shouldInclude = Boolean(test(item, ...params));
      if (oldItem && !shouldInclude) {
        removed.push(oldItem);
      } else if (!oldItem && shouldInclude) {
        added.push(item);
      }
    }
    return {added, removed};
  }

  function onCollectionChange({added, updated, removed, ts}) {
    const delta = {
      added: [],
      updated: [],
      removed: []
    };
    delta.added = added.filter(test);
    for (const item of updated) {
      const oldItem = $s.index.get($s.key(item));
      if (test(item)) {
        if (oldItem) {
          delta.updated.push(item);
        } else {
          delta.added.push(item);
        }
      } else if (oldItem) {
        delta.removed.push(oldItem);
      }
    }
    delta.removed.push(...removed.filter(i => $s.index.has($s.key(i))));
    $s.set(delta, ts);
  }

  function onStoreChange({oldValue, newValue, ts}) {
    if (typeof oldValue === "string" && typeof newValue === "string" && newValue.includes(oldValue)) {
      // a special case that we don't have to filter all items from parent
      $s.set(get($s.get()), ts);
      return;
    }
    // refilter items from parent store
    $s.set(get(), ts);
  }
}

export function slice($c, $start, $end) {
  const $s = $c.clone();
  $s.set(get());
  $c.on("change", onCollectionChange);
  $s._cleanup.push(() => $c.off("change", onCollectionChange));
  $start.on("change", onStoreChange);
  $s._cleanup.push(() => $start.off("change", onStoreChange));
  $end.on("change", onStoreChange);
  $s._cleanup.push(() => $end.off("change", onStoreChange));
  return $s;

  function get(updatedItems = []) {
    const oldValue = $s.get();
    const newValue = $c.get().slice($start.get(), $end.get())
    const [added, updated, removed] = diff(toMap(oldValue, $s.key), toMap(newValue, $s.key), toMap(updatedItems,
      $s.key));
    return {added, updated, removed};
  }

  function onCollectionChange({added, updated, removed, ts}) {
    if (!needRepage(added, updated, removed)) {
      return;
    }
    $s.set(get(updated), ts);
  }

  function onStoreChange({ts}) {
    $s.set(get(), ts);
  }

  function needRepage(added, updated, removed) {
    if (updated.length) return true;
    if (!$s.value.length) return true;
    const lastItem = $s.value[$s.value.length - 1];
    return [...added, ...removed].every(i => $s.cmp(i, lastItem) > 0);
  }
}

function toMap(arr, key) {
  return new Map(arr.map(i => [key(i), i]));
}

export function count($c, extract) {
  const $s = new Counter({key: $c.key, extract});
  $s.set(get());
  $c.on("change", onCollectionChange);
  $s._cleanup.push(() => $c.off("change", onCollectionChange));
  return $s;

  function get() {
    return {
      added: $c.get(),
    }
  }

  function onCollectionChange({added, removed, updated, ts}) {
    $s.set({added, removed, updated}, ts);
  }
}

