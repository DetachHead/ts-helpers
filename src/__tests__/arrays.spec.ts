import {lengthGreaterThan} from '../types/Array'

declare const foo: string[]
test('lengthGreaterThan', () => {
	// noinspection BadExpressionStatementJS
	foo[0] // $ExpectType string | undefined
	if (lengthGreaterThan(foo, 3)) {
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