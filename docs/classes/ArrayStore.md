[@eight04/store](../README.md) / ArrayStore

# Class: ArrayStore<Item\>

A store representing a array a.k.a sorted list of items.

Items are sorted ascending.

## Type parameters

| Name |
| :------ |
| `Item` |

## Hierarchy

- [`KeyedCollection`](KeyedCollection.md)<`Item`, `Item`[]\>

  ↳ **`ArrayStore`**

## Table of contents

### Constructors

- [constructor](ArrayStore.md#constructor)

### Properties

- [map](ArrayStore.md#map)

### Methods

- [addCleanup](ArrayStore.md#addcleanup)
- [clone](ArrayStore.md#clone)
- [destroy](ArrayStore.md#destroy)
- [get](ArrayStore.md#get)
- [getDelta](ArrayStore.md#getdelta)
- [set](ArrayStore.md#set)
- [setAsync](ArrayStore.md#setasync)

## Constructors

### constructor

• **new ArrayStore**<`Item`\>(`key`, `cmp`)

#### Type parameters

| Name |
| :------ |
| `Item` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyGetter`](../README.md#keygetter)<`Item`\> | A callback function that returns the key of the item. |
| `cmp` | [`CmpFn`](../README.md#cmpfn)<`Item`\> | Compare two items and return a number. If the number is negative, the first item is smaller than the second item. If the number is positive, the first item is larger than the second item. If the number is zero, the two items are equal. |

#### Overrides

KeyedCollection&lt;Item, Array&lt;Item\&gt;\&gt;.constructor

#### Defined in

[index.mts:276](https://github.com/eight04/store/blob/aa9ab89/index.mts#L276)

## Properties

### map

• **map**: `Map`<`any`, `Item`\>

A key-item map.

#### Inherited from

[KeyedCollection](KeyedCollection.md).[map](KeyedCollection.md#map)

#### Defined in

[index.mts:182](https://github.com/eight04/store/blob/aa9ab89/index.mts#L182)

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

[index.mts:138](https://github.com/eight04/store/blob/aa9ab89/index.mts#L138)

___

### clone

▸ **clone**(): [`ArrayStore`](ArrayStore.md)<`Item`\>

Clone the store.

#### Returns

[`ArrayStore`](ArrayStore.md)<`Item`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[clone](KeyedCollection.md#clone)

#### Defined in

[index.mts:130](https://github.com/eight04/store/blob/aa9ab89/index.mts#L130)

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

[index.mts:118](https://github.com/eight04/store/blob/aa9ab89/index.mts#L118)

___

### get

▸ **get**(): `Item`[]

Get the value.

#### Returns

`Item`[]

#### Inherited from

[KeyedCollection](KeyedCollection.md).[get](KeyedCollection.md#get)

#### Defined in

[index.mts:104](https://github.com/eight04/store/blob/aa9ab89/index.mts#L104)

___

### getDelta

▸ **getDelta**(): `undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`Item`\>

Get the latest delta.

#### Returns

`undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`Item`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[getDelta](KeyedCollection.md#getdelta)

#### Defined in

[index.mts:110](https://github.com/eight04/store/blob/aa9ab89/index.mts#L110)

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

[index.mts:79](https://github.com/eight04/store/blob/aa9ab89/index.mts#L79)

___

### setAsync

▸ **setAsync**(`callbackOrPromise`): `Promise`<`void`\>

Set with an async function. You may want to use this function to update store with an older `ts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackOrPromise` | `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> \| (`value`: `Item`[]) => `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[setAsync](KeyedCollection.md#setasync)

#### Defined in

[index.mts:94](https://github.com/eight04/store/blob/aa9ab89/index.mts#L94)
