import { findAsync } from '../functions/Iterable'
import {
    CastArray,
    IndexOf,
    IndexOfLongestString,
    Slice,
    SortLongestStrings,
    Splice,
    TupleOf,
    TupleOfAtLeast,
    TupleOfUpTo,
    TupleOfUpToButNotIncluding,
} from '../types/Array'
import { Enumerate } from '../types/Number'
import { FindResult } from '../types/_internal'
import { Keys } from '../types/misc'
import { isNullOrUndefined } from './misc'
import { castArray as lodashCastArray, orderBy } from 'lodash'
import { Throw } from 'throw-expression'
import { isDefined } from 'ts-is-present'
import { Flatten } from 'ts-toolbelt/out/List/Flatten'
import { MaybePromise, NonNil } from 'tsdef'

/**
 * checks whether the given array's length is larger than **or equal to** the given number, and narrows the type of the
 * array to that length. useful when using the `noUncheckedIndexedAccess` compiler option
 * @example
 *   declare const foo: string[]
 *   const bar: string = foo[0] //Type 'string | undefined' is not assignable to type 'string'
 *   if (lengthGreaterOrEqual(foo, 3)) {
 *      const a: string = foo[0] //no error
 *      const b: string = foo[2] //no error
 *      const c: string = foo[3] //Type 'string | undefined' is not assignable to type 'string'
 *  }
 */
export const lengthGreaterOrEqual = <T, L extends number>(
    arr: Readonly<T[]>,
    length: L,
): arr is TupleOfAtLeast<T, L> => arr.length >= length

/**
 * checks whether the given array's length is larger than the given number, and narrows the type of the array to that
 * length. useful when using the `noUncheckedIndexedAccess` compiler option
 * @example
 *   declare const foo: string[]
 *   const bar: string = foo[0] //Type 'string | undefined' is not assignable to type 'string'
 *   if (lengthGreaterThan(foo, 3)) {
 *      const a: string = foo[0] //no error
 *      const b: string = foo[3] //no error
 *      const c: string = foo[4] //Type 'string | undefined' is not assignable to type 'string'
 *  }
 */
export const lengthGreaterThan = <T, L extends number>(
    arr: Readonly<T[]>,
    length: L,
): arr is [...TupleOf<T, L>, T] & T[] => {
    return arr.length > length
}

/**
 * checks whether the given array's length is less than **or equal to** the given number, and narrows the type of the
 * array to that length. useful when using the `noUncheckedIndexedAccess` compiler option
 * @example
 *   declare const foo: string[]
 *   const bar: string = foo[0] //Type 'string | undefined' is not assignable to type 'string'
 *   if (lengthLessOrEqual(foo, 3)) {
 *      const a: string = foo[0] //string | undefined'
 *      const b: string = foo[2] //string | undefined'
 *      const c: string = foo[3] //error: tuple of length '3' has no element at index '3'
 *  }
 */
export const lengthLessOrEqual = <T, L extends number>(
    arr: Readonly<T[]>,
    length: L,
): arr is TupleOfUpTo<T, L> => arr.length <= length

export const lengthLessThan = <T, L extends number>(
    arr: Readonly<T[]>,
    length: L,
): arr is TupleOfUpToButNotIncluding<T, L> => arr.length < length

/**
 * checks whether the given array's length is equal to the given number, and narrows the type of the array to that
 * length. useful when using the `noUncheckedIndexedAccess` compiler option
 * @example
 *   declare const foo: string[]
 *   const bar: string = foo[0] //Type 'string | undefined' is not assignable to type 'string'
 *   if (lengthIs(foo, 3)) {
 *      const a: string = foo[0] //no error
 *      const c: string = foo[2] //Tuple type '[string, string, string]' of length '3' has no element at index '3'.
 *  }
 */
export const lengthIs = <T, L extends number>(
    arr: Readonly<T[]>,
    length: L,
): arr is TupleOf<T, L> => arr.length === length

/**
 * creates a function that checks that the given array contains all elements in the union `T`
 * @example
 * type Colors = 'red' | 'blue' | 'pink';
 * const arrayOfAllColors = arrayOfAll<Colors>();
 *
 * const missingColors = arrayOfAllColors(['red', 'blue']); // error
 * const goodColors = arrayOfAllColors(['red', 'blue', 'pink']); // compiles
 * const extraColors = arrayOfAllColors(['red', 'blue', 'pink', 'bad']); // error
 * @see https://stackoverflow.com/a/60132060
 */
export const arrayOfAll = <T>() => {
    return <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : never)): U => array
}

/**
 * like {@link Array.prototype.map} but for promises where you want to execute the callback one at a time.
 * preserves the length of the array at compiletime
 */
