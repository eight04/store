[@eight04/store](../README.md) / AnyStore

# Interface: AnyStore<Value, Delta\>

An interface represents a valid store.

Basically, a store has to be able to set/get value and emit a "change" event when value changes.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Value` | `Value` |
| `Delta` | extends [`AnyDelta`](AnyDelta.md) |

## Implemented by

- [`Store`](../classes/Store.md)

## Table of contents

### Methods

- [addCleanup](AnyStore.md#addcleanup)
- [clone](AnyStore.md#clone)
- [destroy](AnyStore.md#destroy)
- [get](AnyStore.md#get)
- [off](AnyStore.md#off)
- [on](AnyStore.md#on)
- [set](AnyStore.md#set)

## Methods

### addCleanup

▸ **addCleanup**(`callback`): `void`

Register a cleanup function.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | () => `void` |

#### Returns

`void`

#### Defined in

[index.mts:28](https://github.com/eight04/store/blob/ffefaa0/index.mts#L28)

___

### clone

▸ **clone**(): [`AnyStore`](AnyStore.md)<`Value`, `Delta`\>

Clone the store.

#### Returns

[`AnyStore`](AnyStore.md)<`Value`, `Delta`\>

#### Defined in

[index.mts:32](https://github.com/eight04/store/blob/ffefaa0/index.mts#L32)

___

### destroy

▸ **destroy**(): `void`

Cleanup listeners attached to parent stores.

#### Returns

`void`

#### Defined in

[index.mts:30](https://github.com/eight04/store/blob/ffefaa0/index.mts#L30)

___

### get

▸ **get**(): `Value`

Get the value

#### Returns

`Value`

#### Defined in

[index.mts:26](https://github.com/eight04/store/blob/ffefaa0/index.mts#L26)

___

### off

▸ **off**(`event`, `...args`): `void`

Remove an event listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[index.mts:22](https://github.com/eight04/store/blob/ffefaa0/index.mts#L22)

___

### on

▸ **on**(`event`, `callback`): `void`

Register an event listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | ``"change"`` |
| `callback` | (`delta`: `Delta`) => `void` |

#### Returns

`void`

#### Defined in

[index.mts:20](https://github.com/eight04/store/blob/ffefaa0/index.mts#L20)

___

### set

▸ **set**(`patcher`, `ts?`): `void`

Set a new value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `patcher` | `any` |
| `ts?` | `number` |

#### Returns

`void`

#### Defined in

[index.mts:24](https://github.com/eight04/store/blob/ffefaa0/index.mts#L24)
