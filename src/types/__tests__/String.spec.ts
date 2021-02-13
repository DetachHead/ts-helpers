import { charAt, match } from '../String'
import { toStringType } from '../../misc'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('match', () => {
	const foo = match('', /a/)
	if (foo !== null) {
		// noinspection BadExpressionStatementJS
		foo[0] // $ExpectType string
		// noinspection BadExpressionStatementJS
		foo[1] // $ExpectType string | undefined
	}
})

describe('toStringType', () => {
	test('value known at compiletime', () => {
		const value = toStringType(123 as const) // $ExpectType "123"
		assert(value === '123')
	})
	test('not known at compiletime', () => {
		const value = toStringType({ foo: 1 }) // $ExpectType string
		assert(value === '[object Object]')
	})
})

test('charAt', () => {
	const value = charAt('asdf', 2) // $ExpectType "d"
	assert(value === 'd')
})
