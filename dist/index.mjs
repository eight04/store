import Events from "event-lite";
// a reactive store
export class Store extends Events {
    constructor(value = undefined) {
        super();
        this.ts = 0;
        this.delta = null;
        this.value = value;
        this.dirty = false;
        this._cleanup = [];
    }
    _assertTimestamp(ts) {
        if (ts < this.ts) {
            throw new Error("Cannot set a value in the past");
        }
    }
    _afterSet(ts, delta) {
        this.ts = ts;
        this.dirty = true;
        this.delta = delta;
        this.emit("change", delta);
    }
    set(value, ts = Date.now(), meta) {
        this._assertTimestamp(ts);
        const delta = this._set(value, ts, meta);
        if (delta)
            return;
        this._afterSet(ts, delta);
    }
    _set(value, ts) {
        if (typeof value !== "object" && value === this.value)
            return;
        const delta = { oldValue: this.value, newValue: value, ts };
        this.value = value;
        return delta;
    }
    async setAsync(callbackOrPromise) {
        const ts = Date.now();
        const promise = callbackOrPromise.then ? callbackOrPromise : callbackOrPromise(this.value);
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
        return new this.constructor;
    }
}
export class SetStore extends Store {
    constructor({ value = new Set, key = i => i } = {}) {
        super(value);
        this.map = new Map;
        this.key = key;
        for (const item of this.value) {
            const key = this.key(item);
            if (this.map.has(key)) {
                throw new Error(`multiple items have the same key ${key}`);
            }
            this.map.set(key, item);
        }
    }
    _set({ added = [], updated = [], removed = [] }, ts) {
        if (!added.length && !removed.length && !updated.length) {
            return;
        }
        const delta = {
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
            if (!this.map.has(key))
                continue;
            const oldItem = this.map.get(key);
            this._updateItem(oldItem, item);
            delta.updated.push(item);
        }
        for (const item of removed) {
            const key = this.key(item);
            if (!this.map.has(key))
                continue;
            const oldItem = this.map.get(key);
            this.map.delete(key);
            this._removeItem(oldItem);
            delta.removed.push(oldItem);
        }
        return delta;
    }
    _addItem(item) {
        this.value.add(item);
    }
    _updateItem(oldItem, newItem) {
        this._removeItem(oldItem);
        this._addItem(newItem);
    }
    _removeItem(item) {
        this.value.delete(item);
    }
    clone() {
        return new this.constructor({ key: this.key });
    }
}
export class ArrayStore extends SetStore {
    constructor({ value = [], key = i => i, cmp = (a, b) => a - b } = {}) {
        super({ value, key });
        this.cmp = cmp;
        this._toRemove = new Set;
    }
    _set(delta, ts) {
        this._toRemove.clear();
        delta = super._set(delta, ts);
        if (!delta)
            return;
        this.value = this.value.filter(i => !this._toRemove.has(i));
        return delta;
    }
    _addItem(item) {
        binaryInsert(this.value, item, this.cmp);
    }
    _removeItem(item) {
        this._toRemove.add(item);
    }
    clone() {
        return new this.constructor({ key: this.key, cmp: this.cmp });
    }
}
export class Counter extends SetStore {
    constructor({ key, extract }) {
        super({ value: new Map, key });
        this.extract = extract;
        this.cache = new Map;
        this._modified = new Map;
    }
    _set(delta, ts) {
        this._modified.clear();
        super._set(delta, ts);
        return this._buildDelta(ts);
    }
    _addItem(item) {
        this._count(item, 1);
    }
    _removeItem(item) {
        this._count(item, -1);
    }
    _count(item, dir) {
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
    _buildDelta(ts) {
        const delta = {
            added: [],
            removed: [],
            updated: [],
            ts
        };
        for (const key of this._modified) {
            const oldN = this._modified.get(key);
            const n = this.value.get(key);
            if (oldN === n) {
                // this may happen when one element is moved from one item to another
            }
            else if (oldN === 0) {
                delta.added.push(key);
            }
            else if (n === 0) {
                delta.removed.push(key);
            }
            else {
                delta.updated.push(key);
            }
        }
        return (delta.added.length || delta.updated.length || delta.removed.length) && delta;
    }
}
function diff(mapA, mapB, updateFilter = null) {
    const allKeys = new Set([...mapA.keys(), ...mapB.keys()]);
    const added = [];
    const updated = [];
    const removed = [];
    for (const key of allKeys) {
        const a = mapA.get(key);
        const b = mapB.get(key);
        if (a === undefined) {
            added.push(b);
        }
        else if (b === undefined) {
            removed.push(a);
        }
        else if (!updateFilter || updateFilter.has(key)) {
            updated.push(b);
        }
    }
    return [added, updated, removed];
}
function binaryInsert(arr, item, cmp) {
    const index = binarySearch(arr, item, cmp);
    arr.splice(index, 0, item);
}
function binarySearch(arr, item, cmp) {
    let low = 0;
    let high = arr.length;
    while (low < high) {
        const mid = (low + high) >>> 1;
        const c = cmp(arr[mid], item);
        if (c < 0) {
            low = mid + 1;
        }
        else {
            high = mid;
        }
    }
    return low;
}
export function derived(stores, formatter) {
    if (!Array.isArray(stores)) {
        stores = [stores];
    }
    const $s = new Store(get());
    const onChange = () => $s.set(get());
    for (const store of stores) {
        store.on("change", onChange);
        $s._cleanup.push(() => store.off("change", onChange));
    }
    return $s;
    function get() {
        return formatter(...stores.map(s => s.get()));
    }
}
export function filter(stores, test) {
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
            }
            else if (!oldItem && shouldInclude) {
                added.push(item);
            }
        }
        return { added, removed };
    }
    function onCollectionChange({ added, updated, removed, ts }) {
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
                }
                else {
                    delta.added.push(item);
                }
            }
            else if (oldItem) {
                delta.removed.push(oldItem);
            }
        }
        delta.removed.push(...removed.filter(i => $s.index.has($s.key(i))));
        $s.set(delta, ts);
    }
    function onStoreChange({ oldValue, newValue, ts }) {
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
        const newValue = $c.get().slice($start.get(), $end.get());
        const [added, updated, removed] = diff(toMap(oldValue, $s.key), toMap(newValue, $s.key), toMap(updatedItems, $s.key));
        return { added, updated, removed };
    }
    function onCollectionChange({ added, updated, removed, ts }) {
        if (!needRepage(added, updated, removed)) {
            return;
        }
        $s.set(get(updated), ts);
    }
    function onStoreChange({ ts }) {
        $s.set(get(), ts);
    }
    function needRepage(added, updated, removed) {
        if (updated.length)
            return true;
        if (!$s.value.length)
            return true;
        const lastItem = $s.value[$s.value.length - 1];
        return [...added, ...removed].every(i => $s.cmp(i, lastItem) > 0);
    }
}
function toMap(arr, key) {
    return new Map(arr.map(i => [key(i), i]));
}
export function count($c, extract) {
    const $s = new Counter({ key: $c.key, extract });
    $s.set(get());
    $c.on("change", onCollectionChange);
    $s._cleanup.push(() => $c.off("change", onCollectionChange));
    return $s;
    function get() {
        return {
            added: $c.get(),
        };
    }
    function onCollectionChange({ added, removed, updated, ts }) {
        $s.set({ added, removed, updated }, ts);
    }
}
//# sourceMappingURL=index.mjs.map