import { add, random, subtract, multiply, divide, leadingZeros } from '../Number'
import { PowerAssert } from 'typed-nodejs-assert'
import { TupleOf } from '../../utilityTypes/Array'
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
			const num = subtract(5000, 3000) // $ExpectType 2000
			assert(num === 2000)
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

describe('leadingZeros', () => {
	test('values known at compiletime', () => {
		const value = leadingZeros(12, 5) // $ExpectType "00012"
		assert(value === '00012')
	})
	describe('values not known at compiletime', () => {
		test('num', () => {
			leadingZeros(12 as number, 5) // $ExpectType string
		})
		test('length', () => {
			leadingZeros(12, 5 as number) // $ExpectType string
		})
		test('both', () => {
			leadingZeros(12 as number, 5 as number) // $ExpectType string
		})
	})
})
