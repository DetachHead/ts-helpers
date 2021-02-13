import { Primitive, TupleOf } from 'utility-types'

/**
 * checks if two types are equal
 */
export type Equals<A, B> = A extends B ? (B extends A ? true : false) : false

/**
 * the compiler sees this as `undefined` if `noUncheckedIndexedAccess` is enabled, and `never` if it's not.
 * used by {@link NoUncheckedIndexedAccess}
 */
//TODO: figure out a way to do this without stuff existing at runtime
const _indexedAccessCheck = ([] as never[])[0]

/**
 * `true` if `noUncheckedIndexedAccess` is set, else `false`. useful when creating types that need to behave differently
 * based on this compiler option
 */
export type NoUncheckedIndexedAccess = undefined extends typeof _indexedAccessCheck ? true : false

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

type _PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
	? ((t: T, ...a: A) => void) extends (...x: infer X) => void
		? X
		: never
	: never

type _Enumerate<A extends Array<unknown>, N extends number> = N extends A['length']
	? A
	: _Enumerate<_PrependNextNum<A>, N>

/**
 * creates a union type of numbers from 0 to generic `N`
 *
 * @example
 * type Foo = Enumerate<3> //0|1|2
 * @see https://stackoverflow.com/a/63918062
 */
export type Enumerate<N extends number> = _Enumerate<[], N> extends (infer E)[] ? E : never

/**
 * creates a range type of numbers from generics `FROM` (inclusive) to `TO` (inclusive)
 *
 * @example
 * type Foo = Range<2, 5> //2|3|4|5
 * @see https://stackoverflow.com/a/63918062
 */
export type Range<FROM extends number, TO extends number> =
	| Exclude<Enumerate<TO>, Enumerate<FROM>>
	| TO

/**
 * creates a stringified version of `T`
 * @example
 * type Foo = ToString<1|2> //'1'|'2'
 */
export type ToString<T extends Exclude<Primitive, symbol>> = `${T}`

/**
 * a URI that starts with the given `Protocol`
 * @example
 * const foo: UriString<'http'> = 'foo' //error
 * const bar: UriString<'http'> = 'http://foo.com' //no error
 */
export type UriString<Protocol extends string = string> = `${Protocol}://${string}`

/**
 * a URL with either the http or https protocol.
 * @example
 * const foo: UrlString = 'foo://bar' //error
 * const bar: UrlString = 'http://foo' //no error
 */
export type UrlString = UriString<'http' | 'https'>

/**
 * duplicates a string a given number of times
 * @example
 * type Foo = DuplicateString<'foo', 3> //'foofoofoo'
 */
export type DuplicateString<T extends string, N extends number> = N extends 1
	? T
	: `${T}${N extends 1 ? '' : DuplicateString<T, Subtract<N, 1>>}`

//TODO: figure out a way to make Add and Subtract work with negative numbers

/**
 * adds two `number` types together
 *
 * **WARNING:** for some reason the compiler sometimes thinks this isn't a valid number when passing it into other
 * utility types. as far as i can tell this is a false positive, and the types still behave as expected if you suppress
 * the error with @ts-expect-error
 * @example
 * type Foo = Add<2, 3> //5
 */
export type Add<N1 extends number, N2 extends number> = [
	...TupleOf<never, N1>,
	...TupleOf<never, N2>
]['length']

/**
 * subtracts `N2` from `N1`
 * @example
 * type Foo = Subtract<5, 2> //3
 */
export type Subtract<N1 extends number, N2 extends number> = TupleOf<never, N1> extends [
		...TupleOf<never, N2>,
		...infer R
	]
	? R['length']
	: never

//TODO: figure out how to do Multiply and Divide logarithmically like TupleOf so it doesn't fail on numbers > 40

type _MultiAdd<Number extends number,
	Accumulator extends number,
	IterationsLeft extends number> = IterationsLeft extends 0
	? Accumulator
	: //@ts-expect-error see documentation for Add type
	_MultiAdd<Number, Add<Number, Accumulator>, Subtract<IterationsLeft, 1>>

/**
 * multiplies `N1` by `N2`
 *
 * **WARNING**: currently fails on big numbers
 * @example
 * type Foo = Multiply<2, 3> //6
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Multiply<N1 extends number, N2 extends number> = _MultiAdd<N1, 0, N2>

type _AtTerminus<A extends number, B extends number> = A extends 0
	? true
	: B extends 0
		? true
		: false

type _LT<A extends number, B extends number> = _AtTerminus<A, B> extends true
	? Equals<A, B> extends true
		? false
		: A extends 0
			? true
			: false
	: _LT<Subtract<A, 1>, Subtract<B, 1>>

type _MultiSub<N extends number, D extends number, Q extends number> = _LT<N, D> extends true
	? Q
	: //@ts-expect-error see documentation for Add type
	_MultiSub<Subtract<N, D>, D, Add<Q, 1>>

/**
 * divides `N1` by `N2`
 *
 * **WARNING**: currently fails on big numbers
 * @example
 * type Foo = Divide<6, 3> //2
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Divide<N1 extends number, N2 extends number> = _MultiSub<N1, N2, 0>

/**
 * gets the remainder of `Divide<N1, N2>`
 * @example
 * type Foo = Modulo<7, 4> //3
 * @see https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
 */
export type Modulo<N1 extends number, N2 extends number> = _LT<N1, N2> extends true
	? N1
	: Modulo<Subtract<N1, N2>, N2>
