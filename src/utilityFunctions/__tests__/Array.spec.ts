import {
	concat,
	containsDuplicates,
	findDuplicates,
	indexOf,
	lengthGreaterOrEqual,
	lengthGreaterThan,
	lengthIs,
	lengthLessOrEqual,
	lengthLessThan,
	removeDuplicates,
} from '../Array'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('lengthGreaterOrEqual', () => {
	const foo: string[] = []
	// noinspection BadExpressionStatementJS
	foo[0] // $ExpectType string | undefined
	if (lengthGreaterOrEqual(foo, 3)) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[2] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[3] // $ExpectType string | undefined
		// noinspection BadExpressionStatementJS
		foo[4] // $ExpectType string | undefined
	}
})

test('lengthGreaterThan', () => {
	const foo: string[] = []
	// noinspection BadExpressionStatementJS
	foo[0] // $ExpectType string | undefined
	if (lengthGreaterThan(foo, 3)) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[2] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[3] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[4] // $ExpectType string | undefined
	}
})

//TODO: figure out how to cast it like `lengthGreaterThan` in the else branh on `lengthLessOrEqual` and `lengthLessThan`

test('lengthLessOrEqual', () => {
	const foo: string[] = []
	if (lengthLessOrEqual(foo, 3)) {
		// noinspection BadExpressionStatementJS
		foo
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string | undefined
		// noinspection BadExpressionStatementJS
		foo[2] // $ExpectType string | undefined
		//@ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '4'.
		// noinspection BadExpressionStatementJS
		foo[4] //error: tuple of length '3' has no element at index '3'
	}
})

test('lengthLessThan', () => {
	const foo: string[] = []
	if (lengthLessThan(foo, 3)) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string | undefined
		//@ts-expect-error TS2339: Property '2' does not exist on type 'TupleOfUpToButNotIncluding '.
		// noinspection BadExpressionStatementJS
		foo[2]
	}
})

test('lengthIs', () => {
	const foo: string[] = []
	// noinspection BadExpressionStatementJS
	foo[0] // $ExpectType string | undefined
	if (lengthIs(foo, 3)) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[2] // $ExpectType string
		//@ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '3'.
		// noinspection BadExpressionStatementJS
		foo[3]
	}
})

describe('duplicate functions', () => {
	describe('containsDuplicates', () => {
		test('true', () => assert(containsDuplicates([1, 2, 3, 3])))
		test('false', () => assert(!containsDuplicates(['asdf', 'sdfg', 'dfgh'])))
	})

	test('duplicates', () => assert.deepStrictEqual(findDuplicates([1, 1, 2, 3, 3, 3]), [1, 3]))

	test('removeDuplicates', () =>
		assert.deepStrictEqual(removeDuplicates([1, 1, 2, 3, 3, 3]), [1, 2, 3]))
})

test('concat', () => {
	const array1 = [1, 2, 3] as const
	const array2 = [1, 2, 3, 4] as const
	// noinspection BadExpressionStatementJS
	concat(array1, array2).length // $ExpectType 7
})

describe('indexOf', () => {
	test('normal', () => {
		const value = indexOf(['foo', 'bar', 'baz'], 'baz') // $ExpectType 2
		assert(value === 2)
	})
	test('union', () => {
		const value = indexOf(['foo', 'bar', 'baz'], 'baz' as 'foo' | 'baz')

		//MY GOD WHY IS THERE NO GOOD WAY TO TEST TYPES!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

		//possible value (just checking for no type error)
		// noinspection BadExpressionStatementJS
		value !== 0
		//@ts-expect-error impossibru value
		value !== 1
		//the actual value
		assert(value === 2)
	})
	test('string', () => {
		const value = indexOf(['foo', 'bar', 'baz'] as string[], 'baz' as string)
		//need to check that the type is number, another way since ExpectType shits itself on these types
		// noinspection BadExpressionStatementJS
		value === 100
	})
})
