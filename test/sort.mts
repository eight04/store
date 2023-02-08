/* eslint-env mocha */
import * as assert from "node:assert/strict";
import {SetStore, ArrayStore, sort} from "../index.mjs";

class Item {
  id: number;
  value: number;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

describe("sort", () => {
  it("set", () => {
    const $a = new SetStore<Item>(i => i.id);
    const $b = sort<Item>(
      $a,
      (a, b) => a.value - b.value,
    );
    $a.set({
      added: [
        new Item(1, 1),
        new Item(2, 10),
        new Item(3, -10),
        new Item(4, -20),
        new Item(5, 30),
      ]
    });
    assert.deepEqual($b.get(), [
      new Item(4, -20),
      new Item(3, -10),
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30),
    ]);
  });

  it("array", () => {
    const $a = new ArrayStore<Item>(i => i.id, (a, b) => a.value - b.value);
    const $b = sort(
      $a,
      (a, b) => b.value - a.value,
    );
    $a.set({
      added: [
        new Item(1, 1),
        new Item(2, 10),
        new Item(3, -10),
        new Item(4, -20),
        new Item(5, 30),
      ]
    });
    assert.deepEqual($b.get(), [
      new Item(5, 30),
      new Item(2, 10),
      new Item(1, 1),
      new Item(3, -10),
      new Item(4, -20),
    ]);
  });
});
