@eight04/store

# @eight04/store

## Table of contents

### Classes

- [ArrayStore](classes/ArrayStore.md)
- [KeyedCollection](classes/KeyedCollection.md)
- [SetStore](classes/SetStore.md)
- [Store](classes/Store.md)

### Interfaces

- [AnyDelta](interfaces/AnyDelta.md)
- [AnyStore](interfaces/AnyStore.md)

### Type Aliases

- [BasicDelta](README.md#basicdelta)
- [CmpFn](README.md#cmpfn)
- [CollectionDelta](README.md#collectiondelta)
- [CollectionSetParam](README.md#collectionsetparam)
- [KeyGetter](README.md#keygetter)
- [Stores](README.md#stores)
- [StoresValues](README.md#storesvalues)

### Functions

- [count](README.md#count)
- [derived](README.md#derived)
- [filter](README.md#filter)
- [map](README.md#map)
- [reindex](README.md#reindex)
- [slice](README.md#slice)
- [sort](README.md#sort)

## Type Aliases

### BasicDelta

Ƭ **BasicDelta**<`Value`\>: [`AnyDelta`](interfaces/AnyDelta.md) & { `newValue`: `Value` ; `oldValue`: `Value`  }

The basic delta for primitive stores.

#### Type parameters

| Name |
| :------ |
| `Value` |

#### Defined in

[index.mts:39](https://github.com/eight04/store/blob/ef00f00/index.mts#L39)

___

### CmpFn

Ƭ **CmpFn**<`Item`\>: (`a`: `Item`, `b`: `Item`) => `number`

#### Type parameters

| Name |
| :------ |
| `Item` |

#### Type declaration

▸ (`a`, `b`): `number`

Compare two items. Returns negative if a < b, returns positive if a > b, returns zero otherwise.

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `Item` |
| `b` | `Item` |

##### Returns

`number`

#### Defined in

[index.mts:263](https://github.com/eight04/store/blob/ef00f00/index.mts#L263)

___

### CollectionDelta

Ƭ **CollectionDelta**<`Item`\>: `Object`

Delta for collection store.

#### Type parameters

| Name |
| :------ |
| `Item` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `added` | `Item`[] | Added items. |
| `removed` | `Item`[] | Removed items. |
| `ts` | `number` | Timestamp. |
| `updated` | `Item`[] | Updated items. |

#### Defined in

[index.mts:164](https://github.com/eight04/store/blob/ef00f00/index.mts#L164)

___

### CollectionSetParam

Ƭ **CollectionSetParam**<`Item`\>: `Object`

Add, update, and remove items in a collection.

#### Type parameters

| Name |
| :------ |
| `Item` |

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `added?` | `Item`[] | Add items. |
| `removed?` | `Item`[] | Remove items. |
| `updated?` | `Item`[] | Update items. |

#### Defined in

[index.mts:152](https://github.com/eight04/store/blob/ef00f00/index.mts#L152)

___

### KeyGetter

Ƭ **KeyGetter**<`T`\>: (`item`: `T`) => `any`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Type declaration

▸ (`item`): `any`

Returns the key of the item.

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `T` |

##### Returns

`any`

#### Defined in

[index.mts:147](https://github.com/eight04/store/blob/ef00f00/index.mts#L147)

___

### Stores

Ƭ **Stores**: [`AnyStore`](interfaces/AnyStore.md)<`any`, [`AnyDelta`](interfaces/AnyDelta.md)\> \| [`AnyStore`](interfaces/AnyStore.md)<`any`, [`AnyDelta`](interfaces/AnyDelta.md)\>[]

One or multiple parent stores.

#### Defined in

[index.mts:340](https://github.com/eight04/store/blob/ef00f00/index.mts#L340)

___

### StoresValues

Ƭ **StoresValues**<`T`\>: `T` extends [`AnyStore`](interfaces/AnyStore.md)<infer U, [`AnyDelta`](interfaces/AnyDelta.md)\> ? [`U`] : { [K in keyof T]: T[K] extends AnyStore<infer U, AnyDelta\> ? U : never }

Values of parent stores.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[index.mts:342](https://github.com/eight04/store/blob/ef00f00/index.mts#L342)

## Functions

### count

▸ **count**<`Element`\>(`$c`, `extract`): [`SetStore`](classes/SetStore.md)<readonly [`Element`, `number`]\>

Create a new store that counts elements from a collection.

#### Type parameters

| Name |
| :------ |
| `Element` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>\> | A collection store. |
| `extract` | (`item`: `any`) => `Iterable`<`Element`\> | A callback function that returns some elements to count. |

#### Returns

[`SetStore`](classes/SetStore.md)<readonly [`Element`, `number`]\>

#### Defined in

[index.mts:511](https://github.com/eight04/store/blob/ef00f00/index.mts#L511)

___

### derived

▸ **derived**<`S`, `Value`\>(`stores`, `fn`): [`Store`](classes/Store.md)<`Value`\>

Combine multiple stores into a new store.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`Stores`](README.md#stores) |
| `Value` | `Value` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stores` | `S` | A store, or a list of stores to combine. |
| `fn` | (...`values`: [`StoresValues`](README.md#storesvalues)<`S`\>) => `Value` | A callback that receives stores values and return the new value of derived store. |

#### Returns

[`Store`](classes/Store.md)<`Value`\>

#### Defined in

[index.mts:351](https://github.com/eight04/store/blob/ef00f00/index.mts#L351)

___

### filter

▸ **filter**<`C`, `S`\>(`$c`, `params`, `test`): `C`

Create a new store that filters items in a collection.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>, `C`\> |
| `S` | extends `FilterParam`<[`AnyStore`](interfaces/AnyStore.md)<`any`, `any`\>\>[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | `C` | A collection store. |
| `params` | `S` | A list of parameters that can be used in the test function. |
| `test` | (`item`: `ItemFromCollection`<`C`\>, ...`values`: `ValuesFromFilterParams`<`S`\>) => `boolean` | A callback function that returns a boolean to filter the item. |

#### Returns

`C`

#### Defined in

[index.mts:388](https://github.com/eight04/store/blob/ef00f00/index.mts#L388)

___

### map

▸ **map**<`NewItem`\>(`$c`, `key`, `map`): [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>\>

Create a new collection with derived items.

#### Type parameters

| Name |
| :------ |
| `NewItem` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>\> | - |
| `key` | [`KeyGetter`](README.md#keygetter)<`NewItem`\> | The key getter for the new item. |
| `map` | (`item`: `any`) => `NewItem` | A callback function that transform an old item into a new one. |

#### Returns

[`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>\>

#### Defined in

[index.mts:573](https://github.com/eight04/store/blob/ef00f00/index.mts#L573)

___

### reindex

▸ **reindex**<`C`, `Index`\>(`$c`, `indexFn`): [`SetStore`](classes/SetStore.md)<readonly [`Index`, `ItemFromCollection`<`C`\>[]]\>

Reindex a collection into a new set

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>, `C`\> |
| `Index` | `Index` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `$c` | `C` |
| `indexFn` | (`item`: `ItemFromCollection`<`C`\>) => `Index` |

#### Returns

[`SetStore`](classes/SetStore.md)<readonly [`Index`, `ItemFromCollection`<`C`\>[]]\>

#### Defined in

[index.mts:631](https://github.com/eight04/store/blob/ef00f00/index.mts#L631)

___

### slice

▸ **slice**(`$c`, `$range`): typeof `$c`

Create a new array store representing a slice of the original array store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | [`ArrayStore`](classes/ArrayStore.md)<`any`\> | An array store. |
| `$range` | [`Store`](classes/Store.md)<readonly [`number`, `number`], [`BasicDelta`](README.md#basicdelta)<readonly [`number`, `number`]\>, readonly [`number`, `number`]\> | A tuple store representing [startIndex, endIndex] |

#### Returns

typeof `$c`

#### Defined in

[index.mts:465](https://github.com/eight04/store/blob/ef00f00/index.mts#L465)

___

### sort

▸ **sort**<`Item`\>(`$c`, `cmp`): [`ArrayStore`](classes/ArrayStore.md)<`Item`\>

Create a new array store from a collection.

#### Type parameters

| Name |
| :------ |
| `Item` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `$c` | [`KeyedCollection`](classes/KeyedCollection.md)<`Item`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`Item`\>\> |
| `cmp` | [`CmpFn`](README.md#cmpfn)<`Item`\> |

#### Returns

[`ArrayStore`](classes/ArrayStore.md)<`Item`\>

#### Defined in

[index.mts:602](https://github.com/eight04/store/blob/ef00f00/index.mts#L602)
