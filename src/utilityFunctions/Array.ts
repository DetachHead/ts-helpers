import {
    IndexOf,
    IndexOfLongestString,
    Slice,
    SortLongestStrings,
    Splice,
    TupleOf,
    TupleOfAtLeast,
    TupleOfUpTo,
    TupleOfUpToButNotIncluding,
} from '../utilityTypes/Array'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import { Flatten } from 'ts-toolbelt/out/List/Flatten'
import { orderBy } from 'lodash'
import { isDefined } from 'ts-is-present'
import { Enumerate } from '../utilityTypes/Number'
import { Keys } from '../utilityTypes/Any'

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
 * finds the first item in an array where the given callback doesn't return `null` or `undefined`
 * @param arr the array of `T`s to check
 * @param callback the function to run on `arr` that may return `null` or `undefined`
 * @returns
 * index 0: the result of the first `callback` that didn't return `undefined` or `null`
 *
 * index 1: the index in `arr` where that result occurred
 */
export const findNotUndefined = async <T extends {}[], R>(
    arr: T,
    callback: (it: T[number]) => R | void,
): Promise<[R, number] | undefined> => {
    // hack so the compiler knows index is within the range of arr
    for (let index: Keys<T> = 0 as never; index < arr.length; (index as number)++) {
        const value = arr[index]
        const result = await callback(value)
        if (result) return [result, index]
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
    removeDuplicates(arr.filter((item) => arr.filter((item2) => item === item2).length > 1))

/**
 * concatenates two arrays while keeping track of their length
 */
export const concat = <A1 extends readonly unknown[], A2 extends readonly unknown[]>(
    array1: Narrow<A1>,
    array2: Narrow<A2>,
): [...A1, ...A2] =>
    array1.concat(
        // @ts-expect-error some wack error caused by the Narrow type, but it's the same type anyway so this is a false positive
        array2,
    ) as never

/**
 * {@link Array.prototype.indexOf} but it uses {@link IndexOf} such that the result can be known at compiletime
 */
export const indexOf = <Array extends readonly unknown[], Value extends Array[number]>(
    array: Narrow<Array>,
    value: Narrow<Value>,
): IndexOf<Array, Value> =>
    array.indexOf(
        // @ts-expect-error some wack error caused by the Narrow type, but it's the same type anyway so this is a false positive
        value,
    ) as never

/**
 * {@link Array.prototype.flat} but it uses {@link Flatten} such that the result can be known at compiletime
 */
export const flat = <Array extends readonly unknown[], Depth extends number = 1>(
    array: Narrow<Array>,
    depth?: Depth,
): Flatten<Array, 1, Depth> => array.flat(depth) as never

/** removes `deleteCount` values from `array` starting at `startIndex` */
export const splice = <
    Array extends unknown[],
    StartIndex extends number,
    DeleteCount extends number
>(
    array: Narrow<Array>,
    startIndex: StartIndex,
    deleteCount: DeleteCount,
): Splice<Array, StartIndex, DeleteCount> =>
    array.filter((_, index) => index < startIndex || index > deleteCount + 1) as never

/**
 * runs the given `predicate` on each value in the given `array`, and returns the index of the first value in the `array`
 * that returned the highest number
 * @param array the values to execute `predicate` on
 * @param predicate the callback to execute on each value in the `array`
 * @example
 * const foo = findIndexWithHighestNumber(['foo', 'barbaz', 'qux'], value => value.length) //1
 */
export const findIndexWithHighestNumber = <T extends unknown[]>(
    array: Narrow<T>,
    predicate: (value: T[number]) => number,
): T extends [] ? undefined : number => {
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

export const indexOfLongestString = <Strings extends string[]>(
    strings: Narrow<Strings>,
): IndexOfLongestString<Strings> =>
    findIndexWithHighestNumber(strings, (string) => string.length) as never

/** sorts an array of strings by longest to shortest */
export const sortByLongestStrings = <Strings extends string[]>(
    strings: Narrow<Strings>,
): SortLongestStrings<Strings> => orderBy(strings, 'length', 'desc') as never

/**
 * removes any `undefined` values from `array` before maooiung over them and returning the mappved array with no
 * undefined or null values
 */
export const mapNotUndefined = <T, R>(array: (T | undefined)[], callback: (value: T) => R): R =>
    array.filter(isDefined).map(callback) as never

/**
 * {@link Array.slice} using {@link Slice} so the result can be known at compiletime
 */
export const slice = <
    Array extends unknown[],
    Start extends number,
    End extends number = Array['length']
>(
    array: Narrow<Array>,
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
 * @param items
 * @param callback
 */
export const forEach = <T extends ReadonlyArray<unknown>>(
    items: Narrow<T>,
    callback: (
        value: T[number],
        index: Enumerate<T['length']>,
        previous: () => T[number],
        next: () => T[number],
    ) => void,
): void => {
    let currentIndex = -1
    const previous = () => items[currentIndex - 1]
    const next = () => items[currentIndex + 1]
    items.forEach((item, index) => {
        currentIndex++
        callback(item, index as never, previous, next)
    })
}
