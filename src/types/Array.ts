import { TupleOf } from 'utility-types'
import { TupleOfUpTo, TupleOfUpToButNotIncluding } from '../utilityTypes'

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
): arr is TupleOf<T, L> & T[] {
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
	//@ts-expect-error TODO: figure this out, pretty sure it works as is tho
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
 * const arrayOfAll = <T>() => <U extends T[]>(
 *  array: U & ([T] extends [U[number]] ? unknown : 'Invalid')
 * ) => array;
 * const arrayOfAllColors = arrayOfAll<Colors>();
 *
 * const missingColors = arrayOfAllColors(['red', 'blue']); // error
 * const goodColors = arrayOfAllColors(['red', 'blue', 'pink']); // compiles
 * const extraColors = arrayOfAllColors(['red', 'blue', 'pink', 'bad']); // error
 * @see https://stackoverflow.com/a/60132060
 */
export function arrayOfAll<T>() {
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

//TODO: remove undefined from return type of findDuplicates & removeDuplicates if noUncheckedIndexedAccess is disabled.
// do something like this to check if the flag is set: `TupleOf<T | undefined extends unknown[][0]? undefined: never, L>`
// but can't do it currently due to https://github.com/microsoft/TypeScript/issues/42471

/**
 * @returns an array of any items that there were duplicates of in the given array (unique)
 * @example
 * findDuplicates([1,1,2,3,3,3]) // [1,3]
 */
export function findDuplicates<T, L extends number>(arr: TupleOf<T, L>): TupleOf<T | undefined, L> {
	return removeDuplicates(
		arr.filter((item) => arr.filter((item2) => item === item2).length > 1)
	) as TupleOf<T | undefined, L>
}

/** removes any duplicated items from an array */
export function removeDuplicates<T, L extends number>(arr: T[]): TupleOf<T | undefined, L> {
	return Array.from(new Set(arr)) as TupleOf<T | undefined, L>
}
