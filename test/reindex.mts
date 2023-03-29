/* eslint-env mocha */
import * as assert from "node:assert";
import {ArrayStore, reindex} from "../index.mjs";

class Item {
  id: number;
  value: number;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

function cmp(a: Item, b: Item) {
  return a.value - b.value;
}

describe("reindex", () => {
  it("basic", () => {
    const $s = new ArrayStore<Item>(i => i.id, cmp);
    const added = [new Item(1, 2), new Item(2, 1)];
    $s.set({ added });
    const $r = reindex($s, i => i.value);
    assert.deepStrictEqual($r.get(), new Set([
      [1, [ new Item(2, 1)]],
      [2, [ new Item(1, 2)]]
    ]));

    $s.set({ removed: [new Item(1, 2)] });
    assert.deepStrictEqual($r.get(), new Set([
      [1, [ new Item(2, 1)]],
    ]));

    $s.set({ updated: [new Item(2, 3)] });
    assert.deepStrictEqual($r.get(), new Set([
      [3, [ new Item(2, 3)]],
    ]));
  });

  it("duplicated index", () => {
    const $s = new ArrayStore<Item>(i => i.id, cmp);
    const $r = reindex($s, i => i.value);
    const added = [new Item(1, 2), new Item(2, 1), new Item(3, 1)];
    $s.set({ added });
    assert.deepStrictEqual($r.get(), new Set([
      [1, [ new Item(2, 1), new Item(3, 1) ]],
      [2, [ new Item(1, 2)]]
    ]));
  });

  it("index doesn't match when removed", () => {
    const $s = new ArrayStore<Item>(i => i.id, cmp);
    const added = [new Item(1, 2), new Item(2, 1)];
    $s.set({ added });
    const $r = reindex($s, i => i.value);
    assert.deepStrictEqual($r.get(), new Set([
      [1, [ new Item(2, 1)]],
      [2, [ new Item(1, 2)]]
    ]));

    $s.set({ removed: [new Item(1, 3)] });
    assert.deepStrictEqual($r.get(), new Set([
      [1, [ new Item(2, 1)]],
    ]));
  })
});
