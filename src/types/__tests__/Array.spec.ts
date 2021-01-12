import {lengthGreaterThan} from '../Array'
import {FixedSizeArray} from '../../utilityTypes'

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
		foo[3] // $ExpectType string | undefined
		// noinspection BadExpressionStatementJS
		foo[4] // $ExpectType string | undefined
	}
})

test('FixedSizeArray', () => {
	const foo: FixedSizeArray<string,4> = ['','','','']
	//@ts-expect-error it's a readonly array
	foo.push('')
})