[@eight04/store](../README.md) / Counter

# Class: Counter<Item, Element\>

A store that counts elements in a collection.

The value is an element-number map.

The delta contains elements instead of items.

**`Example`**

To count tags of a set of articles:
```js
const $c = new Counter(i => i.id, i => i.tags);
$c.set({
 added: [
   {id: 1, tags: ["foo", "bar"]},
   {id: 2, tags: ["bar", "baz"]}
   {id: 3, tags: ["foo"]}
 ]
});
$c.get() // Map { "foo" -> 2, "bar" -> 2, "baz" -> 1 }
$c.getDelta() // { added: ["foo", "bar", "baz"], updated: [], removed: [], ts: ... }
```

## Type parameters

| Name |
| :------ |
| `Item` |
| `Element` |

## Hierarchy

- [`KeyedCollection`](KeyedCollection.md)<`Item`, `Map`<`Element`, `number`\>, [`CollectionDelta`](../README.md#collectiondelta)<`Element`\>\>

  ↳ **`Counter`**

## Table of contents

### Constructors

- [constructor](Counter.md#constructor)

### Properties

- [map](Counter.md#map)

### Methods

- [addCleanup](Counter.md#addcleanup)
- [clone](Counter.md#clone)
- [destroy](Counter.md#destroy)
- [get](Counter.md#get)
- [getDelta](Counter.md#getdelta)
- [set](Counter.md#set)
- [setAsync](Counter.md#setasync)

## Constructors

### constructor

• **new Counter**<`Item`, `Element`\>(`key`, `extract`)

#### Type parameters

| Name |
| :------ |
| `Item` |
| `Element` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyGetter`](../README.md#keygetter)<`Item`\> | Returns the key of the item. |
| `extract` | [`ExtractFn`](../README.md#extractfn)<`Item`, `Element`\> | Returns a list of elements in an item. |

#### Overrides

KeyedCollection&lt;Item, Map&lt;Element, number\&gt;, CollectionDelta&lt;Element\&gt;\&gt;.constructor

#### Defined in

[index.mts:333](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L333)

## Properties

### map

• **map**: `Map`<`any`, `Item`\>

A key-item map.

#### Inherited from

[KeyedCollection](KeyedCollection.md).[map](KeyedCollection.md#map)

#### Defined in

[index.mts:182](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L182)

## Methods

### addCleanup

▸ **addCleanup**(`cb`): `void`

Add a cleanup function which will be called when the store is destroyed.

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | () => `void` |

#### Returns

`void`

#### Inherited from

[KeyedCollection](KeyedCollection.md).[addCleanup](KeyedCollection.md#addcleanup)

#### Defined in

[index.mts:138](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L138)

___

### clone

▸ **clone**(): [`Counter`](Counter.md)<`Item`, `Element`\>

Clone the store.

#### Returns

[`Counter`](Counter.md)<`Item`, `Element`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[clone](KeyedCollection.md#clone)

#### Defined in

[index.mts:130](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L130)

___

### destroy

▸ **destroy**(): `void`

Destroy the store.

This function removes event listeners attached to parent stores.

#### Returns

`void`

#### Inherited from

[KeyedCollection](KeyedCollection.md).[destroy](KeyedCollection.md#destroy)

#### Defined in

[index.mts:118](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L118)

___

### get

▸ **get**(): `Map`<`Element`, `number`\>

Get the value.

#### Returns

`Map`<`Element`, `number`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[get](KeyedCollection.md#get)

#### Defined in

[index.mts:104](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L104)

___

### getDelta

▸ **getDelta**(): `undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`Element`\>

Get the latest delta.

#### Returns

`undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`Element`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[getDelta](KeyedCollection.md#getdelta)

#### Defined in

[index.mts:110](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L110)

___

### set

▸ **set**(`patcher`, `ts?`): `void`

Update the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patcher` | [`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\> | For primitive store, this is the new value. For collection store, you have to specify added, updated, and removed items. |
| `ts` | `number` | The timestamp. |

#### Returns

`void`

#### Inherited from

[KeyedCollection](KeyedCollection.md).[set](KeyedCollection.md#set)

#### Defined in

[index.mts:79](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L79)

___

### setAsync

▸ **setAsync**(`callbackOrPromise`): `Promise`<`void`\>

Set with an async function. You may want to use this function to update store with an older `ts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackOrPromise` | `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> \| (`value`: `Map`<`Element`, `number`\>) => `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[setAsync](KeyedCollection.md#setasync)

#### Defined in

[index.mts:94](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L94)