export const mapAsync = async <const T extends readonly unknown[], Result>(
    arr: T,
    callbackfn: (value: T[number], index: number, array: T) => Promise<Result>,
): Promise<TupleOf<Result, T['length']>> => {
    const result: Result[] = []
    // eslint-disable-next-line @typescript-eslint/no-for-in-array -- can't use forEach because of the await
    for (const indexStr in arr) {
        const index = Number(indexStr)
        result.push(
            await callbackfn(
                arr[index],
                index,
                // need to cast due to Narrow type
                arr,
            ),
        )
    }
    return result as never
}

/**
 * the return type of {@link findNotUndefined} and {@link findNotUndefinedAsync} when a callback is not provided
 *
 * ie. guaranteed to not be `undefined` or `null` if a result was found
 */
type FindNotUndefinedResult<T> =
    | Exclude<FindResult<NonNil<Awaited<T>>>, undefined>
    | (undefined extends Awaited<T> ? undefined : null extends Awaited<T> ? undefined : never)

// TODO: narrow the arrays so these functions work with compiletime array literals
/**
 * finds the first item in an array where the given callback doesn't return `null` or `undefined`
 * @param arr the array of `T`s to check
 * @param runAtTheSameTime whether to execute the `callback` on each element of `arr` at the same time
 * @param callback a function to run on `arr` that may return `null` or `undefined`.
 */
export const findNotUndefinedAsync: {
    <T extends unknown[]>(
        arr: T,
        runAtTheSameTime: boolean,
        callback: (it: T[number]) => Promise<unknown>,
    ): Promise<FindResult<T[number]>>
    <T extends unknown[]>(arr: T, runAtTheSameTime: boolean): Promise<
        FindNotUndefinedResult<T[number]>
    >
} = async <T extends unknown[]>(
    arr: T,
    runAtTheSameTime: boolean,
    callback: (it: T[number]) => Promise<unknown> = (value) => Promise.resolve(value),
): Promise<FindResult<T[number]>> => {
    if (runAtTheSameTime) {
        return find(arr, async (value) => !isNullOrUndefined(await callback(value))) as never
    }
    // hack so the compiler knows index is within the range of arr
    for (let index: Keys<T> = 0 as never; index < arr.length; (index as number)++) {
        const value = arr[index]
        const result = await callback(value)
        if (result) return { result, index } as never
    }
    return
}
/**
 * finds the first item in an array where the given callback doesn't return `null` or `undefined`
 * @param arr the array of `T`s to check
 * @param callback a function to run on `arr` that may return `null` or `undefined`.
 */
export const findNotUndefined: {
    <T extends unknown[]>(arr: T, callback: (it: T[number]) => unknown): FindResult<T[number]>
    <T extends unknown[]>(arr: T): FindNotUndefinedResult<T[number]>
} = <T extends unknown[]>(
    arr: T,
    callback: (it: T[number]) => unknown = (value) => value,
): FindResult<T[number]> => {
    // hack so the compiler knows index is within the range of arr
    for (let index: Keys<T> = 0 as never; index < arr.length; (index as number)++) {
        const value = arr[index]
        const result = callback(value)
        if (!isNullOrUndefined(result)) return { result, index } as never
    }
    return
}

/**
 * checks whether an array contains any duplicates
 */
export const containsDuplicates = (arr: unknown[]): boolean => new Set(arr).size !== arr.length

/** removes any duplicated items from an array */
export const removeDuplicates = <T, L extends number>(arr: T[]): TupleOfUpTo<T, L> =>
    Array.from(new Set(arr)) as TupleOfUpTo<T, L>

/**
 * @returns an array of any items that there were duplicates of in the given array (unique)
 * @example
 * findDuplicates([1,1,2,3,3,3]) // [1,3]
 */
export const findDuplicates = <T, L extends number>(arr: TupleOf<T, L>): TupleOfUpTo<T, L> =>
    removeDuplicates<T, L>(arr.filter((item) => arr.filter((item2) => item === item2).length > 1))

/**
 * concatenates two arrays while keeping track of their length
 */
export const concat = <const A1 extends readonly unknown[], const A2 extends readonly unknown[]>(
    array1: A1,
    array2: A2,
): [...A1, ...A2] => array1.concat(array2) as never

/**
 * {@link Array.prototype.indexOf} but it uses {@link IndexOf} such that the result can be known at compiletime
 */
export const indexOf = <const Array extends readonly unknown[], const Value extends Array[number]>(
    array: Array,
    value: Value,
): IndexOf<Array, Value> => array.indexOf(value) as never

/**
 * {@link Array.prototype.flat} but it uses {@link Flatten} such that the result can be known at compiletime
 */
export const flat = <const Array extends readonly unknown[], Depth extends number = 1>(
    array: Array,
    depth?: Depth,
): Flatten<Array, 1, Depth> => array.flat(depth) as never

/** removes `deleteCount` values from `array` starting at `startIndex` */
export const splice = <
    const Array extends readonly unknown[],
    StartIndex extends number,
    DeleteCount extends number,
    const InsertItems extends readonly unknown[],
