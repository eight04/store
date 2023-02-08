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

[index.mts:38](https://github.com/eight04/store/blob/cb9d28d/index.mts#L38)

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

[index.mts:262](https://github.com/eight04/store/blob/cb9d28d/index.mts#L262)

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

[index.mts:163](https://github.com/eight04/store/blob/cb9d28d/index.mts#L163)

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

[index.mts:151](https://github.com/eight04/store/blob/cb9d28d/index.mts#L151)

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

[index.mts:146](https://github.com/eight04/store/blob/cb9d28d/index.mts#L146)

___

### Stores

Ƭ **Stores**: [`AnyStore`](interfaces/AnyStore.md)<`any`\> \| [[`AnyStore`](interfaces/AnyStore.md)<`any`\>, ...AnyStore<any\>[]] \| [`AnyStore`](interfaces/AnyStore.md)<`any`\>[]

One or multiple parent stores.

#### Defined in

[index.mts:339](https://github.com/eight04/store/blob/cb9d28d/index.mts#L339)

___

### StoresValues

Ƭ **StoresValues**<`T`\>: `T` extends [`AnyStore`](interfaces/AnyStore.md)<infer U\> ? [`U`] : { [K in keyof T]: T[K] extends AnyStore<infer U\> ? U : never }

Values of parent stores.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[index.mts:341](https://github.com/eight04/store/blob/cb9d28d/index.mts#L341)

## Functions

### count

▸ **count**<`Element`\>(`$c`, `extract`): [`SetStore`](classes/SetStore.md)<[`Element`, `number`]\>

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

[`SetStore`](classes/SetStore.md)<[`Element`, `number`]\>

#### Defined in

[index.mts:506](https://github.com/eight04/store/blob/cb9d28d/index.mts#L506)

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

[index.mts:350](https://github.com/eight04/store/blob/cb9d28d/index.mts#L350)

___

### filter

▸ **filter**<`C`, `S`\>(`$c`, `$ss`, `test`): `C`

Create a new store that filters items in a collection.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends [`KeyedCollection`](classes/KeyedCollection.md)<`any`, `any`, [`CollectionDelta`](README.md#collectiondelta)<`any`\>, `C`\> |
| `S` | extends [`Stores`](README.md#stores) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | `C` | A collection store. |
| `$ss` | `S` | A store, or a list of stores whose values can be used as filter parameters. |
| `test` | (`item`: `ItemFromCollection`<`C`\>, ...`values`: [`StoresValues`](README.md#storesvalues)<`S`\>) => `boolean` | A callback function that returns a boolean to filter the item. |

#### Returns

`C`

#### Defined in

[index.mts:377](https://github.com/eight04/store/blob/cb9d28d/index.mts#L377)

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

[index.mts:568](https://github.com/eight04/store/blob/cb9d28d/index.mts#L568)

___

### slice

▸ **slice**(`$c`, `$start`, `$end`): typeof `$c`

Create a new array store representing a slice of the original array store.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `$c` | [`ArrayStore`](classes/ArrayStore.md)<`any`\> | An array store. |
| `$start` | [`AnyStore`](interfaces/AnyStore.md)<`number`\> | A number store representing the start index. |
| `$end` | [`AnyStore`](interfaces/AnyStore.md)<`number`\> | A number store representing the end index. |

#### Returns

typeof `$c`

#### Defined in

[index.mts:458](https://github.com/eight04/store/blob/cb9d28d/index.mts#L458)

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

[index.mts:597](https://github.com/eight04/store/blob/cb9d28d/index.mts#L597)
