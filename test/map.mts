/* eslint-env mocha */
import * as assert from "node:assert/strict";
import {SetStore, ArrayStore, map} from "../index.mjs";

class Item {
  id: number;
  value: number;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

describe("map", () => {
  it("set", () => {
    const $a = new SetStore<Item>(i => i.id);
    const $b = map<Item>(
      $a,
      i => i.id,
      i => new Item(i.id, i.value * 2)
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
    assert.deepStrictEqual($b.get(), new Set([
      new Item(1, 2),
      new Item(2, 20),
      new Item(3, -20),
      new Item(4, -40),
      new Item(5, 60),
    ]));
  });

  it("array", () => {
    const $a = new ArrayStore<Item>(i => i.id, (a, b) => a.value - b.value);
    const $b = map<Item>(
      $a,
      i => i.id,
      i => new Item(i.id, i.value * 2)
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
    assert.deepStrictEqual($b.get(), [
      new Item(4, -40),
      new Item(3, -20),
      new Item(1, 2),
      new Item(2, 20),
      new Item(5, 60),
    ]);
  });
});
