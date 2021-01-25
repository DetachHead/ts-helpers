import {
	containsDuplicates,
	findDuplicates,
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

test('lengthLessOrEqual', () => {
	const foo: string[] = []
	if (lengthLessOrEqual(foo, 3)) {
		foo
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string | undefined
		// noinspection BadExpressionStatementJS
		foo[2] // $ExpectType string | undefined
		// noinspection BadExpressionStatementJS
		//@ts-expect-error TS2493: Tuple type '[string, string, string]' of length '3' has no element at index '4'.
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
