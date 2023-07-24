import { Extends, Or } from './Boolean'
import { Add, Decrement, Enumerate, Increment, IsGreaterThan, Subtract } from './Number'
import { NoUncheckedIndexedAccess } from './compilerOptions'
import { Keys } from './misc'
import { Flatten } from 'ts-toolbelt/out/List/Flatten'
import { Head } from 'ts-toolbelt/out/List/Head'
import { Tail } from 'ts-toolbelt/out/List/Tail'
import { Take } from 'ts-toolbelt/out/List/Take'
import { Length } from 'ts-toolbelt/out/String/Length'
import { ListOf } from 'ts-toolbelt/out/Union/ListOf'

type _BuildPowersOf2LengthArrays<
    Length extends number,
    AccumulatedArray extends never[][],
> = AccumulatedArray[0][Length] extends never
    ? AccumulatedArray
    : _BuildPowersOf2LengthArrays<
          Length,
          [[...AccumulatedArray[0], ...AccumulatedArray[0]], ...AccumulatedArray]
      >

type _ConcatLargestUntilDone<
    Length extends number,
    AccumulatedArray extends never[][],
    NextArray extends never[],
> = NextArray['length'] extends Length
    ? NextArray
    : _ConcatLargestUntilDone<
          Length,
          AccumulatedArray extends [AccumulatedArray[0], ...infer U extends never[][]] ? U : never,
          [...AccumulatedArray[0], ...NextArray][Length] extends never
              ? NextArray
              : [...AccumulatedArray[0], ...NextArray]
      >

type _Replace<out R extends unknown[], out T> = { [K in keyof R]: T }

/**
 * creates an array with a fixed length
 * @example
 * TupleOf<number, 4> //[number, number, number, number]
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787
 */
export type TupleOf<Type, Length extends number> = number extends Length
    ? Type[]
    : {
          // in case Length is a union
          [LengthKey in Length]: _BuildPowersOf2LengthArrays<
              LengthKey,
              [[never]]
          > extends infer TwoDimensionalArray
              ? // infer extends doesnt work here due to https://github.com/microsoft/TypeScript/issues/50721#issuecomment-1363554868 i think
                TwoDimensionalArray extends never[][]
                  ? _Replace<_ConcatLargestUntilDone<LengthKey, TwoDimensionalArray, []>, Type>
                  : never
              : never
      }[Length]

/**
 * an array that can be of any length between 0 and `L`
 * @example
 * declare const foo: TupleOfUpTo<number, 3>
 * foo[0] //number (or number|undefined if `noUncheckedIndexedAccess` is enabled)
 * foo[3] //error: tuple of length '3' has no element at index '3'
 */
export type TupleOfUpTo<T, L extends number> = TupleOf<T, Enumerate<Increment<L>>>

/**
 * an array of length `L` - 1
 * @example
 * declare const foo: TupleOfExcluding<number, 3>
 * foo[1] //number
 * foo[2] //error: tuple of length '2' has no element at index '2'
 */
export type TupleOfExcluding<T, L extends number> = TupleOf<T, Decrement<L>>

/**
 * an array that can be of any length between 0 and `L`, excluding `L`
 * @example
 * declare const foo: TupleOfUpToButNotIncluding<number, 3>
 * foo[1] //number (or number|undefined if `noUncheckedIndexedAccess` is enabled)
 * foo[2] //error: tuple of length '2' has no element at index '2'
 */
export type TupleOfUpToButNotIncluding<T, L extends number> =
    | TupleOfExcluding<T, L>
    | (NoUncheckedIndexedAccess extends true ? [] : never)

/**
 * an array that has a size of at least `Length`
 */
export type TupleOfAtLeast<Type, Length extends number> = TupleOf<Type, Length> | Type[]

/**
 * like `keyof` but for array indexes, and uses numbers instead of strings
 */
export type Index<T extends readonly unknown[]> = Enumerate<T['length']>

