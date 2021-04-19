import {
	add,
	random,
	subtract,
	multiply,
	divide,
	leadingZeros,
	ordinalNumber,
	isGreaterThan,
} from '../Number'
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
			leadingZeros(12 as number, 5) // $ExpectType `${number}`
		})
		test('length', () => {
			leadingZeros(12, 5 as number) // $ExpectType `${number}`
		})
		test('both', () => {
			leadingZeros(12 as number, 5 as number) // $ExpectType `${number}`
		})
	})
	test('negative numbers', () => {
		const value = leadingZeros(-20, 4) // $ExpectType "-0020"
		assert(value === '-0020')
	})
})

describe('ordinal', () => {
	it('1/2/3', () => {
		assert(ordinalNumber(1) === '1st')
		assert(ordinalNumber(12) === '12th')
		assert(ordinalNumber(23) === '23rd')
		assert(
			// @ts-expect-error wrong value
			ordinalNumber(3) !== '3th'
		)
	})
	it('th', () => {
		assert(ordinalNumber(24) === '24th')
		assert(ordinalNumber(0) === '0th')
		assert(
			// @ts-expect-error wrong value
			ordinalNumber(0) !== '1000nd'
		)
	})
	it('value not known at compiletime', () => {
		ordinalNumber(1 as number) // $ExpectType `${number}st` | `${number}nd` | `${number}rd` | `${number}th`
	})
})

describe('comparison', () => {
	describe('isGreaterThan', () => {
		test('true', () => {
			const value = isGreaterThan(5, 4) // $ExpectType true
			assert(value)
		})
		test('false', () => {
			isGreaterThan(5, 20) // $ExpectType false
			const value = isGreaterThan(6, 6) // $ExpectType false
			assert(!value)
		})
		test('big numbers', () => {
			isGreaterThan(5000, 4999) // $ExpectType true
			isGreaterThan(5000, 5001) // $ExpectType false
		})
	})
})
