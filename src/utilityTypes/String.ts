import { Primitive } from 'utility-types'
import { Add, Subtract } from './Number'

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

/**
 * anything that can be represented as a string (ie. has a {@link toString} method)
 */
export interface Stringable {
	toString: () => string
}

/**
 * gets the first character in a string
 */
export type FirstChar<String extends string> = String extends `${infer R}${string}` ? R : never

type _TrimStart<
	String extends string,
	Index extends number,
	Iterator extends number
> = Iterator extends Index
	? String
	: //@ts-expect-error see documentation for Add type
	  _TrimStart<String extends `${FirstChar<String>}${infer R}` ? R : never, Index, Add<Iterator, 1>>

/**
 * trims the characters up to `Index` off the start of `String` (inclusive)
 *
 * **WARNING:** the compiler sometimes throws TS2321: Excessive stack depth, but it seems to still work as long as you
 * suppress the error with @ts-expect-error
 * @example
 * type Foo = TrimStart<'foobar', 2> //'bar'
 */
export type TrimStart<String extends string, Index extends number> = _TrimStart<String, Index, 0>

/**
 * trims the characters past `Index` off the end of `String` (exclusive)
 * @example
 * type Foo = TrimEnd<'foobar', 2> //'foo'
 */
export type TrimEnd<String extends string, Index extends number> = Substring<String, 0, Index>

/**
 * gets the characters of `String` between `StartIndex` (inclusive) and `EndIndex` (exclusive)
 */
export type Substring<String extends string, StartIndex extends number, EndIndex extends number> =
	// @ts-expect-error see TrimStart documentation
	TrimStart<String, StartIndex> extends `${infer R}${TrimStart<String, EndIndex>}` ? R : never

export type CharAt<String extends string, Index extends number> =
	// @ts-expect-error see TrimStart documentation
	FirstChar<TrimStart<String, Index>>