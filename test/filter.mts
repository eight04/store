/* eslint-env mocha */
import * as assert from "node:assert/strict";
import {Store, SetStore, filter} from "../index.mjs";

class Item {
  id: number;
  value: number;
  constructor(id: any, value: any) {
    this.id = id;
    this.value = value;
  }
}

describe("filter", () => {
  it("basic", () => {
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
    $a.set({
      updated: [
        new Item(1, -10),
        new Item(3, 15),
      ]
    });
    assert.deepStrictEqual($b.get(), new Set([
      new Item(2, 10),
      new Item(3, 15),
      new Item(5, 30)
    ]));
  });

  it("with store params", () => {
    const $a = new SetStore<Item>(i => i.id);
    const $b = new Store(0);
    const $s = filter($a, $b, (i, b) => i.value > b);
    $a.set({
      added: [
        new Item(1, 1),
        new Item(2, 10),
        new Item(3, -10),
        new Item(4, -20),
        new Item(5, 30),
      ]
    });
    assert.deepStrictEqual($s.get(), new Set([
      new Item(1, 1),
      new Item(2, 10),
      new Item(5, 30)
    ]));
    $b.set(-30);
    assert.deepStrictEqual($s.get(), new Set([
      new Item(1, 1),
      new Item(2, 10),
      new Item(3, -10),
      new Item(4, -20),
      new Item(5, 30)
    ]));
  });

  it("incremental", () => {
    class Item {
      id: number;
      value: string;
      constructor(id: any, value: any) {
        this.id = id;
        this.value = value;
      }
    }
    const $a = new SetStore<Item>(i => i.id);
    const $b = new Store("");
    let n = 0;
    const $s = filter($a, $b, (i, b) => {
      n++;
      return !b || i.value.includes(b);
    });

    $a.set({
      added: [
        new Item(1, "foobar"),
        new Item(2, "foobas"),
        new Item(3, "foobaz"),
        new Item(4, "bazbak"),
        new Item(5, "boorak"),
      ]
    });
    assert.equal(n, 5);
    assert.equal($s.get().size, 5);

    n = 0;
    $b.set("foo");
    assert.equal(n, 5);
    assert.equal($s.get().size, 3);

    n = 0;
    $b.set("foob");
    assert.equal(n, 3);
    assert.equal($s.get().size, 3);

    n = 0;
    $b.set("foobk");
    assert.equal(n, 3);
    assert.equal($s.get().size, 0);
  });
});
