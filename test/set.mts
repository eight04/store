/* eslint-env mocha */
import * as assert from "node:assert";
import {SetStore, derived, filter} from "../index.mjs";

class Item {
  id: number;
  value: number;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

describe("SetStore", () => {
  it("basic", () => {
    const $s = new SetStore<Item>(i => i.id);
    assert.equal($s.get().size, 0);
    const added = [new Item(1, 1), new Item(2, 2)];
    $s.set({ added });
    assert.equal($s.get().size, 2);
    assert.deepStrictEqual($s.get(), new Set(added));
    $s.set({ updated: [new Item(1, 2)] });
    assert.deepStrictEqual($s.get(), new Set([new Item(1, 2), new Item(2, 2)]));
    $s.set({ removed: [new Item(1, 0)] });
    assert.deepStrictEqual($s.get(), new Set([new Item(2, 2)]));
  });

  it("derived", () => {
    const $s = new SetStore<Item>(i => i.id);
    const $size = derived($s, s => s.size);
    assert.equal($size.get(), 0);
    $s.set({ added: [new Item(1, 1), new Item(2, 2)] });
    assert.equal($size.get(), 2);
  });

  it("filter", () => {
    const $a = new SetStore<Item>(i => i.id);
    const $b = filter($a, i => i.value > 0);
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
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30)
    ]));
  });
});
