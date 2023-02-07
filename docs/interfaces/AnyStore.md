[@eight04/store](../README.md) / AnyStore

# Interface: AnyStore<Value\>

An interface represents a valid store.

Basically, a store has to be able to set/get value and emit a "change" event when value changes.

## Type parameters

| Name |
| :------ |
| `Value` |

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

[index.mts:18](https://github.com/eight04/store/blob/38161dc/index.mts#L18)

___

### clone

▸ **clone**(): [`AnyStore`](AnyStore.md)<`Value`\>

Clone the store.

#### Returns

[`AnyStore`](AnyStore.md)<`Value`\>

#### Defined in

[index.mts:22](https://github.com/eight04/store/blob/38161dc/index.mts#L22)

___

### destroy

▸ **destroy**(): `void`

Cleanup listeners attached to parent stores.

#### Returns

`void`

#### Defined in

[index.mts:20](https://github.com/eight04/store/blob/38161dc/index.mts#L20)

___

### get

▸ **get**(): `Value`

Get the value

#### Returns

`Value`

#### Defined in

[index.mts:16](https://github.com/eight04/store/blob/38161dc/index.mts#L16)

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

[index.mts:12](https://github.com/eight04/store/blob/38161dc/index.mts#L12)

___

### on

▸ **on**(`event`, `...args`): `void`

Register an event listener.

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[index.mts:10](https://github.com/eight04/store/blob/38161dc/index.mts#L10)

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

[index.mts:14](https://github.com/eight04/store/blob/38161dc/index.mts#L14)