type _IndexOf<
    Array extends readonly unknown[],
    Value extends Array[number],
    CurrentIndex extends Index<Array>,
> = Array[CurrentIndex] extends Value
    ? CurrentIndex
    : CurrentIndex extends Array['length']
    ? -1
    : _IndexOf<Array, Value, Increment<CurrentIndex>>

/**
 * the type equivalent of {@link Array.prototype.indexOf}
 */
export type IndexOf<
    Array extends readonly unknown[],
    Value extends Array[number],
> = number extends Array['length']
    ? number
    : {
          [Key in Keys<ListOf<Value>>]: _IndexOf<Array, ListOf<Value>[Key], 0>
      }[Keys<ListOf<Value>>]

/**
 * creates a tuple type of alternating types
 * @example
 * type Foo = FlattenedTupleOf<[string, number], 3> //[string, number, string, number, string, number]
 */
export type FlattenedTupleOf<T extends unknown[], Length extends number> = Flatten<
    TupleOf<T, Length>
>

export type LengthGreaterThan<Array extends unknown[], Length extends number> = IsGreaterThan<
    Array['length'],
    Length
>

/** removes `DeleteCount` values from `Array` starting at `StartIndex` */
export type Splice<
    Array extends readonly unknown[],
    StartIndex extends number,
    DeleteCount extends number = Subtract<Array['length'], StartIndex>,
    InsertItems extends readonly unknown[] = [],
> = [...Take<Array, StartIndex>, ...InsertItems, ...Take<Array, Add<StartIndex, DeleteCount>, '<-'>]

/** removes the value at index `RemoveIndex` from `Array` */
export type RemoveIndex<
    Array extends readonly unknown[],
    RemoveIndex extends Index<Array>,
> = Splice<Array, RemoveIndex, 1>

type _IndexOfLongestString<
    Strings extends readonly string[],
    CurrentIndex extends number,
    CurrentLongestIndex extends number,
> = Strings[CurrentIndex] extends undefined
    ? CurrentLongestIndex
    : _IndexOfLongestString<
          Strings,
          Increment<CurrentIndex>,
          IsGreaterThan<
              Length<Strings[CurrentIndex]>,
              Length<Strings[CurrentLongestIndex]>
          > extends true
              ? CurrentIndex
              : CurrentLongestIndex
      >

/**
 * gets the index of the longest string type in an array of strings
 * @example
 * type Foo = IndexOfLongestString<['foo', 'barbaz', 'qux']> //1
 */
export type IndexOfLongestString<Strings extends readonly string[]> = Strings extends []
    ? undefined
    : number extends Strings['length']
    ? number
    : _IndexOfLongestString<Strings, 0, 0>

type SortLongestStringsTailRec<Array extends readonly string[], Result extends string[]> = Or<
    Extends<Array, TupleOfUpTo<string, 1>> | Extends<number, Array['length']>
> extends true
    ? [...Result, ...Array]
    : SortLongestStringsTailRec<
          RemoveIndex<Array, IndexOfLongestString<Array>>,
          [...Result, Array[IndexOfLongestString<Array>]]
      >

/** sorts an array of strings by longest to shortest */
export type SortLongestStrings<Array extends readonly string[]> = SortLongestStringsTailRec<
    Array,
    []
>

type _IndexOfHighestNumber<
    Numbers extends readonly number[],
    CurrentIndex extends number,
    CurrentHighestNumberIndex extends number,
> = CurrentIndex extends Numbers['length']
    ? CurrentHighestNumberIndex
    : _IndexOfHighestNumber<
          Numbers,
          Increment<CurrentIndex>,
          IsGreaterThan<Numbers[CurrentIndex], CurrentHighestNumberIndex> extends true
              ? CurrentIndex
              : CurrentHighestNumberIndex
      >

/** gets the index of the largest number in an array type */
export type IndexOfHighestNumber<Numbers extends readonly number[]> = _IndexOfHighestNumber<
    Numbers,
    0,
    0
