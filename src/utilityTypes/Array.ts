import { NoUncheckedIndexedAccess } from './misc'

type _BuildPowersOf2LengthArrays<N extends number, R extends never[][]> = R[0][N] extends never
	? R
	: _BuildPowersOf2LengthArrays<N, [[...R[0], ...R[0]], ...R]>

type _ConcatLargestUntilDone<
	N extends number,
	R extends never[][],
	B extends never[]
> = B['length'] extends N
	? B
	: [...R[0], ...B][N] extends never
	? _ConcatLargestUntilDone<
			N,
			R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
			B
	  >
	: _ConcatLargestUntilDone<
			N,
			R extends [R[0], ...infer U] ? (U extends never[][] ? U : never) : never,
			[...R[0], ...B]
	  >

type _Replace<R extends any[], T> = { [K in keyof R]: T }

/**
 * creates an array with a fixed length
 * @example
 * TupleOf<number, 4> //[number, number, number, number]
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787
 */
export type TupleOf<T, N extends number> = number extends N
	? T[]
	: {
			[K in N]: _BuildPowersOf2LengthArrays<K, [[never]]> extends infer U
				? U extends never[][]
					? _Replace<_ConcatLargestUntilDone<K, U, []>, T>
					: never
				: never
	  }[N]

/**
 * an array that can be of any length between 0 and `L`
 * @example
 * declare const foo: TupleOfUpTo<number, 3>
 * foo[0] //number (or number|undefined if `noUncheckedIndexedAccess` is enabled)
 * foo[3] //error: tuple of length '3' has no element at index '3'
 */
export type TupleOfUpTo<T, L extends number> =
	| TupleOf<T, L>
	| (NoUncheckedIndexedAccess extends true ? [] : never)

/**
 * an array of length `L` - 1
 * @example
 * declare const foo: TupleOfExcluding<number, 3>
 * foo[1] //number
 * foo[2] //error: tuple of length '2' has no element at index '2'
 */
//never doesnt work for infers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TupleOfExcluding<T, L extends number> = TupleOf<T, L> extends [any, ...infer R]
	? R
	: never

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
