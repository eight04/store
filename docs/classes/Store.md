[@eight04/store](../README.md) / Store

# Class: Store<Value, Delta, SetParam\>

The base class of reactive store.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Delta` | [`BasicDelta`](../README.md#basicdelta)<`Value`\> |
| `SetParam` | `Value` |

## Hierarchy

- `EventLite`

  ↳ **`Store`**

  ↳↳ [`KeyedCollection`](KeyedCollection.md)

## Implements

- [`AnyStore`](../interfaces/AnyStore.md)<`Value`\>

## Table of contents

### Constructors

- [constructor](Store.md#constructor)

### Methods

- [addCleanup](Store.md#addcleanup)
- [clone](Store.md#clone)
- [destroy](Store.md#destroy)
- [get](Store.md#get)
- [getDelta](Store.md#getdelta)
- [set](Store.md#set)
- [setAsync](Store.md#setasync)

## Constructors

### constructor

• **new Store**<`Value`, `Delta`, `SetParam`\>(`value`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Delta` | [`BasicDelta`](../README.md#basicdelta)<`Value`\> |
| `SetParam` | `Value` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Value` | The initial value of the store. |

#### Overrides

Events.constructor

#### Defined in

[index.mts:56](https://github.com/eight04/store/blob/aa9ab89/index.mts#L56)

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

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[addCleanup](../interfaces/AnyStore.md#addcleanup)

#### Defined in

[index.mts:138](https://github.com/eight04/store/blob/aa9ab89/index.mts#L138)

___

### clone

▸ **clone**(): [`Store`](Store.md)<`Value`, `Delta`, `SetParam`\>

Clone the store.

#### Returns

[`Store`](Store.md)<`Value`, `Delta`, `SetParam`\>

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[clone](../interfaces/AnyStore.md#clone)

#### Defined in

[index.mts:130](https://github.com/eight04/store/blob/aa9ab89/index.mts#L130)

___

### destroy

▸ **destroy**(): `void`

Destroy the store.

This function removes event listeners attached to parent stores.

#### Returns

`void`

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[destroy](../interfaces/AnyStore.md#destroy)

#### Defined in

[index.mts:118](https://github.com/eight04/store/blob/aa9ab89/index.mts#L118)

___

### get

▸ **get**(): `Value`

Get the value.

#### Returns

`Value`

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[get](../interfaces/AnyStore.md#get)

#### Defined in

[index.mts:104](https://github.com/eight04/store/blob/aa9ab89/index.mts#L104)

___

### getDelta

▸ **getDelta**(): `undefined` \| `Delta`

Get the latest delta.

#### Returns

`undefined` \| `Delta`

#### Defined in

[index.mts:110](https://github.com/eight04/store/blob/aa9ab89/index.mts#L110)

___

### set

▸ **set**(`patcher`, `ts?`): `void`

Update the store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `patcher` | `SetParam` | For primitive store, this is the new value. For collection store, you have to specify added, updated, and removed items. |
| `ts` | `number` | The timestamp. |

#### Returns

`void`

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[set](../interfaces/AnyStore.md#set)

#### Defined in

[index.mts:79](https://github.com/eight04/store/blob/aa9ab89/index.mts#L79)

___

### setAsync

▸ **setAsync**(`callbackOrPromise`): `Promise`<`void`\>

Set with an async function. You may want to use this function to update store with an older `ts`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callbackOrPromise` | `Promise`<`SetParam`\> \| (`value`: `Value`) => `Promise`<`SetParam`\> |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.mts:94](https://github.com/eight04/store/blob/aa9ab89/index.mts#L94)
