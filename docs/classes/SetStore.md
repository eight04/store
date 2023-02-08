[@eight04/store](../README.md) / SetStore

# Class: SetStore<T\>

A store representing a set of items.

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`KeyedCollection`](KeyedCollection.md)<`T`, `Set`<`T`\>\>

  ↳ **`SetStore`**

## Table of contents

### Constructors

- [constructor](SetStore.md#constructor)

### Properties

- [map](SetStore.md#map)

### Methods

- [addCleanup](SetStore.md#addcleanup)
- [clone](SetStore.md#clone)
- [destroy](SetStore.md#destroy)
- [get](SetStore.md#get)
- [getDelta](SetStore.md#getdelta)
- [set](SetStore.md#set)
- [setAsync](SetStore.md#setasync)

## Constructors

### constructor

• **new SetStore**<`T`\>(`key`)

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | [`KeyGetter`](../README.md#keygetter)<`T`\> | A callback function that returns the key of the item. |

#### Overrides

KeyedCollection&lt;T, Set&lt;T\&gt;\&gt;.constructor

#### Defined in

[index.mts:208](https://github.com/eight04/store/blob/cb9d28d/index.mts#L208)

## Properties

### map

• **map**: `Map`<`any`, `T`\>

A key-item map.

#### Inherited from

[KeyedCollection](KeyedCollection.md).[map](KeyedCollection.md#map)

#### Defined in

[index.mts:182](https://github.com/eight04/store/blob/cb9d28d/index.mts#L182)

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

[index.mts:138](https://github.com/eight04/store/blob/cb9d28d/index.mts#L138)

___

### clone

▸ **clone**(): [`SetStore`](SetStore.md)<`T`\>

Clone the store.

#### Returns

[`SetStore`](SetStore.md)<`T`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[clone](KeyedCollection.md#clone)

#### Defined in

[index.mts:130](https://github.com/eight04/store/blob/cb9d28d/index.mts#L130)

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

[index.mts:118](https://github.com/eight04/store/blob/cb9d28d/index.mts#L118)

___

### get

▸ **get**(): `Set`<`T`\>

Get the value.

#### Returns

`Set`<`T`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[get](KeyedCollection.md#get)

#### Defined in

[index.mts:104](https://github.com/eight04/store/blob/cb9d28d/index.mts#L104)

___

### getDelta

▸ **getDelta**(): `undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`T`\>

Get the latest delta.

#### Returns

`undefined` \| [`CollectionDelta`](../README.md#collectiondelta)<`T`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[getDelta](KeyedCollection.md#getdelta)

#### Defined in

[index.mts:110](https://github.com/eight04/store/blob/cb9d28d/index.mts#L110)

___

### set

▸ **set**(`patcher`, `ts?`): `void`

Update the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patcher` | [`CollectionSetParam`](../README.md#collectionsetparam)<`T`\> | For primitive store, this is the new value. For collection store, you have to specify added, updated, and removed items. |
| `ts` | `number` | The timestamp. |

#### Returns

`void`

#### Inherited from

[KeyedCollection](KeyedCollection.md).[set](KeyedCollection.md#set)

#### Defined in

[index.mts:79](https://github.com/eight04/store/blob/cb9d28d/index.mts#L79)

___

### setAsync

▸ **setAsync**(`callbackOrPromise`): `Promise`<`void`\>

Set with an async function. You may want to use this function to update store with an older `ts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackOrPromise` | `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`T`\>\> \| (`value`: `Set`<`T`\>) => `Promise`<[`CollectionSetParam`](../README.md#collectionsetparam)<`T`\>\> |

#### Returns

`Promise`<`void`\>

#### Inherited from

[KeyedCollection](KeyedCollection.md).[setAsync](KeyedCollection.md#setasync)

#### Defined in

[index.mts:94](https://github.com/eight04/store/blob/cb9d28d/index.mts#L94)
