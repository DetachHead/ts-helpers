import { FixedSizeArray } from '../utilityTypes'

/**
 * checks whether the given array's length is larger than the given number, and narrows the type of the array to that
 * length. useful when using the `noUncheckedIndexedAccess` compiler option
 * @example
 *   declare const foo: string[]
 *   const bar: string = foo[0] //Type 'string | undefined' is not assignable to type 'string'
 *   if (lengthGreaterThan(foo, 3)) {
 *      const a: string = foo[0] //no error
 *      const b: string = foo[2] //no error
 *      const c: string = foo[3] //Type 'string | undefined' is not assignable to type 'string'
 *  }
 */
export function lengthGreaterThan<T, L extends number>(arr: Readonly<T[]>, length: L): arr is FixedSizeArray<T, L> {
	return arr.length >= length
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
