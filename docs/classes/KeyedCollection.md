[@eight04/store](../README.md) / KeyedCollection

# Class: KeyedCollection<Item, Value, Delta\>

An abstracted base class for any keyed-collection.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Item` | `Item` |
| `Value` | `Value` |
| `Delta` | extends [`CollectionDelta`](../README.md#collectiondelta)<`any`\> = [`CollectionDelta`](../README.md#collectiondelta)<`Item`\> |

## Hierarchy

- [`Store`](Store.md)<`Value`, `Delta`, [`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\>

  ↳ **`KeyedCollection`**

  ↳↳ [`SetStore`](SetStore.md)

  ↳↳ [`ArrayStore`](ArrayStore.md)

  ↳↳ [`Counter`](Counter.md)

## Table of contents

### Properties

- [map](KeyedCollection.md#map)

### Methods

- [addCleanup](KeyedCollection.md#addcleanup)
- [clone](KeyedCollection.md#clone)
- [destroy](KeyedCollection.md#destroy)
- [get](KeyedCollection.md#get)
- [getDelta](KeyedCollection.md#getdelta)
- [set](KeyedCollection.md#set)
- [setAsync](KeyedCollection.md#setasync)

## Properties

### map

• **map**: `Map`<`any`, `Item`\>

A key-item map.

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

[Store](Store.md).[addCleanup](Store.md#addcleanup)

#### Defined in

[index.mts:138](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L138)

___

### clone

▸ **clone**(): [`KeyedCollection`](KeyedCollection.md)<`Item`, `Value`, `Delta`\>

Clone the store.

#### Returns

[`KeyedCollection`](KeyedCollection.md)<`Item`, `Value`, `Delta`\>

#### Inherited from

[Store](Store.md).[clone](Store.md#clone)

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

[Store](Store.md).[destroy](Store.md#destroy)

#### Defined in

[index.mts:118](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L118)

___

### get

▸ **get**(): `Value`

Get the value.

#### Returns

`Value`

#### Inherited from

[Store](Store.md).[get](Store.md#get)

#### Defined in

[index.mts:104](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L104)

___

### getDelta

▸ **getDelta**(): `undefined` \| `Delta`

Get the latest delta.

#### Returns

`undefined` \| `Delta`

#### Inherited from

[Store](Store.md).[getDelta](Store.md#getdelta)

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

[Store](Store.md).[set](Store.md#set)

#### Defined in

[index.mts:79](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L79)

___

### setAsync

▸ **setAsync**(`callbackOrPromise`): `Promise`<`void`\>

Set with an async function. You may want to use this function to update store with an older `ts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackOrPromise` | `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> \| (`value`: `Value`) => `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`Item`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[Store](Store.md).[setAsync](Store.md#setasync)

#### Defined in

[index.mts:94](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L94)
