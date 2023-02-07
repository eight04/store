import Events from "event-lite";

/**
 * An interface represents a valid store.
 *
 * Basically, a store has to be able to set/get value and emit a "change" event when value changes.
 */
export interface AnyStore<Value> {
  /** Register an event listener. */
  on(event: string, ...args: any[]): void;
  /** Remove an event listener. */
  off(event: string, ...args: any[]): void;
  /** Set a new value. */
  set(patcher: any, ts?: number): void;
  /** Get the value */
  get(): Value;
  /** Register a cleanup function. */
  addCleanup(callback: () => void): void;
  /** Cleanup listeners attached to parent stores. */
  destroy(): void;
  /** Clone the store. */
  clone(): this;
}

/**
 * An interface representing any delta event.
 */
export interface AnyDelta {
  /**
   * The timestamp of the change event.
   */
  ts: number;
}

/**
 * The basic delta for primitive stores.
 */
export type BasicDelta<Value> = AnyDelta & {
  /** The old value. */
  oldValue: Value;
  /** The new value. */
  newValue: Value;
};

/**
 * The base class of reactive store.
 */
export class Store<Value, Delta = BasicDelta<Value>, SetParam = Value> extends Events implements AnyStore<Value> {
  value: Value;
  delta?: Delta;
  ts: number;
  _cleanup: Array<() => void>;
  /**
   * @param value - The initial value of the store.
   */
  constructor(value: Value) {
    super();
    this.value = value;
    this.delta = undefined;
    this.ts = 0;
    this._cleanup = [];
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
  /**
   * Update the store
   *
   * @param patcher - For primitive store, this is the new value. For collection store, you have to specify added, updated, and removed items.
   * @param ts - The timestamp.
   */
  set(patcher: SetParam, ts = Date.now()) {
    this._assertTimestamp(ts);
    const delta = this._set(patcher, ts);
    if (!delta) return;
    this._afterSet(ts, delta);
  }
  _set(value: any, ts: number): any {
    if (typeof value !== "object" && value === this.value) return;
    const delta = {oldValue: this.value, newValue: value, ts};
    this.value = value;
    return delta;
  }
  /**
   * Set with an async function. You may want to use this function to update store with an older `ts`.
   */
  async setAsync(callbackOrPromise: Promise<SetParam> | ((value: Value) => Promise<SetParam>)) {
    const ts = Date.now();
    const promise = typeof callbackOrPromise === "function" ?
      callbackOrPromise(this.value) : callbackOrPromise;
    const value = await promise;
    this.set(value, ts);
  }
  /**
   * Get the value.
   */
  get() {
    return this.value;
  }
  /**
   * Get the latest delta.
   */
  getDelta() {
    return this.delta;
  }
  /**
   * Destroy the store.
   *
   * This function removes event listeners attached to parent stores.
   */
  destroy() {
    while (this._cleanup.length) {
      this._cleanup.pop()!();
    }
  }
  /** @internal */
  _args(): any[] {
    return [this.value];
  }
  /**
   * Clone the store.
   */
  clone() {
    // FIXME: hmmmmmmmmmmmmmmmm
    // https://github.com/microsoft/TypeScript/issues/3841#issuecomment-1196418802
    return new (this.constructor as new () => this)(...this._args() as []);
  }
  /**
   * Add a cleanup function which will be called when the store is destroyed.
   */
  addCleanup(cb: () => void) {
    this._cleanup.push(cb);
  }
}

/**
 * Returns the key of the item.
 */
export type KeyGetter<T> = (item: T) => any;

/**
 * Add, update, and remove items in a collection.
 */
export type CollectionSetParam<Item> = {
  /** Add items. */
  added?: Array<Item>;
  /** Update items. */
  updated?: Array<Item>;
  /** Remove items. */
  removed?: Array<Item>;
};

/**
 * Delta for collection store.
 */
export type CollectionDelta<Item> = {
  /** Added items. */
  added: Array<Item>;
  /** Updated items. */
  updated: Array<Item>;
  /** Removed items. */
  removed: Array<Item>;
  /** Timestamp. */
  ts: number;
}

/**
 * An abstracted base class for any keyed-collection.
 */
export abstract class KeyedCollection<Item, Value, Delta extends CollectionDelta<any> = CollectionDelta<Item>>
    extends Store<Value, Delta, CollectionSetParam<Item>> {
  /**
   * A key-item map.
   */
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
  abstract _set(value: CollectionSetParam<Item>, ts: number): Delta | void;
  _updateItem(oldItem: Item, newItem: Item) {
    this._removeItem(oldItem);
    this._addItem(newItem);
  }
  abstract _addItem(item: Item): void;
  abstract _removeItem(item: Item): void;
}

/**
 * A store representing a set of items.
 */
export class SetStore<T> extends KeyedCollection<T, Set<T>> {
  /**
   * @param key - A callback function that returns the key of the item.
   */
  constructor(key: KeyGetter<T>) {
    super({value: new Set, key});
  }
  _set({added = [], updated = [], removed = []}: CollectionSetParam<T>, ts: number) {
    if (!added.length && !removed.length && !updated.length) {
      return;
    }
    const delta: CollectionDelta<T> = {
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
      const oldItem = this.map.get(key)!;
      this._updateItem(oldItem, item);
      this.map.set(key, item);
      delta.updated.push(item);
    }
    for (const item of removed) {
      const key = this.key(item);
      if (!this.map.has(key)) continue;
      const oldItem = this.map.get(key)!;
      this.map.delete(key);
      this._removeItem(oldItem);
      delta.removed.push(oldItem);
    }
    return delta;
  }
  _addItem(item: T) {
    this.value.add(item);
  }
  _removeItem(item: T) {
    this.value.delete(item);
  }
  _args() {
    return [this.key];
  }
}

/**
 * Compare two items. Returns negative if a < b, returns positive if a > b, returns zero otherwise.
 */
export type CmpFn<Item> = (a: Item, b: Item) => number;

/**
 * A store representing a array a.k.a sorted list of items.
 *
 * Items are sorted ascending.
 */
export class ArrayStore<Item> extends KeyedCollection<Item, Array<Item>> {
  cmp: CmpFn<Item>;
  _toRemove: Set<Item>;
  /**
   * @param key - A callback function that returns the key of the item.
   * @param cmp - Compare two items and return a number. If the number is negative, the first item is smaller than the second item. If the number is positive, the first item is larger than the second item. If the number is zero, the two items are equal.
   */
  constructor(key: KeyGetter<Item>, cmp: CmpFn<Item>) {
    super({value: [], key});
    this.cmp = cmp;
    this._toRemove = new Set;
  }
  _set(input: CollectionSetParam<Item>, ts: number) {
    this._toRemove.clear();
    const delta = SetStore.prototype._set.call(this, input, ts);
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
  _args() {
    return [this.key, this.cmp];
  }
}

/**
 * Extract elements from an item.
 */
export type ExtractFn<Item, Element> = (item: Item) => Iterable<Element>;

/**
 * A store that counts elements in a collection.
 *
 * The value is an element-number map.
 *
 * The delta contains elements instead of items.
 *
 * @example
 * To count tags of a set of articles:
 * ```js
 * const $c = new Counter(i => i.id, i => i.tags);
 * $c.set({
 *  added: [
 *    {id: 1, tags: ["foo", "bar"]},
 *    {id: 2, tags: ["bar", "baz"]}
 *    {id: 3, tags: ["foo"]}
 *  ]
 * });
 * $c.get() // Map { "foo" -> 2, "bar" -> 2, "baz" -> 1 }
 * $c.getDelta() // { added: ["foo", "bar", "baz"], updated: [], removed: [], ts: ... }
 * ```
 */
export class Counter<Item, Element> extends KeyedCollection<Item, Map<Element, number>, CollectionDelta<Element>> {
  extract: ExtractFn<Item, Element>;
  _modified: Map<Element, number>;
  /**
   * @param key - Returns the key of the item.
   * @param extract - Returns a list of elements in an item.
   */
  constructor(key: KeyGetter<Item>, extract: ExtractFn<Item, Element>) {
    super({value: new Map, key});
    this.extract = extract;
    this._modified = new Map;
  }
  _set(delta: CollectionSetParam<Item>, ts: number) {
    this._modified.clear();
    SetStore.prototype._set.call(this, delta, ts);
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
      if (oldValue + dir <= 0) {
        this.value.delete(key);
      } else {
        this.value.set(key, oldValue + dir);
      }
    }
  }
  _buildDelta(ts: number) {
    const delta: CollectionDelta<Element> = {
      added: [],
      removed: [],
      updated: [],
      ts
    };
    for (const [key, oldN] of this._modified) {
      const n = this.value.get(key);
      if (oldN === n) {
        // this may happen when one element is moved from one item to another
      } else if (!oldN) {
        delta.added.push(key);
      } else if (!n) {
        delta.removed.push(key);
      } else {
        delta.updated.push(key);
      }
    }
    return (delta.added.length || delta.updated.length || delta.removed.length) ? delta : undefined;
  }
  _args() {
    return [this.key, this.extract];
  }
}

function diff<Item>(mapA: Map<any, Item>, mapB: Map<any, Item>, updateFilter?: {has(item: Item): boolean}) {
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

/** One or multiple parent stores. */
export type Stores = AnyStore<any> | [AnyStore<any>, ...AnyStore<any>[]] | AnyStore<any>[];
/** Values of parent stores. */
export type StoresValues<T> = T extends AnyStore<infer U> ? [U] :
  {[K in keyof T]: T[K] extends AnyStore<infer U> ? U : never};

/**
 * Combine multiple stores into a new store.
 *
 * @param stores - A store, or a list of stores to combine.
 * @param fn - A callback that receives stores values and return the new value of derived store.
 */
export function derived<S extends Stores, Value>(stores: S, fn: (...values: StoresValues<S>) => Value): Store<Value>;
export function derived<Value>(stores: Stores, fn: (...values: any) => Value) {
  const storeArr = Array.isArray(stores) ? stores : [stores];
  const $s = new Store<Value>(get());
  const onChange = ({ts}: AnyDelta) => $s.set(get(), ts);
  for (const store of storeArr) {
    store.on("change", onChange);
    $s.addCleanup(() => store.off("change", onChange));
  }
  return $s;

  function get() {
    return fn(...storeArr.map(s => s.get()));
  }
}

export type ItemFromCollection<T> = T extends KeyedCollection<infer U, any> ? U : never;
export type FilterFn = (item: any, ...args: any) => boolean;
export type DeltaFromCollection<T> = T extends KeyedCollection<any, any, infer U> ? U : never;

/**
 * Create a new store that filters items in a collection.
 *
 * @param $c - A collection store.
 * @param $ss - A store, or a list of stores whose values can be used as filter parameters.
 * @param test - A callback function that returns a boolean to filter the item.
 */
export function filter<C extends KeyedCollection<any, any>, S extends Stores>(
  $c: C, $ss: S, test: (item: ItemFromCollection<C>, ...values: StoresValues<S>) => boolean): C;
export function filter<C extends KeyedCollection<any, any>>(
  $c: C, test: (item: ItemFromCollection<C>) => boolean): C;
export function filter($c: KeyedCollection<any, any>, storesOrFn: Stores | FilterFn, fn?: FilterFn) {
  const $ss = Array.isArray(storesOrFn) ? storesOrFn :
    typeof storesOrFn === "function" ? [] :
    [storesOrFn];
  const test = typeof storesOrFn === "function" ? storesOrFn : fn!;
  const $s = $c.clone();
  $s.set(get(), $c.ts);
  $c.on("change", onCollectionChange);
  $s.addCleanup(() => $c.off("change", onCollectionChange));
  for (const store of $ss) {
    store.on("change", onStoreChange);
    $s.addCleanup(() => store.off("change", onStoreChange));
  }
  return $s;

  function get(items = $c.get()) {
    const added = [];
    const removed = [];
    const params = $ss.map(s => s.get());
    for (const item of items) {
      const oldItem = $s.map.get($s.key(item));
      const shouldInclude = Boolean(test(item, ...params));
      if (oldItem && !shouldInclude) {
        removed.push(oldItem);
      } else if (!oldItem && shouldInclude) {
        added.push(item);
      }
    }
    return {added, removed};
  }

  function onCollectionChange({added, updated, removed, ts}: DeltaFromCollection<typeof $c>) {
    const filteredAdded = [];
    const filteredRemoved = [];
    const filteredUpdated = [];

    const params = $ss.map(s => s.get());
    filteredAdded.push(...added.filter(item => test(item, ...params)));
    for (const item of updated) {
      const oldItem = $s.map.get($s.key(item));
      if (test(item, ...params)) {
        if (oldItem) {
          filteredUpdated.push(item);
        } else {
          filteredAdded.push(item);
        }
      } else if (oldItem) {
        filteredRemoved.push(oldItem);
      }
    }
    filteredRemoved.push(...removed.filter((i: ItemFromCollection<typeof $c>) => $s.map.has($s.key(i))));

    $s.set({
      added: filteredAdded,
      updated: filteredUpdated,
      removed: filteredRemoved,
    }, ts);
  }

  function onStoreChange({oldValue, newValue, ts}: BasicDelta<any>) {
    if (typeof oldValue === "string" && typeof newValue === "string" && newValue.includes(oldValue)) {
      // a special case that we don't have to filter all items from parent
      $s.set(get($s.get()), ts);
      return;
    }
    // refilter items from parent store
    $s.set(get(), ts);
  }
}

/**
 * Create a new array store representing a slice of the original array store.
 *
 * @param $c - An array store.
 * @param $start - A number store representing the start index.
 * @param $end - A number store representing the end index.
 */
export function slice($c: ArrayStore<any>, $start: AnyStore<number>, $end: AnyStore<number>): typeof $c {
  const $s = $c.clone();
  $s.set(get(), $c.ts);
  $c.on("change", onCollectionChange);
  $s.addCleanup(() => $c.off("change", onCollectionChange));
  $start.on("change", onStoreChange);
  $s.addCleanup(() => $start.off("change", onStoreChange));
  $end.on("change", onStoreChange);
  $s.addCleanup(() => $end.off("change", onStoreChange));
  return $s;

  function get(updatedItems: ItemFromCollection<typeof $c>[] = []) {
    const oldValue = $s.get();
    const newValue = $c.get().slice($start.get(), $end.get());
    const [added, updated, removed] = diff(toMap(oldValue, $s.key), toMap(newValue, $s.key), toMap(updatedItems,
      $s.key));
    return {added, updated, removed};
  }

  function onCollectionChange({added, updated, removed, ts}: DeltaFromCollection<typeof $c>) {
    if (!needRepage(added, updated, removed)) {
      return;
    }
    $s.set(get(updated), ts);
  }

  function onStoreChange({ts}: AnyDelta) {
    $s.set(get(), ts);
  }

  function needRepage(added: ItemFromCollection<typeof $c>, updated: ItemFromCollection<typeof $c>, removed: ItemFromCollection<typeof $c>) {
    if (updated.length) return true;
    if (!$s.value.length) return true;
    const lastItem = $s.value[$s.value.length - 1];
    return [...added, ...removed].some(i => $s.cmp(i, lastItem) <= 0);
  }
}

function toMap(arr: Array<any>, keyFn: (item: any) => any) {
  return new Map(arr.map(i => [keyFn(i), i]));
}

/**
 * Create a new store that counts elements from a collection.
 *
 * @param $c - A collection store.
 * @param extract - A callback function that returns some elements to count.
 */
export function count<Element>($c: KeyedCollection<any, any>, extract: (item: ItemFromCollection<typeof $c>) => Iterable<Element>) {
  const $s = new Counter($c.key, extract);
  $s.set(get(), $c.ts);
  $c.on("change", onCollectionChange);
  $s.addCleanup(() => $c.off("change", onCollectionChange));
  return $s;

  function get() {
    return {
      added: $c.get(),
    };
  }

  function onCollectionChange({added, removed, updated, ts}: DeltaFromCollection<typeof $c>) {
    $s.set({added, removed, updated}, ts);
  }
}

// TODO: sort?
// export function sort($c: KeyedCollection, $cmp: AnyStore): ArrayStore
