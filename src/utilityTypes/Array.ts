import { TupleOf } from 'utility-types'
import { NoUncheckedIndexedAccess } from './misc'

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
