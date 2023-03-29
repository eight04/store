@eight04/store
===========

[![.github/workflows/build.yml](https://github.com/eight04/store/actions/workflows/build.yml/badge.svg)](https://github.com/eight04/store/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/eight04/store/badge.svg?branch=main)](https://coveralls.io/github/eight04/store?branch=main)

A reactive store library designed to work with large collection. Inspired by svelte/store.

When some items in the collection are changed, a delta event will be broadcasted, so derived stores can be updated accordingly.

Installation
------------

*npm*

```
npm install @eight04/store
```

Usage
-----

### Primitive store

```js
import {Store, derived} from "@eight04/store";

const $a = new Store(0);
const $b = derived($a, v => v * 2);
const $c = derived([$a, $b], (a, b) => a + b);
$c.get() // 0
$a.set(5)
$c.get() // 15
```

### Collection

```js
import {Store, ArrayStore, filter} from "@eight04/store";

const $a = new ArrayStore(i => i.name, (a, b) => a.createdDate - b.createdDate);
const $q = new Store("");
const $b = filter($a, $q, (i, q) => !q || i.name.includes(q));

$a.set({
  added: [
    {
      name: "apple",
      createdDate: 83247238
    },
    {
      name: "banana",
      createdDate: 12231247
    },
    {
      name: "orange",
      createdDate: 23085720
    }
  ] 
});
$c.get() // [{name: "banana", ...}, {name: "orange", ...}, {name: "apple", ...}]
$q.set("or");
$c.get() // [{name: "orange", ...}]
```

API
----

[docs/README.md](docs/README.md)

Changelog
---------

* 0.4.0 (Mar 30, 2023)

  - **Change: `filter` function has a different signature. Now you have to specify incremental query manually.**
  - Add: `reindex` function.

* 0.3.0 (Feb 10, 2023)

  - Change: `slice` now accepts a single `$range` store.

* 0.2.1 (Feb 9, 2023)

  - Fix: `map` error when key is changed.

* 0.2.0 (Feb 9, 2023)

  - Add: `map`, `sort`.
  - Drop `Counter`.

* 0.1.0 (Feb 7, 2023)

  - First release.
