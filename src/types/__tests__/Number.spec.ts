import { add, random, subtract, multiply, divide } from '../Number'
import { TupleOf } from 'utility-types'
import { PowerAssert } from 'typed-nodejs-assert'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert: PowerAssert = require('power-assert')

test('random', () => {
	const arr: TupleOf<number, 5> = [1, 2, 3, 4, 5]
	const foo = random(1, 4)
	// noinspection BadExpressionStatementJS
	arr[foo] // $ExpectType number
})

describe('arithmetic', () => {
	describe('add', () => {
		test('normal numbers', () => {
			const num = add(1, 3) // $ExpectType 4
			assert(num === 4)
		})
		test('big numbers', () => {
			const num = add(1000, 3000) // $ExpectType 4000
			assert(num === 4000)
		})
	})
	describe('subtract', () => {
		test('normal numbers', () => {
			const num = subtract(5, 3) // $ExpectType 2
			assert(num === 2)
		})
		test('big numbers', () => {
			const num = subtract(10000, 3000) // $ExpectType 7000
			assert(num === 7000)
		})
	})
	describe('multiply', () => {
		test('normal numbers', () => {
			const num = multiply(5, 3) // $ExpectType 15
			assert(num === 15)
		})
	})
	describe('divide', () => {
		test('normal numbers', () => {
			const num = divide(10, 2) // $ExpectType 5
			assert(num === 5)
		})
	})
})
