import Events from "event-lite";

export type Delta = {
  ts: number;
};

export abstract class Store extends Events {
  _destroy: Function[] = [];
  ts: number = 0;
  set(delta: Partial<Delta>) {
    if (!delta.ts) {
      delta.ts = Date.now();
    }
    if (delta.ts < this.ts) {
      return;
    }
    if (!this._set(delta)) {
      return;
    }
    this.ts = delta.ts;
    this.emit("change", delta);
  }
  abstract _set(delta: Partial<Delta>): boolean;
  abstract get(): any;
  destroy() {
    while (this._destroy.length) {
      this._destroy.pop()!();
    }
  }
  clone() {
    // FIXME: hmmmmmmmmmmmmmmmm
    // https://github.com/microsoft/TypeScript/issues/3841#issuecomment-1196418802
    return new (this.constructor as new () => this)(...this._cloneArgs() as []);
  }
  _cloneArgs(): any[] {
    return [];
  }
}

export type ValueDelta<T> = Delta & {
  oldValue: T;
  newValue: T;
}
export type SetValueDelta<T> = Partial<ValueDelta<T>> & Pick<ValueDelta<T>, "newValue">;

export class ValueStore<T> extends Store {
  value: T;
  constructor({value}: {value: T}) {
    super();
    this.value = value;
  }
  set(delta: SetValueDelta<T>) {
    super.set(delta);
  }
  _set(delta: SetValueDelta<T>) {
    if (Object.is(delta.newValue, this.value) && (typeof delta.newValue !== "object" || delta.newValue == null)) {
      return false;
    }
    delta.oldValue = this.value;
    this.value = delta.newValue;
    return true;
  }
  get(): T {
    return this.value;
  }
  _cloneArgs() {
    return [{value: this.value}];
  }
}

export type CollectionDelta<T> = Delta & {
  added: T[];
  removed: T[];
  updated: T[];
}

export abstract class CollectionStore<T> extends Store {
  key: (item: T) => any;
  map: Map<any, T>;
  constructor({key}: {key: (item: T) => any}) {
    super();
    this.key = key;
    this.map = new Map;
  }
  abstract get(): Iterable<T>;
  set(delta: Partial<CollectionDelta<T>>) {
    super.set(delta);
  }
  _set(delta: Partial<CollectionDelta<T>>) {
    let dirty = false;
    if (delta.added) {
      for (const item of delta.added) {
        if (this.map.has(this.key(item))) {
          throw new Error(`Duplicate key: ${this.key(item)}`);
        }
        this.map.set(this.key(item), item);
        this._addItem(item);
        dirty = true;
      }
    }
    if (delta.updated) {
      for (const item of delta.updated) {
        const oldItem = this.map.get(this.key(item));
        if (!oldItem) {
          throw new Error(`Item not found: ${this.key(item)}`);
        }
        this.map.set(this.key(item), item);
        this._updateItem(oldItem, item);
        dirty = true;
      }
    }
    if (delta.removed) {
      for (const item of delta.removed) {
        if (!this.map.has(this.key(item))) {
          throw new Error(`Item not found: ${this.key(item)}`);
        }
        const oldItem = this.map.get(this.key(item))!;
        this.map.delete(this.key(item));
        this._removeItem(oldItem);
        dirty = true;
      }
    }
    return dirty;
  }
  abstract _addItem(item: T): void;
  abstract _removeItem(item: T): void;
  _updateItem(oldItem: T, newItem: T) {
    this._removeItem(oldItem);
    this._addItem(newItem);
  }
}

export class SetStore<T> extends CollectionStore<T> {
  value: Set<T>;
  constructor({key}: {key: (item: T) => any}) {
    super({key});
    this.value = new Set;
  }
  get() {
    return this.value;
  }
  _addItem(item: T) {
    this.value.add(item);
  }
  _removeItem(item: T) {
    this.value.delete(item);
  }
  _cloneArgs() {
    return [{key: this.key}];
  }
}

export class ArrayStore<T> extends CollectionStore<T> {
  value: T[];
  cmp: (a: T, b: T) => number;
  _toRemove: Set<T>;
  _toReplace: Map<any, T>;
  constructor({key, cmp}: {key: (item: T) => any, cmp: (a: T, b: T) => number}) {
    super({key});
    this.value = [];
    this.cmp = cmp;
    this._toRemove = new Set;
    this._toReplace = new Map;
  }
  get() {
    return this.value;
  }
  _set(delta: Partial<CollectionDelta<T>>) {
    const dirty = super._set(delta);
    if (dirty) {
      const newValue = [];
      for (let i = 0; i < this.value.length; i++) {
        const item = this.value[i];
        if (this._toReplace.has(item)) {
          newValue.push(this._toReplace.get(item)!);
        } else if (!this._toRemove.has(item)) {
          newValue.push(item);
        }
      }
      this._toRemove.clear();
      this._toReplace.clear();
      this.value = newValue;
    }
    return dirty;
  }
  _addItem(item: T) {
    binaryInsert(this.value, item, this.cmp);
  }
  _updateItem(oldItem: T, newItem: T) {
    if (oldItem !== newItem) {
      this._addItem(newItem);
      this._removeItem(oldItem);
      return;
    }
    const placehold = {} as T;
    this._toRemove.add(oldItem);
    this._toReplace.set(placehold, newItem);
    binaryInsert(this.value, placehold, this.cmp, newItem);
  }
  _removeItem(item: T) {
    this._toRemove.add(item);
  }
  _cloneArgs() {
    return [{key: this.key, cmp: this.cmp}];
  }
}

function binaryInsert<T>(arr: T[], item: T, cmp: (a: T, b: T) => number, cmpRef: T = item) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >>> 1;
    if (cmp(arr[mid], cmpRef) < 0) {
      lo = mid + 1;
    } else {
      hi = mid;
    }
  }
  arr.splice(lo, 0, item);
}
