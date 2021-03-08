import { NoUncheckedIndexedAccess } from './misc'
import { Decrement } from './Number'

type _BuildPowersOf2LengthArrays<
	Length extends number,
	AccumulatedArray extends never[][]
> = AccumulatedArray[0][Length] extends never
	? AccumulatedArray
	: _BuildPowersOf2LengthArrays<
			Length,
			[[...AccumulatedArray[0], ...AccumulatedArray[0]], ...AccumulatedArray]
	  >

type _ConcatLargestUntilDone<
	Length extends number,
	AccumulatedArray extends never[][],
	NextArray extends never[]
> = NextArray['length'] extends Length
	? NextArray
	: [...AccumulatedArray[0], ...NextArray][Length] extends never
	? _ConcatLargestUntilDone<
			Length,
			AccumulatedArray extends [AccumulatedArray[0], ...infer U]
				? U extends never[][]
					? U
					: never
				: never,
			NextArray
	  >
	: _ConcatLargestUntilDone<
			Length,
			AccumulatedArray extends [AccumulatedArray[0], ...infer U]
				? U extends never[][]
					? U
					: never
				: never,
			[...AccumulatedArray[0], ...NextArray]
	  >

type _Replace<R extends any[], T> = { [K in keyof R]: T }

/**
 * creates an array with a fixed length
 * @example
 * TupleOf<number, 4> //[number, number, number, number]
 * @see https://github.com/microsoft/TypeScript/issues/26223#issuecomment-674514787
 */
export type TupleOf<Type, Length extends number> = number extends Length
	? Type[]
	: {
			//in case Length is a tuple
			[LengthKey in Length]: _BuildPowersOf2LengthArrays<
				LengthKey,
				[[never]]
			> extends infer TwoDimensionalArray
				? TwoDimensionalArray extends never[][]
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
//TODO: make the length property return a range type of all the possible lengths without breaking its ability to work on huge numbers
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
