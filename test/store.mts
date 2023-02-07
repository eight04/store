/* eslint-env mocha */
import * as assert from "node:assert/strict";
import {Store, derived} from "../index.mjs";

describe("Store", () => {
  it("basic", async () => {
    const $s = new Store<number>(1);
    assert.equal($s.get(), 1);
    $s.set(2);
    assert.equal($s.get(), 2);
    const p = $s.setAsync(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return 3;
    });
    assert.equal($s.get(), 2);
    await p;
    assert.equal($s.get(), 3);
    const p2 = $s.setAsync(async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return 4;
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    $s.set(5);
    assert.equal($s.get(), 5);
    await assert.rejects(p2, /in the past/);
    assert.equal($s.get(), 5);
  });

  it("clone", () => {
    const $a = new Store<number>(1);
    const $b = $a.clone();
    assert.equal($b.get(), 1);
  });

  it("cleanup", () => {
    const $a = new Store<number>(1);
    const $b = derived($a, (a) => a + 1);
    assert.equal($b.get(), 2);
    $a.set(10);
    assert.equal($b.get(), 11);
    $b.destroy();
    $a.set(100);
    assert.equal($b.get(), 11);
  });
});
