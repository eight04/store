import Events from "event-lite";
export declare class Store extends Events {
    constructor(value?: any);
    _assertTimestamp(ts: any): void;
    _afterSet(ts: any, delta: any): void;
    set(value: any, ts: number, meta: any): void;
    _set(value: any, ts: any): {
        oldValue: any;
        newValue: any;
        ts: any;
    };
    setAsync(callbackOrPromise: any): Promise<void>;
    get(): any;
    destroy(): void;
    clone(): any;
}
export declare class SetStore extends Store {
    constructor({ value, key }?: {
        value?: Set<unknown>;
        key?: (i: any) => any;
    });
    _set({ added, updated, removed }: {
        added?: any[];
        updated?: any[];
        removed?: any[];
    }, ts: any): {
        added: any[];
        removed: any[];
        updated: any[];
        ts: any;
    };
    _addItem(item: any): void;
    _updateItem(oldItem: any, newItem: any): void;
    _removeItem(item: any): void;
    clone(): any;
}
export declare class ArrayStore extends SetStore {
    constructor({ value, key, cmp }?: {
        value?: any[];
        key?: (i: any) => any;
        cmp?: (a: any, b: any) => number;
    });
    _set(delta: any, ts: any): any;
    _addItem(item: any): void;
    _removeItem(item: any): void;
    clone(): any;
}
export declare class Counter extends SetStore {
    constructor({ key, extract }: {
        key: any;
        extract: any;
    });
    _set(delta: any, ts: any): {
        added: any[];
        removed: any[];
        updated: any[];
        ts: any;
    };
    _addItem(item: any): void;
    _removeItem(item: any): void;
    _count(item: any, dir: any): void;
    _buildDelta(ts: any): {
        added: any[];
        removed: any[];
        updated: any[];
        ts: any;
    };
}
export declare function derived(stores: any, formatter: any): Store;
export declare function filter(stores: any, test: any): any;
export declare function slice($c: any, $start: any, $end: any): any;
export declare function count($c: any, extract: any): Counter;
