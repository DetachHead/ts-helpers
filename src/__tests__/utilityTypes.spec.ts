import { TupleOfUpTo, UriString, UrlString } from '../utilityTypes'

describe('array types', () => {
	test('TupleOfUpTo', () => {
		//TODO: figure out how to test with `noUncheckedIndexedAccess` on and off
		const foo = [1, 1, 1] as TupleOfUpTo<number, 3>
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType number | undefined
		//@ts-expect-error array is guaranteed to not have a number at index 3
		// noinspection BadExpressionStatementJS
		foo[3]
	})
})

describe('template literal types', () => {
	test('UriString', () => {
		//@ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
		testType<UriString>('asdf')
		testType<UriString>('asdf://asdf.com')
		//@ts-expect-error TS2345: Argument of type '"asdf://asdf.com"' is not assignable to parameter of type '`foo://${string}`'.
		testType<UriString<'foo'>>('asdf://asdf.com')
	})
	test('UrlString', () => {
		//@ts-expect-error TS2345: Argument of type '"asdf"' is not assignable to parameter of type '`${string}://${string}`'.
		testType<UrlString>('asdf')
		testType<UrlString>('https://asdf.com')
	})
})

// TODO: find a type testing library that doesnt fucking suck
// eslint-disable-next-line @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars
function testType<T>(_value: T) {}
