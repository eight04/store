/* eslint-env mocha */
import * as assert from "assert/strict";
import {SetStore, count} from "../index.mjs";

class Item {
  id: number;
  value: string;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

describe("count", () => {
  it("basic", () => {
    const $c = new SetStore<Item>(i => i.id);
    const $s = count($c, i => i.value);
    assert.deepEqual($s.get(), new Set());
    $c.set({added: [{id: 1, value: "a"}]});
    assert.deepEqual($s.get(), new Set([["a", 1]]));
    $c.set({added: [{id: 2, value: "baba"}]});
    assert.deepEqual($s.get(), new Set([["a", 3], ["b", 2]]));
    $c.set({added: [{id: 3, value: "baba"}], removed: [{id: 2, value: "baba"}]});
    assert.deepEqual($s.get(), new Set([["a", 3], ["b", 2]]));
    $c.set({removed: [{id: 3, value: "baba"}]});
    assert.deepEqual($s.get(), new Set([["a", 1]]));
  });
});
