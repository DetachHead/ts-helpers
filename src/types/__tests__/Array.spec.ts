import { containsDuplicates, lengthGreaterOrEqual, lengthGreaterThan, lengthIs } from '../Array'
import assert from 'assert'

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
