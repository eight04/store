/* eslint-env mocha */
import * as assert from "node:assert";
import {ArrayStore, Store, derived, slice} from "../index.mjs";

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

describe("slice", () => {
  it("basic", () => {
    const $a = new ArrayStore<Item>(i => i.id, cmp);
    const $start = new Store<number>(0);
    const $end = derived($start, s => s + 3);
    const $b = slice($a, $start, $end);
    assert.deepStrictEqual($b.get(), []);
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
      new Item(4, -20),
      new Item(3, -10),
      new Item(1, 1),
    ]);
    $start.set(2);

    assert.deepStrictEqual($b.get(), [
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30),
    ]);
    let change = 0;
    $b.on("change", () => change++);
    $a.set({added: [new Item(6, 35)]});
    assert.equal(change, 0);
    $a.set({added: [new Item(7, -35)]});
    assert.equal(change, 1);
  });
});
