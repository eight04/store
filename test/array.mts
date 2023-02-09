/* eslint-env mocha */
import * as assert from "node:assert";
import {ArrayStore, Store, derived, filter} from "../index.mjs";

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

describe("ArrayStore", () => {
  it("basic", () => {
    const $s = new ArrayStore<Item>(i => i.id, cmp);
    assert.equal($s.get().length, 0);
    const added = [new Item(1, 2), new Item(2, 1)];
    $s.set({ added });
    assert.equal($s.get().length, 2);
    assert.deepStrictEqual($s.get(), added.slice().reverse());
  });

  it("derived", () => {
    const $s = new ArrayStore<Item>(i => i.id, cmp);
    const $size = derived($s, s => s.length);
    assert.equal($size.get(), 0);
    $s.set({ added: [new Item(1, 1), new Item(2, 2)] });
    assert.equal($size.get(), 2);
  });

  it("filter", () => {
    const $a = new ArrayStore<Item>(i => i.id, cmp);
    const $b = filter($a, i => i.value > 0);
    $a.set({
      added: [
        new Item(1, 1),
        new Item(5, 30),
        new Item(3, -10),
        new Item(4, -20),
        new Item(2, 10),
      ]
    });
    assert.deepStrictEqual($b.get(), [
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30)
    ]);
  });

  it("filter with store", () => {
    const $a = new ArrayStore<Item>(i => i.id, cmp);
    const $b = new Store<number>(0);
    const $c = filter($a, $b, (i, b) => i.value > b);
    $a.set({
      added: [
        new Item(1, 1),
        new Item(5, 30),
        new Item(3, -10),
        new Item(4, -20),
        new Item(2, 10),
      ]
    });
    assert.deepStrictEqual($c.get(), [
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30)
    ]);
    $b.set(20);
    assert.deepStrictEqual($c.get(), [
      new Item(5, 30)
    ]);
  });
});
