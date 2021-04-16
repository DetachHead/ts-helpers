import {
	IndexOf,
	TupleOf,
	TupleOfAtLeast,
	TupleOfUpTo,
	TupleOfUpToButNotIncluding,
} from '../utilityTypes/Array'
import { Narrow } from 'ts-toolbelt/out/Function/Narrow'
import { Flatten } from 'ts-toolbelt/out/List/Flatten'

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
export function lengthGreaterOrEqual<T, L extends number>(
	arr: Readonly<T[]>,
	length: L
): arr is TupleOfAtLeast<T, L> {
	return arr.length >= length
}

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
export function lengthGreaterThan<T, L extends number>(
	arr: Readonly<T[]>,
	length: L
): arr is [...TupleOf<T, L>, T] & T[] {
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
export function lengthLessOrEqual<T, L extends number>(
	arr: Readonly<T[]>,
	length: L
): arr is TupleOfUpTo<T, L> {
	return arr.length <= length
}

export function lengthLessThan<T, L extends number>(
	arr: Readonly<T[]>,
	length: L
): arr is TupleOfUpToButNotIncluding<T, L> {
	return arr.length < length
}

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
export function lengthIs<T, L extends number>(arr: Readonly<T[]>, length: L): arr is TupleOf<T, L> {
	return arr.length === length
}

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
export function arrayOfAll<T>() {
	// don't think it's possible to get the return type from this scope, as this wrapper function is a workaround to create
	// types where the value needs to be checked against the generic
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	return <U extends T[]>(array: U & ([T] extends [U[number]] ? unknown : never)) => array
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
export async function findNotUndefined<T extends {}, R>(
	arr: T[],
	callback: (it: T) => R | void
): Promise<[R, number] | undefined> {
	for (let index = 0; index < arr.length; index++) {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const value = arr[index]!
		const result = await callback(value)
		if (result) return [result, index]
	}
	return
}

/**
 * checks whether an array contains any duplicates
 */
export function containsDuplicates(arr: unknown[]): boolean {
	return new Set(arr).size !== arr.length
}

/**
 * @returns an array of any items that there were duplicates of in the given array (unique)
 * @example
 * findDuplicates([1,1,2,3,3,3]) // [1,3]
 */
export function findDuplicates<T, L extends number>(arr: TupleOf<T, L>): TupleOfUpTo<T, L> {
	return removeDuplicates(arr.filter((item) => arr.filter((item2) => item === item2).length > 1))
}

/** removes any duplicated items from an array */
export function removeDuplicates<T, L extends number>(arr: T[]): TupleOfUpTo<T, L> {
	return Array.from(new Set(arr)) as TupleOfUpTo<T, L>
}

/**
 * concatenates two arrays while keeping track of their length
 */
export function concat<A1 extends readonly unknown[], A2 extends readonly unknown[]>(
	array1: Narrow<A1>,
	array2: Narrow<A2>
): [...A1, ...A2] {
	return array1.concat(
		// @ts-expect-error some wack error caused by the Narrow type, but it's the same type anyway so this is a false positive
		array2
	) as never
}

/**
 * {@link Array.prototype.indexOf} but it uses {@link IndexOf} such that the result can be known at compiletime
 */
export function indexOf<Array extends readonly unknown[], Value extends Array[number]>(
	array: Narrow<Array>,
	value: Narrow<Value>
): IndexOf<Array, Value> {
	return array.indexOf(
		// @ts-expect-error some wack error caused by the Narrow type, but it's the same type anyway so this is a false positive
		value
	) as never
}

/**
 * {@link Array.prototype.flat} but it uses {@link Flatten} such that the result can be known at compiletime
 */
export function flat<Array extends readonly unknown[], Depth extends number = 1>(
	array: Narrow<Array>,
	depth?: Depth
): Flatten<Array, 1, Depth> {
	return array.flat(depth) as never
}
