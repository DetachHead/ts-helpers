import { Add, Multiply, Subtract } from '../Number'
import { testType } from '../../utilityFunctions/misc'

test('multiply', () => {
	testType<Multiply<2 | 3, 5 | 2>>(4)
	testType<Multiply<2 | 3, 5 | 2>>(6)
	testType<Multiply<2 | 3, 5 | 2>>(10)
	testType<Multiply<2 | 3, 5 | 2>>(15)
	//@ts-expect-error not valid product
	testType<Multiply<2 | 3, 5 | 2>>(11)
	//@ts-expect-error not valid product
	testType<Multiply<2 | 3, 5 | 2>>(8)
})

test('add', () => {
	testType<Add<2 | 5, 10 | 20>>(12)
	testType<Add<2 | 5, 10 | 20>>(15)
	testType<Add<2 | 5, 10 | 20>>(22)
	testType<Add<2 | 5, 10 | 20>>(25)
	//@ts-expect-error not valid sum
	testType<Add<2 | 5, 10 | 20>>(20)
})

test('subtract', () => {
	testType<Subtract<10 | 20, 2 | 3>>(8)
	testType<Subtract<10 | 20, 2 | 3>>(18)
	testType<Subtract<10 | 20, 2 | 3>>(7)
	testType<Subtract<10 | 20, 2 | 3>>(17)
	//@ts-expect-error not valid
	testType<Subtract<10 | 20, 2 | 3>>(16)
})
