@eight04/store

# @eight04/store

## Table of contents

### Classes

- [ArrayStore](classes/ArrayStore.md)
- [Counter](classes/Counter.md)
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
- [ExtractFn](README.md#extractfn)
- [KeyGetter](README.md#keygetter)
- [Stores](README.md#stores)
- [StoresValues](README.md#storesvalues)

### Functions

- [count](README.md#count)
- [derived](README.md#derived)
- [filter](README.md#filter)
- [slice](README.md#slice)

## Type Aliases

### BasicDelta

Ƭ **BasicDelta**<`Value`\>: [`AnyDelta`](interfaces/AnyDelta.md) & { `newValue`: `Value` ; `oldValue`: `Value`  }

The basic delta for primitive stores.

#### Type parameters

| Name |
| :------ |
| `Value` |

#### Defined in

[index.mts:38](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L38)

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

[index.mts:262](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L262)

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

[index.mts:163](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L163)

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

[index.mts:151](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L151)

___

### ExtractFn

Ƭ **ExtractFn**<`Item`, `Element`\>: (`item`: `Item`) => `Iterable`<`Element`\>

#### Type parameters

| Name |
| :------ |
| `Item` |
| `Element` |

#### Type declaration

▸ (`item`): `Iterable`<`Element`\>

Extract elements from an item.

##### Parameters

| Name | Type |
| :------ | :------ |
| `item` | `Item` |

##### Returns

`Iterable`<`Element`\>

#### Defined in

[index.mts:302](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L302)

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

[index.mts:146](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L146)

___

### Stores

Ƭ **Stores**: [`AnyStore`](interfaces/AnyStore.md)<`any`\> \| [[`AnyStore`](interfaces/AnyStore.md)<`any`\>, ...AnyStore<any\>[]] \| [`AnyStore`](interfaces/AnyStore.md)<`any`\>[]

One or multiple parent stores.

#### Defined in

[index.mts:431](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L431)

___

### StoresValues

Ƭ **StoresValues**<`T`\>: `T` extends [`AnyStore`](interfaces/AnyStore.md)<infer U\> ? [`U`] : { [K in keyof T]: T[K] extends AnyStore<infer U\> ? U : never }

Values of parent stores.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[index.mts:433](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L433)

## Functions

### count

▸ **count**<`Element`\>(`$c`, `extract`): [`Counter`](classes/Counter.md)<`any`, `Element`\>

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

[`Counter`](classes/Counter.md)<`any`, `Element`\>

#### Defined in

[index.mts:598](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L598)

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

[index.mts:442](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L442)

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

[index.mts:469](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L469)

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

[index.mts:550](https://github.com/eight04/store/blob/7fa3f8a/index.mts#L550)