>

export type RemoveValueTailRec<
    Array extends unknown[],
    Value,
    Result extends unknown[],
> = Array extends []
    ? Result
    : RemoveValueTailRec<
          Tail<Array>,
          Value,
          [...Result, ...(Head<Array> extends Value ? [] : [Head<Array>])]
      >

/**
 * removes types from `Array` that match type `Value`
 * @example
 * type Foo: RemoveValue<['foo', 'bar', 'baz'], 'bar'> //['foo', 'baz']
 */
export type RemoveValue<Array extends unknown[], Value> = RemoveValueTailRec<Array, Value, []>

type SliceCount<
    Array extends readonly unknown[],
    Start extends number,
    PositionFromEnd extends number,
    StartCount extends number,
    EndCount extends number,
> = StartCount extends Start
    ? EndCount extends PositionFromEnd
        ? Array
        : Array extends readonly [...infer Rest, unknown]
        ? SliceCount<Rest, Start, PositionFromEnd, StartCount, Increment<EndCount>>
        : []
    : Array extends readonly [unknown, ...infer Rest]
    ? SliceCount<Rest, Start, PositionFromEnd, Increment<StartCount>, EndCount>
    : Array

type GetPositionFromEnd<
    Array extends readonly unknown[],
    End extends number | undefined,
> = Subtract<Array['length'], End extends undefined ? Array['length'] : End>

/**
 * compiletime version of {@link Array.slice}
 */
export type Slice<
    Array extends readonly unknown[],
    Start extends number,
    End extends number | undefined = undefined,
> = number extends Start | End
    ? Array[number][]
    : GetPositionFromEnd<Array, End> extends never
    ? Array[number][]
    : SliceCount<Array, Start, GetPositionFromEnd<Array, End>, 0, 0>

/** compiletime version of {@link  _.castArray} */
export type CastArray<T> = T extends readonly unknown[] ? T : [T]

/**
 * an array with a specified `Dimension`
 */
export type DimensionArray<T, Dimension extends number> = (
    | T
    | (Dimension extends 0 ? never : DimensionArray<T, Decrement<Dimension>>)
)[]

/**
 * for some reason the ts toolbelt Tail causes a recursion error in the {@link EveryCombination}
 * types so i made this one instead
 */
// TODO: figure out what's up with the ts-toolbelt Tail type, should i just export and use this one everywhere instead?
type Tail2<T extends unknown[]> = number extends T['length'] ? never : Splice<T, 0, 1>

type InsertIntoEachIndexInArray<
    T extends unknown[],
    ToAdd,
    Count extends number,
> = number extends T['length']
    ? never
    : [
          Splice<T, Count, 0, [ToAdd]>,
          ...(Count extends T['length'] ? [] : InsertIntoEachIndexInArray<T, ToAdd, Add<Count, 1>>),
      ]

type AddToCombinations<T extends unknown[][], ToAdd> = T extends []
    ? []
    : [
          ...InsertIntoEachIndexInArray<T[0], ToAdd, 0>,
          ...(Tail2<T> extends infer Narrowed extends unknown[][]
              ? AddToCombinations<Narrowed, ToAdd>
              : never),
      ]

type _EveryCombination<T extends unknown[], Result extends unknown[][] = [[T[0]]]> = T extends []
    ? []
    : T extends [unknown]
    ? Result
    : AddToCombinations<Result, T[1]> extends infer Narrowed extends unknown[][]
    ? _EveryCombination<Tail2<T>, Narrowed>
    : never

/**
 * creates a union type of every possible combination of values in the `T` array type, excluding
 * duplicates.
 *
 * if you want to allow duplicates, do something like `TupleOf<T[number], T['length']>`
 */
export type EveryCombination<T extends unknown[]> = _EveryCombination<T> extends infer Result
    ? Result[number & keyof Result]
    : never
