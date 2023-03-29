[@eight04/store](../README.md) / Store

# Class: Store<Value, Delta, SetParam\>

The base class of reactive store.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Delta` | extends [`AnyDelta`](../interfaces/AnyDelta.md) = [`BasicDelta`](../README.md#basicdelta)<`Value`\> |
| `SetParam` | `Value` |

## Hierarchy

- `EventLite`

  ↳ **`Store`**

  ↳↳ [`KeyedCollection`](KeyedCollection.md)

## Implements

- [`AnyStore`](../interfaces/AnyStore.md)<`Value`, `Delta`\>

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
| `Delta` | extends [`AnyDelta`](../interfaces/AnyDelta.md) = [`BasicDelta`](../README.md#basicdelta)<`Value`\> |
| `SetParam` | `Value` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `Value` | The initial value of the store. |

#### Overrides

Events.constructor

#### Defined in

[index.mts:57](https://github.com/eight04/store/blob/ffefaa0/index.mts#L57)

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

[index.mts:139](https://github.com/eight04/store/blob/ffefaa0/index.mts#L139)

___

### clone

▸ **clone**(): [`Store`](Store.md)<`Value`, `Delta`, `SetParam`\>

Clone the store.

#### Returns

[`Store`](Store.md)<`Value`, `Delta`, `SetParam`\>

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[clone](../interfaces/AnyStore.md#clone)

#### Defined in

[index.mts:131](https://github.com/eight04/store/blob/ffefaa0/index.mts#L131)

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

[index.mts:119](https://github.com/eight04/store/blob/ffefaa0/index.mts#L119)

___

### get

▸ **get**(): `Value`

Get the value.

#### Returns

`Value`

#### Implementation of

[AnyStore](../interfaces/AnyStore.md).[get](../interfaces/AnyStore.md#get)

#### Defined in

[index.mts:105](https://github.com/eight04/store/blob/ffefaa0/index.mts#L105)

___

### getDelta

▸ **getDelta**(): `undefined` \| `Delta`

Get the latest delta.

#### Returns

`undefined` \| `Delta`

#### Defined in

[index.mts:111](https://github.com/eight04/store/blob/ffefaa0/index.mts#L111)

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

[index.mts:80](https://github.com/eight04/store/blob/ffefaa0/index.mts#L80)

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

[index.mts:95](https://github.com/eight04/store/blob/ffefaa0/index.mts#L95)