>(
    array: Array,
    startIndex: StartIndex,
    deleteCount: DeleteCount,
    ...insertItems: InsertItems
): Splice<Array, StartIndex, DeleteCount, InsertItems> =>
    array.toSpliced(startIndex, deleteCount, ...insertItems) as Splice<
        Array,
        StartIndex,
        DeleteCount,
        InsertItems
    >

/**
 * runs the given `predicate` on each value in the given `array`, and returns the index of the first value in the `array`
 * that returned the highest number
 * @param array the values to execute `predicate` on
 * @param predicate the callback to execute on each value in the `array`
 * @example
 * const foo = findIndexWithHighestNumber(['foo', 'barbaz', 'qux'], value => value.length) //1
 */
export const findIndexWithHighestNumber = <const T extends readonly unknown[]>(
    array: T,
    predicate: (value: T[number]) => number,
): T extends readonly [] ? undefined : number => {
    if (lengthIs(array, 0)) return undefined as never
    let highestNumber = 0
    let result = 0
    array.forEach((value, index) => {
        const newNumber = predicate(value)
        if (newNumber > highestNumber) {
            highestNumber = newNumber
            result = index
        }
    })
    return result as never
}

export const indexOfLongestString = <const Strings extends readonly string[]>(
    strings: Strings,
): IndexOfLongestString<Strings> =>
    findIndexWithHighestNumber(strings, (string) => string.length) as never

/** sorts an array of strings by longest to shortest */
export const sortByLongestStrings: <const Strings extends readonly string[]>(
    strings: Strings,
) => SortLongestStrings<Strings> = (strings) => orderBy(strings, 'length', 'desc') as never

/**
 * removes any `undefined` values from `array` before mapping over them and returning the mapped array with no
 * undefined or null values
 */
export const mapNotUndefined = <T, R>(array: (T | undefined)[], callback: (value: T) => R): R =>
    array.filter(isDefined).map(callback) as never

/**
 * {@link Array.slice} using {@link Slice} so the result can be known at compiletime
 */
export const slice = <
    const Array extends readonly unknown[],
    Start extends number,
    End extends number | undefined = undefined,
>(
    array: Array,
    start: Start,
    end?: End,
): Slice<Array, Start, End> => array.slice(start, end) as never

/**
 * {@link Array.prototype.forEach} on steroids™.
 * * preserves the length if known at compiletime, allowing you to use the index to access other items in the array when
 * the `noUncheckedIndexedAccess` compiler flag is enabled without it being possibly `undefined`
 * * `previous` and `next` functions are available in the callback to allow for easy access of the previous and next item
 * @example
 * const numbers = [1,2,3,4]
 * forEach(numbers, (num, index, prev, next) => {
 *     if (index !== 0)
 *         const foo = prev() // 1 | 2 | 3
 * }
 */
export const forEach = <const T extends ReadonlyArray<unknown>>(
    items: T,
    callback: (
        value: T[number],
        index: Enumerate<T['length']>,
        previous: () => T[number],
        next: () => T[number],
    ) => void,
): void => void map<T, void>(items, callback)

/**
 * {@link Array.prototype.map} on steroids™.
 * * preserves the length if known at compiletime, allowing you to use the index to access other items in the array
 *   when and use the values in teh resulting array when the `noUncheckedIndexedAccess` compiler flag is enabled without
 *   it being possibly `undefined`
 * * `previous` and `next` functions are available in the callback to allow for easy access of the previous and next item
 * @example
 * const numbers = [1,2,3,4]
 * forEach(numbers, (num, index, prev, next) => {
 *     if (index !== 0)
 *         const foo = prev() // 1 | 2 | 3
 * }
 */
export const map = <const T extends ReadonlyArray<unknown>, R>(
    items: T,
    callback: (
        value: T[number],
        index: Enumerate<T['length']>,
        previous: () => T[number],
        next: () => T[number],
    ) => R,
): TupleOf<R, T['length']> => {
    let currentIndex = -1
    const previous = () => items[currentIndex - 1]
    const next = () => items[currentIndex + 1]
    return items.map((item, index) => {
        currentIndex++
        return callback(item, index as never, previous, next)
    }) as never
}

/** {@link lodashCastArray} but the type is known at compiletime */
export const castArray = <const T>(value: T): CastArray<T> => lodashCastArray(value) as never

/**
 * like {@link Array.prototype.find} but works properly with promises. it still executes the `predicate`s at the same
 * time though and returns on the first promise that resolves with `true`.
 *
 * if you want them to run one at a time, use {@link findAsync}
 */
export const find = async <T extends unknown[]>(
    arr: T,
    predicate: (value: T[number]) => MaybePromise<boolean>,
): Promise<FindResult<T[number]>> => {
    try {
        return await Promise.any(
            arr.map(async (value, index) =>
                (await predicate(value))
                    ? { result: value, index }
                    : Throw(
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions -- dont care
                          `predicate returned false for value: ${value}`,
                      ),
            ),
        )
    } catch (e) {
        if (e instanceof AggregateError) {
            return undefined
        }
        throw e
    }
}
