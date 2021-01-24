import { Primitive } from 'utility-types'

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
