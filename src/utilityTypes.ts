import { Primitive, TupleOf } from 'utility-types'

/**
 * the compiler sees this as `undefined` if `noUncheckedIndexedAccess` is enabled, and `never` if it's not.
 * used by {@link NoUncheckedIndexedAccess}
 */
//TODO: figure out a way to do this without stuff existing at runtime
const indexedAccessCheck = ([] as never[])[0]

/**
 * `true` if `noUncheckedIndexedAccess` is set, else `false`. useful when creating types that need to behave differently
 * based on this compiler option
 */
export type NoUncheckedIndexedAccess = undefined extends typeof indexedAccessCheck ? true : false

/**
 * an array that can be of any length between 0 and `L`
 * @example
 * declare const foo: TupleOfUpTo<number, 3>
 * foo[0] //number (or number|undefined if `noUncheckedIndexedAccess` is enabled)
 * foo[3] //error: tuple of length '3' has no element at index '3'
 */
//TODO: figure out a more accurate way of doing this, as (T|undefined)[] isn't the exact same as T[] with noUncheckedIndexedAccess
export type TupleOfUpTo<T, L extends number> = TupleOf<NoUncheckedIndexedAccess extends true ? T | undefined : T, L>

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
	? ((t: T, ...a: A) => void) extends (...x: infer X) => void
		? X
		: never
	: never

type EnumerateInternal<A extends Array<unknown>, N extends number> = N extends A['length']
	? A
	: EnumerateInternal<PrependNextNum<A>, N>

/**
 * creates a union type of numbers from 0 to generic `N`
 *
 * @example
 * type Foo = Enumerate<3> //0|1|2
 * @see https://stackoverflow.com/a/63918062
 */
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never

/**
 * creates a range type of numbers from generics `FROM` (inclusive) to `TO` (inclusive)
 *
 * @example
 * type Foo = Range<2, 5> //2|3|4|5
 * @see https://stackoverflow.com/a/63918062
 */
export type Range<FROM extends number, TO extends number> =
	Exclude<Enumerate<TO>, Enumerate<FROM>> | TO

/**
 * creates a stringified version of `T`
 * @example
 * type Foo = ToString<1|2> //'1'|'2'
 */
export type ToString<T extends Exclude<Primitive, symbol>> = `${T}`
