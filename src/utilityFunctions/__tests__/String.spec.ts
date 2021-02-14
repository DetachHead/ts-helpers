import { charAt, includes, indexOf, join, match, split, substring } from '../String'
import { PowerAssert } from 'typed-nodejs-assert'
import { toStringType } from '../misc'
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

test('substring', () => {
	const value = substring('foobarbaz', 3, 6) //$ExpectType "bar"
	assert(value === 'bar')
})

test('join', () => {
	const value = join([1, 2, 3] as const, ',') // $ExpectType "1,2,3"
	assert(value === '1,2,3')
})

test('split', () => {
	const value = split('1,2,3', ',') // $ExpectType ["1", "2", "3"]
	assert.deepStrictEqual(value, ['1', '2', '3'])
})

describe('indexOf', () => {
	test('substring exists', () => {
		const value = indexOf('foobarbaz', 'bar') // $ExpectType 3
		assert(value === 3)
	})
	test("substring doesn't exist", () => {
		const value = indexOf('foobarbaz', 'qux') // $ExpectType -1
		assert(value === -1)
	})
})

describe('includes', () => {
	test('true', () => {
		const value = includes('foobar', 'bar') // $ExpectType true
		assert(value)
	})
	test('false', () => {
		const value = includes('foobar', 'baz') // $ExpectType false
		assert(!value)
	})
})
